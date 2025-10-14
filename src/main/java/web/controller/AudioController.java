package web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.service.AudioService;

@RestController
@RequestMapping("/saykorean/admin/audio")
@RequiredArgsConstructor
public class AudioController {

    // [*] DI
    private final AudioService audioService;

    // [AAD-01] 음성파일 생성 createAudio()
    // 음성 테이블 레코드를 추가한다
    // 매개변수 AudioDto
    // 반환 int (PK)
    // * 추후 추가
    // 1-1) 음성파일을 직접 등록한다.
    // 1-2) 텍스트를 읽고 음성파일로 변환 후 등록한다. (파이썬 로직!!) todo


    // [AAD-02] 음성파일 수정	updateAudio()
    // 음성 테이블 레코드를 변경한다.
    // 매개변수 AudioDto
    // 반환 int
    // * 추후 추가
    // 1-1) 음성파일을 직접 변경한다.
    // 1-2) 텍스트를 읽고 음성파일로 변환 후 수정한다. (파이썬 로직!!) todo

    // [AAD-03]	음성파일 삭제	deleteAudio()
    // 음성 테이블 레코드를 삭제한다.
    // 매개변수 int audioNo
    // 반환 int

    // [AAD-04]	음성파일 전체조회 getAudio()
    // 음성 테이블 레코드를 모두 조회한다
    // 반환 List<AudioDto>

    // [AAD-05] 음성파일 개별조회 getIndiAudio()
    // 음성 테이블 레코드를 조회한다
    // 매개변수 int audioNo
    // 반환 AudioDto

}
