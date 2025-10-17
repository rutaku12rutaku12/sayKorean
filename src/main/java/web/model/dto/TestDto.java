package web.model.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class TestDto {

    // 멤버변수
    private int testNo; // 시험번호(PK)
    private String testTitle; // 시험제목
    private int studyNo; // 교육번호(FK)

}
