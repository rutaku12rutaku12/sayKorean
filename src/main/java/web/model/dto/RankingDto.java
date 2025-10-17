package web.model.dto;


import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class RankingDto { // class start


    // 멤버변수
    private int rankNo; // 랭킹번호(PK)
    private int testRound; // 시험회차
    private String userAnswer; // 사용자응답
    private int isCorrect; // 정답여부 (0: 오답, 1: 정답)
    String resultDate; // 제출일시
    private int testItemNo; // 시험문항번호(FK)
    private int userNo; // 사용자번호(FK)

} // class end
