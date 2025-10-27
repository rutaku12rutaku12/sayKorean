package web.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor
@NoArgsConstructor @Builder
public class UserDto {
    private int userNo; // PK: 사용자번호 자동증가
    @NotBlank // null, "" , " " 값 차단
    private String name; // 이름
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    @NotBlank
    private String email; // 이메일: 고유
    @NotBlank
    private String password; // 비밀번호(예시 길이)
    private String nickName; // 닉네임 기본값
    @Pattern(regexp = "^\\+?[1-9]\\d{7,14}$", message = "올바른 휴대폰 번호를 입력해주세요.")
    @NotBlank
    private String phone; // 연락처: 고유(옵션 필수X)
    private int signupMethod; // 가입방식 코드 기본 1
    private int userState; // 사용자상태 코드 기본 1 , 탈퇴예정시 -1
    private String userDate; // 가입일시 기본 now()
    private String userUpdate; // 수정일시 자동 갱신
    private int genreNo; // FK: 장르번호

    private String recaptcha; // 가입 시 리캡차 토큰

    private String uid; // 소셜 로그인 고유 ID

    private String urole; // 시큐리티 권한
}
