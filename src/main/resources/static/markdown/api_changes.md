# API 구현 및 프론트엔드 연동 변경사항

안녕하세요! 요청하신 자동 번역 및 API 연동 기능 구현을 위한 코드 변경사항입니다.
아래 내용을 각 파일에 적용해 주세요.

**중요 설정:**
1.  `C:/Users/TJ-BU-702-P21/Desktop/sayKorean/src/main/resources/application.properties` 파일에 본인의 Google Cloud Project ID를 입력해야 합니다.
2.  Google Cloud API 인증을 위해 서비스 계정 키를 발급받고, 해당 키 파일의 경로를 `GOOGLE_APPLICATION_CREDENTIALS` 환경 변수로 설정해야 합니다.

---

### 1. 신규 파일 생성

#### `C:/Users/TJ-BU-702-P21/Desktop/sayKorean/src/main/java/web/model/dto/translation/TranslationRequestDto.java`

자동 번역 요청 시 프론트엔드에서 백엔드로 보낼 데이터를 담는 DTO 입니다.

```java
package web.model.dto.translation;

import lombok.Data;

@Data
public class TranslationRequestDto {
    private String themeKo;
    private String commenKo;
    private String examKo;
}
```

#### `C:/Users/TJ-BU-702-P21/Desktop/sayKorean/src/main/java/web/model/dto/translation/TranslatedDataDto.java`

번역된 텍스트를 백엔드에서 프론트엔드로 전달할 때 사용하는 DTO 입니다.

```java
package web.model.dto.translation;

import lombok.Data;

@Data
public class TranslatedDataDto {
    private String themeJp;
    private String themeCn;
    private String themeEn;
    private String themeEs;
    private String commenJp;
    private String commenCn;
    private String commenEn;
    private String commenEs;
    private String examJp;
    private String examCn;
    private String examEn;
    private String examEs;
    private String examRoman;
}
```

---

### 2. 기존 파일 수정

#### `C:/Users/TJ-BU-702-P21/Desktop/sayKorean/src/main/java/web/service/TranslationService.java`

Google Cloud Translation API와 Text-to-Speech API를 호출하는 핵심 로직입니다.

