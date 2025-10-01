package web.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor
@NoArgsConstructor @Builder
public class UserDto {
    private int userNo; // PK: 사용자번호 자동증가
    private String name; // 이름
    private String email; // 이메일: 고유
    private String password; // 비밀번호(예시 길이)
    private String nickName; // 닉네임 기본값
    private String phone; // 연락처: 고유(옵션 필수X)
    private int signupMethod; // 가입방식 코드 기본 1
    private int userState; // 상태 코드 기본 1
    private String userDate; // 가입일시 기본 now()
    private String userUpdate; // 수정일시 자동 갱신
    private int genreNo; // FK: 장르번호
}
