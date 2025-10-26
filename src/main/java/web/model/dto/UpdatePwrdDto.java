package web.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdatePwrdDto {
    private int userNo; // PK: 사용자번호 자동증가
    @NotBlank
    private String currentPassword; // 현재 비밀번호
    @NotBlank
    private String newPassword; // 새로운 비밀번호
    private String password; // 실제 비밀번호
}
