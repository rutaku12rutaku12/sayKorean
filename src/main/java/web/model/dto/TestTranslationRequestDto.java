package web.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 시험번역 요청 DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TestTranslationRequestDto {
    private String testTitle;   // 시험 제목 (한국어)
    private String question;    // 문항 질문 (한국어)
}