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
    private String question; // 질문
    private int examNo; // 예문(FK)
    private int testNo;

} // class end
