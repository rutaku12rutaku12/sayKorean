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
    // testItem
    private int testItemNo;
    private String question;
    private int testNo;

    // 정답 exam (문항이 가리키는 정답)
    private int examNo;
    private String examKo;
    private String examJp;
    private String examCn;
    private String examEn;
    private String examEs;

    // 미디어(그림)
    private String imageName;
    private String imagePath;

    // 1:N 오디오
    private List<AudioDto> audios;
}