package web.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor
@NoArgsConstructor @Builder
public class LoginDto {
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    private int userState =1;
}