```java
package web.service;

import com.google.cloud.texttospeech.v1.*;
import com.google.cloud.translate.v3.LocationName;
import com.google.cloud.translate.v3.TranslateTextRequest;
import com.google.cloud.translate.v3.TranslateTextResponse;
import com.google.cloud.translate.v3.TranslationServiceClient;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import web.model.dto.translation.TranslatedDataDto;
import web.model.dto.translation.TranslationRequestDto;

import java.io.IOException;

/*
 * Google Cloud API 인증 설정:
 * 이 서비스는 Google Cloud API를 사용합니다.
 * API를 사용하려면 인증이 필요합니다.
 * GOOGLE_APPLICATION_CREDENTIALS 환경 변수를 설정하여 서비스 계정 키 파일의 경로를 지정해야 합니다.
 * 예: export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/keyfile.json"
 */
@Service
@Log4j2
public class TranslationService {

    @Value("${google.cloud.projectId}")
    private String projectId;

    public TranslatedDataDto translateAll(TranslationRequestDto requestDto) throws IOException {
        TranslatedDataDto response = new TranslatedDataDto();

        // 주제 번역
        if (requestDto.getThemeKo() != null && !requestDto.getThemeKo().isEmpty()) {
            response.setThemeJp(translateText("ja", requestDto.getThemeKo()));
            response.setThemeCn(translateText("zh-CN", requestDto.getThemeKo()));
            response.setThemeEn(translateText("en", requestDto.getThemeKo()));
            response.setThemeEs(translateText("es", requestDto.getThemeKo()));
        }

        // 해설 번역
        if (requestDto.getCommenKo() != null && !requestDto.getCommenKo().isEmpty()) {
            response.setCommenJp(translateText("ja", requestDto.getCommenKo()));
            response.setCommenCn(translateText("zh-CN", requestDto.getCommenKo()));
            response.setCommenEn(translateText("en", requestDto.getCommenKo()));
            response.setCommenEs(translateText("es", requestDto.getCommenKo()));
        }

        // 예문 번역
        if (requestDto.getExamKo() != null && !requestDto.getExamKo().isEmpty()) {
            response.setExamJp(translateText("ja", requestDto.getExamKo()));
            response.setExamCn(translateText("zh-CN", requestDto.getExamKo()));
            response.setExamEn(translateText("en", requestDto.getExamKo()));
            response.setExamEs(translateText("es", requestDto.getExamKo()));
            // 로마자 변환은 별도 라이브러리나 로직이 필요합니다.
            // 현재는 구현되어 있지 않으므로, 필요 시 추가 구현이 필요합니다.
            // response.setExamRoman(convertToRoman(requestDto.getExamKo()));
        }

        return response;
    }

    public String translateText(String targetLanguage, String text) throws IOException {
        // TranslationServiceClient는 try-with-resources를 사용하여 자동으로 close()를 호출하도록 합니다.
        try (TranslationServiceClient client = TranslationServiceClient.create()) {
            LocationName parent = LocationName.of(projectId, "global");

            TranslateTextRequest request =
                    TranslateTextRequest.newBuilder()
                            .setParent(parent.toString())
                            .setMimeType("text/plain")
                            .setSourceLanguageCode("ko")
                            .setTargetLanguageCode(targetLanguage)
                            .addContents(text)
                            .build();

            TranslateTextResponse response = client.translateText(request);

            return response.getTranslations(0).getTranslatedText();
        }
    }

    public byte[] textToSpeech(String text, String languageCode) throws IOException {
        try (TextToSpeechClient textToSpeechClient = TextToSpeechClient.create()) {
            SynthesisInput input = SynthesisInput.newBuilder().setText(text).build();

            VoiceSelectionParams voice =
                    VoiceSelectionParams.newBuilder()
                            .setLanguageCode(languageCode) // 예: "ko-KR", "en-US"
                            .setSsmlGender(SsmlVoiceGender.NEUTRAL)
                            .build();

            AudioConfig audioConfig =
                    AudioConfig.newBuilder().setAudioEncoding(AudioEncoding.MP3).build();

            SynthesizeSpeechResponse response =
                    textToSpeechClient.synthesizeSpeech(input, voice, audioConfig);

            return response.getAudioContent().toByteArray();
        }
    }

    public int scoreWithGemini(String userInput) {
        log.info("Gemini API를 이용한 채점 로직 호출 (입력: {})", userInput);
        // TODO: Gemini API 호출 및 채점 로직을 구현해야 합니다.
        // 현재는 임의의 점수를 반환합니다.
        return (int) (Math.random() * 100);
    }
}
```

#### `C:/Users/TJ-BU-702-P21/Desktop/sayKorean/src/main/java/web/controller/AdminStudyController.java`

자동 번역을 위한 새로운 API 엔드포인트를 추가합니다.

