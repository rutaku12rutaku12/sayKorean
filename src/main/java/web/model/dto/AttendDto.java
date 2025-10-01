package web.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AttendDto {
    private int attenNo;          // PK: 출석번호
    private String attenDate;  // 출석일시 (DATETIME)
    private int userNo;           // FK: 사용자번호 (INT UNSIGNED → Integer 사용)
}
