package web.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestItemWithMediaDto {
    // 기본 문항 정보
    private Integer testItemNo;
    private String question;          // 한국어 질문
    private String questionRoman;
    private String questionJp;
    private String questionCn;
    private String questionEn;
    private String questionEs;
    private String questionSelected;  // 사용자 언어에 맞춘 질문
    private Integer examNo;
    private Integer testNo;

    // 정답 예문 정보
    private String examKo;            // 정답 한국어
    private String examSelected;      // 사용자 언어에 맞춘 정답

    // 미디어 정보
    private String imageName;
    private String imagePath;
    private List<AudioDto> audios;    // 오디오 목록 (1:N)
}