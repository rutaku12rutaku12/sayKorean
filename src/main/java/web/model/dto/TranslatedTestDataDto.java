package web.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 시험 번역 응답 DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TranslatedTestDataDto {
    // 시험 제목 번역
    private String testTitleJp;
    private String testTitleCn;
    private String testTitleEn;
    private String testTitleEs;

    // 문항 질문 번역
    private String questionJp;
    private String questionCn;
    private String questionEn;
    private String questionEs;
}
