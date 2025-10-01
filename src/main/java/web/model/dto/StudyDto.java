package web.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudyDto {
    private int themeNo;         // PK: 교육번호
    private String  themeKo;     // 한국어 주제 (UNIQUE)
    private String  themeJp;     // 일본어 주제 (UNIQUE)
    private String  themeCn;     // 중국어 주제 (UNIQUE)
    private String  themeEn;     // 영어 주제 (UNIQUE)
    private String  themeEs;     // 스페인어 주제 (UNIQUE)

    private String  commenKo;    // 한국어 해설 (TEXT)
    private String  commenJp;    // 일본어 해설 (TEXT)
    private String  commenCn;    // 중국어 해설 (TEXT)
    private String  commenEn;    // 영어 해설 (TEXT)
    private String  commenEs;    // 스페인어 해설 (TEXT)

    private int genreNo;            // FK: 장르번호 (INT UNSIGNED → Integer 사용)

}
