package web.model.dto;

import lombok.Data;

// 채점 요청 DTO
@Data
public class ScoringRequestDto {
    private Integer userNo;           // 사용자 번호
    private Integer testItemNo;       // 문항 번호
    private Integer examNo;           // 정답 예문 번호
    private String userAnswer;        // 사용자 답변
    private Integer selectedExamNo;   // 객관식인 경우 선택한 예문 번호
    private Integer testRound;        // 시험 회차
    private Integer langNo;           // 언어 설정 (0: 한국어, 2: 일본어, 3: 중국어, 4: 영어, 5: 스페인어)
}
