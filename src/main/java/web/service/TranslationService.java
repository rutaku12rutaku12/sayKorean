package web.service;

import com.google.api.client.util.Value;
import com.google.cloud.texttospeech.v1.*;
import com.google.cloud.translate.v3.LocationName;
import com.google.cloud.translate.v3.TranslateTextRequest;
import com.google.cloud.translate.v3.TranslateTextResponse;
import com.google.cloud.translate.v3.TranslationServiceClient;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.TranslatedDataDto;
import web.model.dto.TranslationRequestDto;

import java.io.IOException;

/*
     * Google Cloud API 인증 설정:
     * 이 서비스는 Google Cloud API를 사용합니다.
     * API를 사용하려면 인증이 필요합니다.
     * GOOGLE_APPLICATION_CREDENTIALS 환경 변수를 설정하여 서비스 계정 키 파일의 경로를 지정해야 합니다.
     * 예: export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/keyfile.json"
*/

@Service
@Transactional
@Log4j2
public class TranslationService {

    @Value("${google.cloud.projectId}")
    private String projectId;

    // [*] 구글 번역 API (한국어 텍스트를 지정 언어로 번역)

    public String translateText(String targetLanguage, String text) throws IOException {
        // TranslationServiceClient는 Google Cloud Translation API를 호출하는 클라이언트 객체.
        // try-with-resources를 사용하면 사용이 끝난 후 자동으로 close() 됨.
        try (TranslationServiceClient client =  TranslationServiceClient.create()) {
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
            // 응답 중 첫 번째 인덱스 번역 결과를 꺼내 반환하기
            return response.getTranslations(0).getTranslatedText();
        }
    }

    // [1] 구글 번역 API (한국어 텍스트 번역 후 반환)
    public TranslatedDataDto translateAll(TranslationRequestDto requestDto) throws IOException {
        // 1-1. 주제/해설/예문 한국어 텍스트 입력 시 응답할 객체를 생성
        TranslatedDataDto response = new TranslatedDataDto();

        // 1-2. 주제 번역
        if(requestDto.getThemeKo() != null && !requestDto.getThemeKo().isEmpty()) {
            response.setThemeJp(translateText("jp" , requestDto.getThemeKo()));
            response.setThemeCn(translateText("cn" , requestDto.getThemeKo()));
            response.setThemeEn(translateText("en" , requestDto.getThemeKo()));
            response.setThemeEs(translateText("es" , requestDto.getThemeKo()));
        }

        // 1-3. 해설 번역
        if(requestDto.getCommenKo() != null && !requestDto.getCommenKo().isEmpty()){
            response.setCommenJp(translateText("jp" , requestDto.getCommenKo()));
            response.setCommenCn(translateText("cn" , requestDto.getCommenKo()));
            response.setCommenEn(translateText("en" , requestDto.getCommenKo()));
            response.setCommenEs(translateText("es" , requestDto.getCommenKo()));
        }

        // 1-4. 예문 번역
        if (requestDto.getExamKo() != null && !requestDto.getExamKo().isEmpty()) {
            response.setExamJp(translateText("jp" , requestDto.getExamKo()));
            response.setExamCn(translateText("cn" , requestDto.getExamKo()));
            response.setExamEn(translateText("en" , requestDto.getExamKo()));
            response.setExamEs(translateText("es" , requestDto.getExamKo()));
        }

        // 1-5. 리턴
        return response;

        // 로마자 변환은 없음 ㅜㅜ
    }

    // [2] 구글 TTS API
    public byte[] textToSpeech(String text , String languageCode) throws IOException {
        try(TextToSpeechClient textToSpeechClient = TextToSpeechClient.create()) {
            SynthesisInput input = SynthesisInput.newBuilder().setText(text).build();

            VoiceSelectionParams voice =
                    VoiceSelectionParams.newBuilder()
                    .setLanguageCode(languageCode)
                            .setSsmlGender(SsmlVoiceGender.NEUTRAL)
                            .build();

            AudioConfig audioConfig = AudioConfig.newBuilder().setAudioEncoding(AudioEncoding.MP3).build();

            SynthesizeSpeechResponse response = textToSpeechClient.synthesizeSpeech(input , voice , audioConfig);

            return response.getAudioContent().toByteArray();
        }
    }

    // [3] 제미나이 채점 API (스프링 & 리액트 처리 후 ㄱㄱ)
    public int scoreWithGemini(String userInput) {
        log.info("제미나이 API를 이용한 채점 로직 호출 " , userInput);
        return (int) (Math.random() * 100);
    }


}
