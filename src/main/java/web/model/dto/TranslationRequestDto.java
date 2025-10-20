package web.model.dto;

import lombok.Data;

/// 자동 번역 요청 시 프론트엔드에서 백엔드로 보낼 데이터를 담는 DTO 입니다.

@Data
public class TranslationRequestDto {
    private String themeKo;
    private String commenKo;
    private String examKo;
}
