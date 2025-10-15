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
public class DeleteUserStatusDto {
    private int userNo; // PK: 사용자번호 자동증가
    @NotBlank
    private String password; // 비밀번호(예시 길이)
}
