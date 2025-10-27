package web.model.dto;

import lombok.Data;

@Data
public class ScoringResultDto {
    private Integer score;            // Gemini가 부여한 점수 (0~100)
    private Boolean isCorrect;        // 정답 여부 (60점 이상이면 true)
    private String rawFeedback;       // Gemini의 원본 피드백 텍스트
    private String correctAnswer;     // 정답 (사용자 언어에 맞춰진)
}