```java
package web.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.ExamDto;
import web.model.dto.GenreDto;
import web.model.dto.StudyDto;
import web.model.dto.translation.TranslatedDataDto;
import web.model.dto.translation.TranslationRequestDto;
import web.service.AdminStudyService;
import web.service.TranslationService;

import java.io.IOException;
import java.util.List;


// [*] 예외 핸들러 : 전역으로도 사용 가능
@Log4j2
@RestControllerAdvice(assignableTypes = {AdminStudyController.class}) // 해당 컨트롤러에서만 적용
class AdminStudyExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        // 로그 에러 개발자에게 반환
        log.error("에러 발생 : {}", e.getMessage(), e);

        // 클라이언트에게 보낼 메시지는 명확하게!
        String userMessage = "요청 처리 중 오류 발생했습니다.";
        if (e.getMessage().contains("Duplicate entry")) {
            userMessage = "이미 존재하는 데이터입니다.";
        } else if (e.getMessage().contains("foreign key constraint")) {
            userMessage = "연관된 데이터가 있어 삭제할 수 없습니다.";
        }

        // 클라이언트 메시지 반환
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(userMessage);
    }
}

@RestController
@RequestMapping("/saykorean/admin/study")
@RequiredArgsConstructor
public class AdminStudyController {
    // [*] DI
    private final AdminStudyService adminStudyService;
    private final TranslationService translationService;

    // [AUTO-TRANSLATE] 자동 번역
    @PostMapping("/translate")
    public ResponseEntity<TranslatedDataDto> translateTexts(@RequestBody TranslationRequestDto requestDto) {
        try {
            TranslatedDataDto response = translationService.translateAll(requestDto);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("Translation failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // [AGR-01] 장르 생성
    @PostMapping("/genre")
    public ResponseEntity<Integer> createGenre(@RequestBody GenreDto genreDto) {
        int result = adminStudyService.createGenre(genreDto);
        return ResponseEntity.ok(result);
    }

    // [AGR-02] 장르 전체조회
    @GetMapping("/genre")
    public ResponseEntity<List<GenreDto>> getGenre() {
        List<GenreDto> result = adminStudyService.getGenre();
        return ResponseEntity.ok(result);
    }

    // [AGR-03] 장르 삭제
    @DeleteMapping("/genre")
    public ResponseEntity<Integer> deleteGenre(@RequestParam int genreNo) {
        int result = adminStudyService.deleteGenre(genreNo);
        return ResponseEntity.ok(result);
    }

    // [AST-01] 교육 생성
    @PostMapping("")
    public ResponseEntity<Integer> createStudy(@RequestBody StudyDto studyDto) {
        int result = adminStudyService.createStudy(studyDto);
        return ResponseEntity.ok(result);
    }

    // [AST-02] 교육 수정
    @PutMapping("")
    public ResponseEntity<Integer> updateStudy(@RequestBody StudyDto studyDto) {
        int result = adminStudyService.updateStudy(studyDto);
        return ResponseEntity.ok(result);
    }

    // [AST-03] 교육 삭제
    @DeleteMapping("")
    public ResponseEntity<Integer> deleteStudy(@RequestParam int studyNo) {
        int result = adminStudyService.deleteStudy(studyNo);
        return ResponseEntity.ok(result);
    }

    // [AST-04] 교육 전체조회
    @GetMapping("")
    public ResponseEntity<List<StudyDto>> getStudy() {
        List<StudyDto> result = adminStudyService.getStudy();
        return ResponseEntity.ok(result);
    }

    // [AST-05] 교육 개별조회
    @GetMapping("/indi")
    public ResponseEntity<StudyDto> getIndiStudy(@RequestParam int studyNo) {
        StudyDto result = adminStudyService.getIndiStudy(studyNo);
        return ResponseEntity.ok(result);
    }

    // [AEX-01] 예문 생성
    @PostMapping("/exam")
    public ResponseEntity<Integer> createExam(ExamDto examDto) throws IOException {
        int result = adminStudyService.createExam(examDto , examDto.getImageFile() );
        return ResponseEntity.ok(result);
    }

    // [AEX-02] 예문 수정
    @PutMapping("/exam")
    public ResponseEntity<Integer> updateExam(ExamDto examDto) throws IOException {
        int result = adminStudyService.updateExam(examDto, examDto.getNewImageFile());
        return ResponseEntity.ok(result);
    }

    // [AEX-03] 예문 삭제
    @DeleteMapping("/exam")
    public ResponseEntity<Integer> deleteExam(@RequestParam int examNo) {
        int result = adminStudyService.deleteExam(examNo);
        return ResponseEntity.ok(result);
    }

    // [AEX-04] 예문 전체조회
    @GetMapping("/exam")
    public ResponseEntity<List<ExamDto>> getExam() {
        List<ExamDto> result = adminStudyService.getExam();
        return ResponseEntity.ok(result);
    }

    // [AEX-05] 예문 개별조회
    @GetMapping("/exam/indi")
    public ResponseEntity<ExamDto> getIndiExam(@RequestParam int examNo) {
        ExamDto result = adminStudyService.getIndiExam(examNo);
        return ResponseEntity.ok(result);
    }
}
```

#### `C:/Users/TJ-BU-702-P21/Desktop/sayKorean/src/main/resources/application.properties`

Google Cloud Project ID 설정을 추가합니다.

