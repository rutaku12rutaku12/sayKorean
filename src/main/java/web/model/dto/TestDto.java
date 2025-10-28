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
    private String testTitle;        // 한국어 시험제목
    private String testTitleRoman;
    private String testTitleJp;
    private String testTitleCn;
    private String testTitleEn;
    private String testTitleEs;
    private String testTitleSelected; // 조회 시 사용자 언어 설정에 따른 제목
    private int studyNo; // 교육번호(FK)

}
