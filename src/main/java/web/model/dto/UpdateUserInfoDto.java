package web.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateUserInfoDto {
    private int userNo; // PK: 사용자번호 자동증가
    @NotBlank // null, "" , " " 값 차단
    private String name; // 이름
    private String nickName; // 닉네임 기본값
    @Pattern(regexp = "^\\+?[1-9]\\d{7,14}$", message = "올바른 휴대폰 번호를 입력해주세요.")
    @NotBlank
    private String phone; // 연락처: 고유(옵션 필수X)
}