```properties
# .properties 파일은 프로젝트 설정 파일로, apprentice.properties 는 별도로 관리 가능

# [1] 서버 포트 설정
server.port=8080

# [2] JDBC 데이터베이스 연결 설정 , DAO 계층에서 사용될 정보
# 1. 연결할 db의 주소
spring.datasource.url=jdbc:mysql://localhost:3306/sayKorean?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8
# 2. 연결할 db의 사용자 이름
spring.datasource.username=root
# 3. 연결할 db의 비밀번호 , 실제 운영 시에는 깃허브에 올리지 않도록 주의
spring.datasource.password=1234

# [3] 로깅 설정
# 로그 레벨 기본값은 info. 필요에 따라 debug 로 변경 가능
# logging.level.root=warn

# 1. 로그 레벨 단계
# 순서 : debug < info < warn < error
# info 로 설정하면 info/warn/error 레벨 로그 출력
# warn 으로 설정하면 warn/error 로그만 출력
# logging.level=warn

# 2. 로그 파일 저장 위치 (gitignore에 반드시 추가해야 함)
# logging.file.name=logs/app.log

# 3. 로그 파일 용량/개수 제한
logging.logback.rollingpolicy.max-file-size=1MB
# 3-2 : 로그 파일 최대 10개까지 보관
logging.logback.rollingpolicy.max-history=10

# 4. 스프링 부트 시작 시 불필요한 로그를 줄이는 설정 (필요 시 주석 해제)
# spring.main.log-startup-info=false
# logging.level.org.springframework.boot.web=warn
# logging.level.org.springframework.boot.web.embedded.tomcat=warn
# logging.level.org.apache.catalina=warn
# logging.level.org.apache.coyote=warn
# logging.level.org.springframework.web=warn

# 5. 로그 출력 포맷
# %msg : 로그 메시지 , %n : 줄바꿈 , %d{yyyy-MM-dd HH:mm:ss} : 날짜/시간
# %level : 로그 레벨 , %logger : 로그 발생 위치
# logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} %msg %n
# logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} %level %logger %msg %n

# 6. 파일 업로드 최대 크기 설정 (2MB보다 충분히 여유 있게)
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# 7. SQL schema와 data Spring 실행 시 자동 연결
spring.sql.init.mode=always
spring.sql.init.encoding=UTF-8
spring.sql.init.schema-locations=classpath:/sql/schema.sql
spring.sql.init.data-locations=classpath:/sql/data.sql

# 8. Google API Key
google.api.key=AIzaSyAGUAiduMcKtmTeRFXN6feqhbwyjZna84M

# 9. Google Cloud Project ID
# Google Cloud Platform 프로젝트 ID를 입력해주세요.
# 예: my-gcp-project-12345
google.cloud.projectId=YOUR_PROJECT_ID_HERE
```

#### `C:/Users/TJ-BU-702-P21/Desktop/sayKorean/src/main/saykorean/src/api/adminApi.js`

자동 번역 API 호출 함수를 추가합니다.

```javascript
import axios from "axios";

// 기본 주소값 설정
const BASE_URL = "http://localhost:8080/saykorean/admin";

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// FormData 인스턴스
const apiFormData = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

// [1] 장르 API
export const genreApi = {
    // 1) 장르 목록 조회
    getAll: () => api.get("/study/genre"),
    // 2) 장르 생성
    create: (genreDto) => api.post("/study/genre", genreDto),
    // 3) 장르 삭제
    delete: (genreNo) => api.delete(`/study/genre?genreNo=${genreNo}`),
};

// [2] 교육(주제/해설) API
export const studyApi = {
    // 1) 교육 목록 조회
    getAll: () => api.get("/study"),
    // 2) 교육 상세 조회
    getIndi: (studyNo) => api.get(`/study/indi?studyNo=${studyNo}`),
    // 3) 교육 생성
    create: (studyDto) => api.post("/study", studyDto),
    // 4) 교육 수정
    update: (studyDto) => api.put("/study", studyDto),
    // 5) 교육 삭제
    delete: (studyNo) => api.delete(`/study?studyNo=${studyNo}`),
    // 6) 자동 번역
    translate: (translationRequestDto) => api.post("/study/translate", translationRequestDto),
};

// [3] 예문 API
export const examApi = {
    // 1) 예문 목록 조회
    getAll: () => api.get("/study/exam"),
    // 2) 예문 상세 조회
    getIndi: (examNo) => api.get(`/study/exam/indi?examNo=${examNo}`),
    // 3) 예문 생성
    create: (examDto) => {
        const formData = new FormData();
        Object.keys(examDto).forEach(key => {
            if (key !== "imageFile" && examDto[key] != null && examDto[key] !== undefined) {
                formData.append(key, examDto[key]);
            }
        });
        if (examDto.imageFile) {
            formData.append("imageFile", examDto.imageFile);
        }
        return apiFormData.post("/study/exam", formData);
    },
    // 4) 예문 수정
    update: (examDto) => {
        const formData = new FormData();
        Object.keys(examDto).forEach(key => {
            if (key !== "newImageFile" && examDto[key] != null && examDto[key] !== undefined) {
                formData.append(key, examDto[key]);
            }
        });
        if (examDto.newImageFile) {
            formData.append('newImageFile', examDto.newImageFile);
        }
        return apiFormData.put('/study/exam', formData);
    },
    // 5) 예문 삭제
    delete: (examNo) => api.delete(`/study/exam?examNo=${examNo}`),
};

// [4] 음성 API
export const audioApi = {
    // 1) 음성 목록 조회
    getAll: () => api.get('/audio'),
    // 2) 음성 상세 조회
    getIndi: (audioNo) => api.get(`/audio/indi?audioNo=${audioNo}`),
    // 3) 음성 생성
    create: (audioDto) => {
        const formData = new FormData();
        Object.keys(audioDto).forEach(key => {
            if (key !== "audioFile" && audioDto[key] !== null && audioDto[key] !== undefined) {
                formData.append(key, audioDto[key]);
            }
        });
        if (audioDto.audioFile) {
            formData.append('audioFile', audioDto.audioFile);
        }
        return apiFormData.post('/audio', formData);
    },
    // 4) 음성 수정
    update: (audioDto) => {
        const formData = new FormData();
        Object.keys(audioDto).forEach(key => {
            if (key !== 'newAudioFile' && audioDto[key] !== null && audioDto[key] !== undefined) {
                formData.append(key, audioDto[key]);
            }
        });
        if (audioDto.newAudioFile) {
            formData.append('newAudioFile', audioDto.newAudioFile);
        }
        return apiFormData.put('/audio', formData);
    },
    // 5) 음성 삭제
    delete: (audioNo) => api.delete(`/audio?audioNo=${audioNo}`),
};

export default api;
```

