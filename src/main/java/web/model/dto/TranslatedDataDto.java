package web.model.dto;

import lombok.Data;

/// 번역된 텍스트를 백엔드에서 프론트엔드로 전달할 때 사용하는 DTO 입니다.

@Data
public class TranslatedDataDto {
    private String themeJp;
    private String themeCn;
    private String themeEn;
    private String themeEs;
    private String commenJp;
    private String commenCn;
    private String commenEn;
    private String commenEs;
    private String examJp;
    private String examCn;
    private String examEn;
    private String examEs;
    private String examRoman;
}
