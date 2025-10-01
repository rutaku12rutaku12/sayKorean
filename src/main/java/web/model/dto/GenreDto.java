package web.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GenreDto {
    private int genreNo;    // PK: 장르번호 (INT UNSIGNED → Integer 사용)
    private String  genreName;  // 장르명 (UNIQUE)
}
