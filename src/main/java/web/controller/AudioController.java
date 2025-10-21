package web.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.AudioDto;
import web.model.dto.TtsRequestDto;
import web.service.AudioService;
import web.service.TranslationService;

import java.io.IOException;
import java.util.List;

// [*] 예외 핸들러 : 전역으로도 사용 가능
@Log4j2
@RestControllerAdvice(assignableTypes = {AudioController.class}) // 해당 컨트롤러에서만 적용
class AudioExceptionHandler {
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



@Slf4j
@RestController
@RequestMapping("/saykorean/admin/audio")
@RequiredArgsConstructor
public class AudioController {

    // [*] DI
    private final AudioService audioService;
    private final TranslationService translationService;

    // [AAD-01] 음성파일 생성 createAudio()
    // 음성 테이블 레코드를 추가한다
    // 매개변수 AudioDto
    // 반환 int (PK)
    // * 추후 추가
    // 1-1) 음성파일을 직접 등록한다.
    // 1-2) 텍스트를 읽고 음성파일로 변환 후 등록한다. (파이썬 로직!!) todo
    // URL : http://localhost:8080/saykorean/admin/audio
    // BODY : { "audioName" : "1_kor_voice" , "audioPath" : "/audio/oct_25" , "lang" : 1 , "examNo" : 1 }
    @PostMapping("")
    public ResponseEntity<Integer> createAudio(@ModelAttribute AudioDto audioDto) throws IOException {
        int result = audioService.createAudio(audioDto , audioDto.getAudioFile());
        return ResponseEntity.ok(result);
    }

    // [AAD-01-TTS] 음성파일 생성(TTS 사용)
    // URL : http://localhost:8080/saykorean/admin/audio/tts
    // BODY : { "text": "안녕하세요", "languageCode": "ko-KR", "examNo": 1, "lang": 1 }
    @PostMapping("/tts")
    public ResponseEntity<Integer> createAudioFromTTS(@RequestBody TtsRequestDto ttsRequest) throws IOException {
        try {
            log.info("TTS 요청 - 텍스트: {}, 언어: {}, examNo: {}",
                    ttsRequest.getText() , ttsRequest.getLanguageCode(), ttsRequest.getExamNo());

            // 1. Google TTS API 호출하여 음성 데이터 생성
            byte[] audioData = translationService.textToSpeech(
                    ttsRequest.getText() ,
                    ttsRequest.getLanguageCode()
            );
            
            // 2. AudioDto 생성
            AudioDto audioDto = new AudioDto();
            audioDto.setExamNo(ttsRequest.getExamNo());
            audioDto.setLang(ttsRequest.getLang());

            // 3. 음성 파일 저장
            int result = audioService.createAudioFromBytes(audioDto, audioData);

            log.info("TTS 음성 파일 생성 완료 - audioNo: {}" , result);
            return ResponseEntity.ok(result);

        } catch (Exception e){
            log.error("TTS 음성 파일 생성 실패" , e);
            throw new RuntimeException("음성 파일 생성에 실패했습니다: " + e.getMessage());
        }
    }


    // [AAD-02] 음성파일 수정	updateAudio()
    // 음성 테이블 레코드를 변경한다.
    // 매개변수 AudioDto
    // 반환 int
    // * 추후 추가
    // 1-1) 음성파일을 직접 변경한다.
    // 1-2) 텍스트를 읽고 음성파일로 변환 후 수정한다. (파이썬 로직!!) todo
    // URL : http://localhost:8080/saykorean/admin/audio
    // BODY : { "audioNo" : 1 , "audioName" : "1_kor_voice" , "audioPath" : "/audio/oct_25" , "lang" : 1 , "examNo" : 1 }
    @PutMapping("")
    public ResponseEntity<Integer> updateAudio(AudioDto audioDto) throws IOException {
        int result = audioService.updateAudio(audioDto, audioDto.getNewAudioFile());
        return ResponseEntity.ok(result);
    }


    // [AAD-03]	음성파일 삭제	deleteAudio()
    // 음성 테이블 레코드를 삭제한다.
    // 매개변수 int audioNo
    // 반환 int
    // URL : http://localhost:8080/saykorean/admin/audio?audioNo=75
    @DeleteMapping("")
    public ResponseEntity<Integer> deleteAudio(@RequestParam int audioNo) {
        int result = audioService.deleteAudio(audioNo);
        return ResponseEntity.ok(result);
    }

    // [AAD-04]	음성파일 전체조회 getAudio()
    // 음성 테이블 레코드를 모두 조회한다
    // 반환 List<AudioDto>
    // URL : http://localhost:8080/saykorean/admin/audio
    @GetMapping("")
    public ResponseEntity<List<AudioDto>> getAudio() {
        List<AudioDto> result = audioService.getAudio();
        return ResponseEntity.ok(result);
    }

    // [AAD-05] 음성파일 개별조회 getIndiAudio()
    // 음성 테이블 레코드를 조회한다
    // 매개변수 int audioNo
    // 반환 AudioDto
    // URL : http://localhost:8080/saykorean/admin/audio/indi?audioNo=141
    @GetMapping("/indi")
    public ResponseEntity<AudioDto> getIndiAudio(@RequestParam int audioNo) {
        AudioDto result = audioService.getIndiAudio(audioNo);
        return ResponseEntity.ok(result);
    }


}
