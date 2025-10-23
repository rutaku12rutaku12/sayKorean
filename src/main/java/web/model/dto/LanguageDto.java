package web.model.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LanguageDto {

    private int langNo; // PK : 언어번호
    private String langName; // 언어명( UNIQUE )
}
