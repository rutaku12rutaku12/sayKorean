package web.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.texttospeech.v1.*;
import com.google.cloud.translate.v3.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.TestTranslationRequestDto;
import web.model.dto.TranslatedDataDto;
import web.model.dto.TranslatedTestDataDto;
import web.model.dto.TranslationRequestDto;

import java.io.IOException;
import java.io.InputStream;

/*
 * Google Cloud API 인증 설정:
 * 1. src/main/resources/ 폴더에 서비스 계정 JSON 파일을 저장
 * 2. application.properties에 파일명 설정:
 *    google.cloud.credentials.file=your-service-account.json
 *    google.cloud.project.id=your-project-id
 */

@Service
@Transactional
@Log4j2
public class TranslationService {

    @Value("${google.cloud.credentials.file}")
    private String credentialsFile;

    @Value("${google.cloud.projectId}")
    private String projectId;

    // [*] 구글 번역 API 클라이언트 생성 (서비스 계정 인증)
    private TranslationServiceClient createClient() throws IOException {
        log.info("📁 JSON 파일 경로: {}", credentialsFile);
        log.info("🔑 프로젝트 ID: {}", projectId);

        try {
            InputStream credentialsStream = new ClassPathResource(credentialsFile).getInputStream();
            GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream);

            TranslationServiceSettings settings = TranslationServiceSettings.newBuilder()
                    .setCredentialsProvider(() -> credentials)
                    .build();

            log.info("✅ Translation API 클라이언트 생성 성공");
            return TranslationServiceClient.create(settings);
        } catch (Exception e) {
            log.error("❌ Translation API 클라이언트 생성 실패", e);
            throw new IOException("API 클라이언트 생성 실패: " + e.getMessage(), e);
        }
    }

    // [*] 구글 번역 API (한국어 텍스트를 지정 언어로 번역)
    public String translateText(String targetLanguage, String text) throws IOException {
        // 한국어 텍스트가 비어있을 경우 빈 문자열 반환
        if (text == null || text.trim().isEmpty()) {
            return "";
        }
        // TranslationServiceClient는 Google Cloud Translation API를 호출하는 클라이언트 객체.
        // try-with-resources를 사용하면 사용이 끝난 후 자동으로 close() 됨.
        try (TranslationServiceClient client = createClient()) {
            // API 호출에 필요한 parent 값 생성
            LocationName parent = LocationName.of(projectId, "global");
            // Google 번역 API 요청 객체 생성
            TranslateTextRequest request =
                    TranslateTextRequest.newBuilder()
                            .setParent(parent.toString())           // 프로젝트 및 위치 설정
                            .setMimeType("text/plain")              // 텍스트 형식 지정
                            .setSourceLanguageCode("ko")            // 원본 언어 : 한국어
                            .setTargetLanguageCode(targetLanguage)  // 번역 대상 언어
                            .addContents(text)                      // 번역할 실제 텍스트
                            .build();
            // API 호출 -> 번역 요청 실행
            TranslateTextResponse response = client.translateText(request);
            String translatedText = response.getTranslations(0).getTranslatedText();

            log.info("✅ 번역 성공: {} -> {} ({}자)",
                    text.substring(0, Math.min(20, text.length())),
                    targetLanguage,
                    translatedText.length());

            return translatedText;
        } catch (Exception e) {
            log.error("❌ 번역 실패 - 대상 언어: {} , 원본 텍스트: {}", targetLanguage, text, e);
            throw new IOException("번역 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    // [1] 구글 번역 API (한국어 텍스트 번역 후 반환)
    public TranslatedDataDto translateAll(TranslationRequestDto requestDto) throws IOException {
        log.info("🌐 자동번역 시작 - themeKo: {}, commenKo: {}, examKo: {}",
                requestDto.getThemeKo(),
                requestDto.getCommenKo() != null ? requestDto.getCommenKo()
                        .substring(0, Math.min(20, requestDto.getCommenKo().length())) : "null",
                requestDto.getExamKo());
        // 1-1. 주제/해설/예문 한국어 텍스트 입력 시 응답할 객체를 생성
        TranslatedDataDto response = new TranslatedDataDto();

        // 1-2. 주제 번역
        if (requestDto.getThemeKo() != null && !requestDto.getThemeKo().isEmpty()) {
            response.setThemeJp(translateText("ja", requestDto.getThemeKo()));
            response.setThemeCn(translateText("zh", requestDto.getThemeKo()));
            response.setThemeEn(translateText("en", requestDto.getThemeKo()));
            response.setThemeEs(translateText("es", requestDto.getThemeKo()));
        }

        // 1-3. 해설 번역
        if (requestDto.getCommenKo() != null && !requestDto.getCommenKo().isEmpty()) {
            response.setCommenJp(translateText("ja", requestDto.getCommenKo()));
            response.setCommenCn(translateText("zh", requestDto.getCommenKo()));
            response.setCommenEn(translateText("en", requestDto.getCommenKo()));
            response.setCommenEs(translateText("es", requestDto.getCommenKo()));
        }

        // 1-4. 예문 번역
        if (requestDto.getExamKo() != null && !requestDto.getExamKo().isEmpty()) {
            response.setExamJp(translateText("ja", requestDto.getExamKo()));
            response.setExamCn(translateText("zh", requestDto.getExamKo()));
            response.setExamEn(translateText("en", requestDto.getExamKo()));
            response.setExamEs(translateText("es", requestDto.getExamKo()));
        }

        // 1-5. 리턴
        return response;

        // 로마자(발음기호) 변환은 없으므로 파이썬에서 찾아서 하기
    }

    // [*] 시험 제목/문항 자동 번역
    public TranslatedTestDataDto translateTestData(TestTranslationRequestDto requestDto) throws IOException {
        log.info("🌐 시험 자동번역 시작 - testTitle: {}, question: {}",
                requestDto.getTestTitle(),
                requestDto.getQuestion() != null ? requestDto.getQuestion().substring(0, Math.min(20, requestDto.getQuestion().length())) : "null");

        TranslatedTestDataDto response = new TranslatedTestDataDto();

        // 1) 시험 제목 번역
        if (requestDto.getTestTitle() != null && !requestDto.getTestTitle().isEmpty()) {
            response.setTestTitleJp(translateText("ja", requestDto.getTestTitle()));
            response.setTestTitleCn(translateText("zh", requestDto.getTestTitle()));
            response.setTestTitleEn(translateText("en", requestDto.getTestTitle()));
            response.setTestTitleEs(translateText("es", requestDto.getTestTitle()));
        }

        // 2) 문항 질문 번역
        if (requestDto.getQuestion() != null && !requestDto.getQuestion().isEmpty()) {
            response.setQuestionJp(translateText("ja", requestDto.getQuestion()));
            response.setQuestionCn(translateText("zh", requestDto.getQuestion()));
            response.setQuestionEn(translateText("en", requestDto.getQuestion()));
            response.setQuestionEs(translateText("es", requestDto.getQuestion()));
        }

        return response;
    }

    // [2] 구글 TTS API
    // languageCode 형식: ko-KR, en-US, ja-JP, zh-CN, es-ES
    public byte[] textToSpeech(String text, String languageCode) throws IOException {
        InputStream credentialsStream = new ClassPathResource(credentialsFile).getInputStream();
        GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream);
        TextToSpeechSettings settings = TextToSpeechSettings.newBuilder()
                .setCredentialsProvider(() -> credentials)
                .build();

        try (TextToSpeechClient textToSpeechClient = TextToSpeechClient.create(settings)) {
            // 입력 텍스트 설정
            SynthesisInput input = SynthesisInput.newBuilder()
                    .setText(text)
                    .build();

            // 음성 설정
            VoiceSelectionParams voice =
                    VoiceSelectionParams.newBuilder()
                            .setLanguageCode(languageCode)
                            .setSsmlGender(SsmlVoiceGender.NEUTRAL)
                            .build();

            // 오디오 설정 (MP3 포맷)
            AudioConfig audioConfig = AudioConfig.newBuilder()
                    .setAudioEncoding(AudioEncoding.MP3)
                    .build();

            // TTS 요청 실행
            SynthesizeSpeechResponse response = textToSpeechClient.synthesizeSpeech(
                    input, 
                    voice, 
                    audioConfig
            );

            // 바이트 배열로 반환
            return response.getAudioContent().toByteArray();
        }
    }

    // [3] 제미나이 채점 API (스프링 & 리액트 처리 후 ㄱㄱ -> 유진님이 잘 처리함)
    public int scoreWithGemini(String userInput) {
        log.info("제미나이 API를 이용한 채점 로직 호출 ", userInput);
        return (int) (Math.random() * 100);
    }


}
