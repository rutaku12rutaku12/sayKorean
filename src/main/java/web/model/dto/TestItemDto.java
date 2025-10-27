package web.model.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class TestItemDto { // class start

    // 멤버변수
    private int testItemNo; // 시험문항번호(PK)
    private String question;          // 한국어 질문
    private String questionRoman;
    private String questionJp;
    private String questionCn;
    private String questionEn;
    private String questionEs;
    private String questionSelected;  // 조회 시 사용자 언어 설정에 따른 질문
    private int examNo; // 예문(FK)
    private int testNo;

} // class end
