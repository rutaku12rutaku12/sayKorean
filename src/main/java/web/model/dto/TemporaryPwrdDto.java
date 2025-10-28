package web.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TemporaryPwrdDto {
    private int userNo; // PK: 사용자번호 자동증가
    private String password; //  비밀번호
    private String name; // 이름
    private String phone; // 연락처
    private String email; // 이메일
}