#### `C:/Users/TJ-BU-702-P21/Desktop/sayKorean/src/main/saykorean/src/adminPages/AdminStudyCreate.jsx`

자동 번역 버튼과 관련 로직을 추가하여 사용자 편의성을 높입니다.

```jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { audioApi, genreApi, studyApi, examApi } from "../api/adminApi";
import { setGenres, setLoading, setError } from "../store/adminSlice";

export default function AdminStudyCreate(props) {

    // [*] 가상DOM, 리덕스
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const genres = useSelector(state => state.admin.genres);

    // [*] 장르 상태
    const [newGenreName, setNewGenreName] = useState("");
    const [selectedGenreNo, setSelectedGenreNo] = useState("");

    // [*] 교육 상태
    const [studyData, setStudyData] = useState({
        themeKo: "",
        themeJp: "",
        themeCn: "",
        themeEn: "",
        themeEs: "",
        commenKo: "",
        commenJp: "",
        commenCn: "",
        commenEn: "",
        commenEs: "",
    });

    // [*] 예문 관련 상태 (배열 관리)
    const [examList, setExamList] = useState([
        {
            examKo: "",
            examRoman: "",
            examJp: "",
            examCn: "",
            examEn: "",
            examEs: "",
            imageFile: null,
            audioFiles: [] // 여러 음성 파일
        }
    ])

    // [*] 컴포넌트 마운트 시 장르 목록 불러오기
    useEffect(() => {
        fetchGenres();
    }, []);

    // [1-1] 장르 목록 불러오기
    const fetchGenres = async () => {
        try {
            const r = await genreApi.getAll();
            dispatch(setGenres(r.data));
        } catch (e) {
            console.error("장르 목록 조회 실패: ", e);
            alert("장르 목록을 불러올 수 없습니다.");
        }
    };

    // [1-2] 새 장르 생성
    const handleCreateGenre = async () => {
        if (!newGenreName.trim()) {
            alert("장르명을 입력해주세요.");
            return;
        }

        try {
            await genreApi.create({ genreName: newGenreName });
            alert("장르가 생성되었습니다.");
            setNewGenreName("");
            fetchGenres(); // 목록 새로고침
        } catch (e) {
            console.error("장르 생성 실패: ", e);
            alert("장르 생성에 실패했습니다.")
        }
    }

    // [2] 주제 입력 핸들러
    const handleStudyChange = (field, value) => {
        setStudyData(e => ({
            ...e,
            [field]: value
        }));
    };

    // [2-1] 주제/해설 자동 번역 핸들러
    const handleTranslateStudy = async () => {
        if (!studyData.themeKo.trim() && !studyData.commenKo.trim()) {
            alert("번역할 한국어 주제 또는 해설을 입력해주세요.");
            return;
        }

        try {
            dispatch(setLoading(true));
            const response = await studyApi.translate({
                themeKo: studyData.themeKo,
                commenKo: studyData.commenKo
            });
            const { themeJp, themeCn, themeEn, themeEs, commenJp, commenCn, commenEn, commenEs } = response.data;

            setStudyData(prev => ({
                ...prev,
                themeJp: themeJp || prev.themeJp,
                themeCn: themeCn || prev.themeCn,
                themeEn: themeEn || prev.themeEn,
                themeEs: themeEs || prev.themeEs,
                commenJp: commenJp || prev.commenJp,
                commenCn: commenCn || prev.commenCn,
                commenEn: commenEn || prev.commenEn,
                commenEs: commenEs || prev.commenEs,
            }));

            alert("주제 및 해설 번역이 완료되었습니다.");

        } catch (e) {
            console.error("주제/해설 번역 실패:", e);
            alert("번역 중 오류가 발생했습니다.");
            dispatch(setError(e.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    // [3-1] 예문 추가
    const handleAddExam = () => {
        setExamList(e => [...e, {
            examKo: "",
            examRoman: "",
            examJp: "",
            examCn: "",
            examEn: "",
            examEs: "",
            imageFile: null,
            audioFiles: []
        }]);
    };

    // [3-2] 예문 삭제
    const handleRemoveExam = (index) => {
        setExamList(e => e.filter((_, i) => i !== index));
    };

    // [3-3] 예문 입력 핸들러
    const handleExamChange = (index, field, value) => {
        setExamList(e => {
            const newList = [...e];
            newList[index] = {
                ...newList[index],
                [field]: value
            };
            return newList;
        })
    };

    // [3-4] 예문 자동 번역 핸들러
    const handleTranslateExam = async (index) => {
        const exam = examList[index];
        if (!exam.examKo.trim()) {
            alert("번역할 한국어 예문을 입력해주세요.");
            return;
        }

        try {
            dispatch(setLoading(true));
            const response = await studyApi.translate({ examKo: exam.examKo });
            const { examJp, examCn, examEn, examEs, examRoman } = response.data;

            setExamList(prev => {
                const newList = [...prev];
                newList[index] = {
                    ...newList[index],
                    examJp: examJp || newList[index].examJp,
                    examCn: examCn || newList[index].examCn,
                    examEn: examEn || newList[index].examEn,
                    examEs: examEs || newList[index].examEs,
                    examRoman: examRoman || newList[index].examRoman,
                };
                return newList;
            });
            alert(`${index + 1}번째 예문 번역이 완료되었습니다.`);
        } catch (e) {
            console.error("예문 번역 실패:", e);
            alert("예문 번역 중 오류가 발생했습니다.");
            dispatch(setError(e.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    // [4] 이미지 파일 선택 핸들러
    const handleImageFileChange = (index, file) => {
        setExamList(e => {
            const newList = [...e];
            newList[index] = {
                ...newList[index],
                imageFile: file
            };
            return newList;
        })
    }

    // [5] 음성 파일 추가 핸들러
    const handleAddAudioFile = (examIndex, lang, file) => {
        setExamList(e => {
            const newList = [...e];
            newList[examIndex].audioFiles.push({ lang, file });
            return newList;
        })
    }

    // [5-1] 음성 파일 삭제 핸들러
    const handleRemoveAudioFile = (examIndex, audioIndex) => {
        setExamList(e => {
            const newList = [...e];
            newList[examIndex].audioFiles = newList[examIndex].audioFiles.filter((_, i) => i !== audioIndex);
            return newList;
        })
    }

    // [6] 전체 데이터 유효성 검사
    const validateData = () => {
        if (!selectedGenreNo) {
            alert("장르를 선택해주세요.");
            return false;
        }

        if (!studyData.themeKo.trim()) {
            alert("한국어 주제를 입력해주세요.");
            return false;
        }

        if (examList.length === 0) {
            alert("최소 1개의 예문을 입력해주세요.");
            return false;
        }

        for (let i = 0; i < examList.length; i++) {
            if (!examList[i].examKo.trim()) {
                alert(`${i + 1}번째 예문의 한국어를 입력해주세요.`);
                return false;
            }
        }

        return true;
    }

    // [7] 교육 등록 실행
    const handleSubmit = async () => {
        if (!validateData()) return;

        try {
            dispatch(setLoading(true));

            // 1. 주제 생성
            const studyResponse = await studyApi.create({
                ...studyData,
                genreNo: parseInt(selectedGenreNo)
            });
            const createdStudyNo = studyResponse.data;
            console.log("주제 생성 완료, studyNo:", createdStudyNo);

            // 2. for문으로 각 예문 생성
            for (let i = 0; i < examList.length; i++) {
                const exam = examList[i];

                const examResponse = await examApi.create({
                    ...exam,
                    studyNo: createdStudyNo,
                    imageFile: exam.imageFile
                });
                const createdExamNo = examResponse.data;
                console.log(`Exam ${i + 1} 생성 완료, examNo:`, createdExamNo);

                // 3. 해당 예문의 음성 파일 생성
                for (let j = 0; j < exam.audioFiles.length; j++) {
                    const audioFile = exam.audioFiles[j];

                    await audioApi.create({
                        lang: audioFile.lang,
                        examNo: createdExamNo,
                        audioFile: audioFile.file
                    })
                    console.log(`Audio ${j + 1} 생성 완료`);
                }
            }

            alert('교육이 성공적으로 등록되었습니다.')
            navigate('/admin/study');

        } catch (e) {
            console.error("교육 등록 실패: ", e);
            alert("교육 등록 중 오류가 발생했습니다.")
            dispatch(setError(e.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return (<>
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2>교육 등록</h2>

            {/* 장르 섹션 */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>1. 장르 선택</h3>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="text"
                        placeholder="새 장르명 입력"
                        value={newGenreName}
                        onChange={(e) => setNewGenreName(e.target.value)}
                        style={{ padding: '8px', width: '300px', marginRight: '10px' }}
                    />
                    <button onClick={handleCreateGenre} style={{ padding: '8px 20px' }}>
                        장르 생성
                    </button>
                </div>
                <select
                    value={selectedGenreNo}
                    onChange={(e) => setSelectedGenreNo(e.target.value)}
                    style={{ padding: '8px', width: '320px' }}
                >
                    <option value="">장르를 선택하세요</option>
                    {genres.map(genre => (
                        <option key={genre.genreNo} value={genre.genreNo}>
                            {genre.genreName}
                        </option>
                    ))}
                </select>
            </div>

            {/* 주제 섹션 */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>2. 주제 입력</h3>
                    <button onClick={handleTranslateStudy} style={{ padding: '8px 20px', backgroundColor: '#FFC107', color: 'black', border: 'none', borderRadius: '4px' }}>
                        주제/해설 자동번역
                    </button>
                </div>

                <div style={{ display: 'grid', gap: '15px' }}>
                    <div>
                        <label>한국어 주제 *</label>
                        <input
                            type="text"
                            value={studyData.themeKo}
                            onChange={(e) => handleStudyChange('themeKo', e.target.value)}
                            style={{ width: '100%', padding: '8px' }}
                            placeholder="예: 안부 묻기"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <label>일본어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeJp}
                                onChange={(e) => handleStudyChange('themeJp', e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div>
                            <label>중국어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeCn}
                                onChange={(e) => handleStudyChange('themeCn', e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div>
                            <label>영어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeEn}
                                onChange={(e) => handleStudyChange('themeEn', e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div>
                            <label>스페인어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeEs}
                                onChange={(e) => handleStudyChange('themeEs', e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label>한국어 해설</label>
                        <textarea
                            value={studyData.commenKo}
                            onChange={(e) => handleStudyChange('commenKo', e.target.value)}
                            style={{ width: '100%', padding: '8px', minHeight: '80px' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <label>일본어 해설</label>
                            <textarea
                                value={studyData.commenJp}
                                onChange={(e) => handleStudyChange('commenJp', e.target.value)}
                                style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                            />
                        </div>
                        <div>
                            <label>중국어 해설</label>
                            <textarea
                                value={studyData.commenCn}
                                onChange={(e) => handleStudyChange('commenCn', e.target.value)}
                                style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                            />
                        </div>
                        <div>
                            <label>영어 해설</label>
                            <textarea
                                value={studyData.commenEn}
                                onChange={(e) => handleStudyChange('commenEn', e.target.value)}
                                style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                            />
                        </div>
                        <div>
                            <label>스페인어 해설</label>
                            <textarea
                                value={studyData.commenEs}
                                onChange={(e) => handleStudyChange('commenEs', e.target.value)}
                                style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 예문 섹션 */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>3. 예문 입력</h3>
                    <button onClick={handleAddExam} style={{ padding: '8px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
                        예문 추가
                    </button>
                </div>

                {examList.map((exam, examIndex) => (
                    <div key={examIndex} style={{ marginBottom: '30px', padding: '15px', border: '2px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h4>예문 {examIndex + 1}</h4>
                            <div>
                                <button
                                    onClick={() => handleTranslateExam(examIndex)}
                                    style={{ padding: '5px 15px', backgroundColor: '#FFC107', color: 'black', border: 'none', borderRadius: '4px', marginRight: '10px' }}
                                >
                                    자동번역
                                </button>
                                {examList.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveExam(examIndex)}
                                        style={{ padding: '5px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 예문 텍스트 입력 */}
                        <div style={{ display: 'grid', gap: '10px', marginBottom: '15px' }}>
                            <input
                                type="text"
                                placeholder="한국어 예문 *"
                                value={exam.examKo}
                                onChange={(e) => handleExamChange(examIndex, 'examKo', e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />
                            <input
                                type="text"
                                placeholder="발음/로마자"
                                value={exam.examRoman}
                                onChange={(e) => handleExamChange(examIndex, 'examRoman', e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="일본어 예문"
                                    value={exam.examJp}
                                    onChange={(e) => handleExamChange(examIndex, 'examJp', e.target.value)}
                                    style={{ padding: '8px' }}
                                />
                                <input
                                    type="text"
                                    placeholder="중국어 예문"
                                    value={exam.examCn}
                                    onChange={(e) => handleExamChange(examIndex, 'examCn', e.target.value)}
                                    style={{ padding: '8px' }}
                                />
                                <input
                                    type="text"
                                    placeholder="영어 예문"
                                    value={exam.examEn}
                                    onChange={(e) => handleExamChange(examIndex, 'examEn', e.target.value)}
                                    style={{ padding: '8px' }}
                                />
                                <input
                                    type="text"
                                    placeholder="스페인어 예문"
                                    value={exam.examEs}
                                    onChange={(e) => handleExamChange(examIndex, 'examEs', e.target.value)}
                                    style={{ padding: '8px' }}
                                />
                            </div>
                        </div>

                        {/* 이미지 파일 */}
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>이미지 파일</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(examIndex, e.target.files[0])}
                                style={{ padding: '8px' }}
                            />
                            {exam.imageFile && <span style={{ marginLeft: '10px', color: '#4CAF50' }}>✓ {exam.imageFile.name}</span>}
                        </div>

                        {/* 음성 파일 */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>음성 파일</label>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <select id={`audioLang-${examIndex}`} style={{ padding: '8px' }}>
                                    <option value={1}>한국어</option>
                                    <option value={2}>영어</option>
                                </select>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    id={`audioFile-${examIndex}`}
                                    style={{ padding: '8px' }}
                                />
                                <button
                                    onClick={() => {
                                        const lang = parseInt(document.getElementById(`audioLang-${examIndex}`).value);
                                        const file = document.getElementById(`audioFile-${examIndex}`).files[0];
                                        if (file) {
                                            handleAddAudioFile(examIndex, lang, file);
                                            document.getElementById(`audioFile-${examIndex}`).value = '';
                                        }
                                    }}
                                    style={{ padding: '8px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}
                                >
                                    음성 추가
                                </button>
                            </div>

                            {/* 추가된 음성 파일 목록 */}
                            {exam.audioFiles.length > 0 && (
                                <div style={{ marginTop: '10px' }}>
                                    {exam.audioFiles.map((audio, audioIndex) => (
                                        <div key={audioIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', padding: '5px', backgroundColor: '#fff', borderRadius: '4px' }}>
                                            <span style={{ flex: 1 }}>
                                                {audio.lang === 1 ? '🇰🇷 한국어' : '🇺🇸 영어'} - {audio.file.name}
                                            </span>
                                            <button
                                                onClick={() => handleRemoveAudioFile(examIndex, audioIndex)}
                                                style={{ padding: '4px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 하단 버튼 */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                <button
                    onClick={() => navigate('/admin/study')}
                    style={{ padding: '15px 40px', fontSize: '16px', backgroundColor: '#9E9E9E', color: 'white', border: 'none', borderRadius: '8px' }}
                >
                    취소
                </button>
                <button
                    onClick={handleSubmit}
                    style={{ padding: '15px 40px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px' }}
                >
                    교육 등록
                </button>
            </div>
        </div>
    </>)
}
```