package web.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TtsRequestDto {
    private String text;           // TTS로 변환할 텍스트
    private String languageCode;   // 언어 코드 (ko-KR, en-US)
    private int examNo;            // 연결될 예문 번호
    private int lang;              // 언어 구분 (1:한국어, 2:영어)
}
