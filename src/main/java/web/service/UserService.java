package web.service;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Update;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.*;
import web.model.mapper.UserMapper;

import java.util.Random;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final RankingService rankingService;

    // 비크립트 라이브러리 객체 주입
    private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();

    // [US-01] 회원가입 signUp()
    public int signUp(UserDto userDto) {
        // 비밀번호를 해쉬화
        userDto.setPassword(bcrypt.encode(userDto.getPassword()));

        int result = userMapper.signUp(userDto);
        // insert 성공 시 userNo 반환
        if (result >= 1) {
            return userDto.getUserNo();
        } // 실패 시 0 반환
        return 0;
    } // func end

    // [US-01-1] 소셜 회원가입
    public UserDto oauth2UserSignup(String uid, String name) {
            // 기존 회원인지 검사
            UserDto userDto = userMapper.checkUid(uid);

            // 이미 존재하면 신규 가입 건너 뛰고 기존 회원 반환
            if (userDto != null) {
                // 탈퇴한 회원이면 복구
                if (userDto.getUserState()==-1){
                    userDto.setUserState(1);
                    userMapper.recoverUser(userDto);
                }
                return userDto;
            }
            try{
                // 존재하지 않으면 신규 유저 생성
                UserDto oauthUser = new UserDto();
                oauthUser.setEmail(uid);
                oauthUser.setName(name);
                oauthUser.setNickName("토돌이");
                oauthUser.setPassword("social");
                oauthUser.setSignupMethod(2);
                oauthUser.setUrole("USER");

                userMapper.signUp(oauthUser);
                return oauthUser;

            }catch (DuplicateKeyException e){System.out.println("이미 가입된 이메일 입니다. "+ uid);
                // 이미 가입되어 있는 경우, 다시 조회
                userDto = userMapper.checkUid(uid);
            // 가입이 되어있는데도 dto가 null이면
            if (userDto != null) {
                if (userDto.getUserState() == -1) {
                    userDto.setUserState(1);
                    userMapper.recoverUser(userDto);
                }
                return userDto;
            }
            throw new IllegalStateException("사용자 정보를 가져올 수 없습니다.");
        }
    }

    // [US-02] 로그인 logIn()
    public LoginDto logIn(LoginDto loginDto) {
        LoginDto result = userMapper.logIn(loginDto);
        // 평문과 암호문 비교
        boolean result2 = bcrypt.matches(loginDto.getPassword(), result.getPassword());
        if (result2) {
            result.setPassword(null);
            return result;
        } else {
            return null;
        }
    } // func end

    // [US-04] 내 정보 조회( 로그인 중인 사용자정보 조회 ) info()
    public UserDto info(int userNo) {
        UserDto result = userMapper.info(userNo);
        return result;
    } // func end

    // [US-05] 이메일 중복검사 checkEmail()
    public int checkEmail(String email) {
        int result = userMapper.checkEmail(email);
        // 중복이면 쿼리 수가 1이므로 0보다 크다.
        if (result > 0) {
            return result;
        }
        // 중복이 아니면 쿼리 수가 0개
        else return 0;
    } // func end

    // [US-06] 연락처 중복검사 checkPhone()
    public int checkPhone(String phone) {
        int result = userMapper.checkPhone(phone);
        // 중복이면 쿼리 수가 1이므로 0보다 크다.
        if (result > 0) {
            return result;
        }
        // 중복이 아니면 쿼리 수가 0개
        else return 0;
    } // func end

    // [US-07] 이메일 찾기 findEmail()
    public String findEmail(String name, String phone) {
        String result = userMapper.findEmail(name, phone);
        return result;
    } // func end

    // [US-08] 비밀번호 찾기 findPwrd()
    @Transactional
    public String findPwrd(String name, String phone, String email) {

        TemporaryPwrdDto dto = userMapper.findPwrd(name, phone, email);
        if (dto==null){
            throw new RuntimeException("존재하지 않는 사용자");
        }
        // 난수 생성
        Random random = new Random();
        // 임시비밀번호로 사용할 빈 문자열 생성
        String tamPwrd = "";
        for (int i = 1; i <= 6; i++) { // 6자리 만들기 위한 6회전반복문
            int val = random.nextInt(26) + 97;
            char str = (char) val;
            System.out.println("임시 비밀번호 추출 중.."+str);
            tamPwrd += str;
        } // for end
        System.out.println("임시 비밀번호 생성 완료 : "+tamPwrd);
        // 비밀번호 해시화
        String result = bcrypt.encode(tamPwrd);
        System.out.println("임시 비밀번호를 해시화 완료 : "+result);
        // 해시화한 비밀번호를 DB에 저장
        userMapper.tranPassUpdate(TemporaryPwrdDto.builder()
                .userNo(dto.getUserNo())
                .password(result)
                .build());

        return tamPwrd;
    } // func end

    // [US-09] 회원정보 수정 updateUserInfo()
    public int updateUserInfo(UpdateUserInfoDto updateUserInfoDto){
        int result = userMapper.updateUserInfo(updateUserInfoDto);
        return result;
    } // func end

    // [US-10] 비밀번호 수정 updatePwrd()
    public UpdatePwrdDto updatePwrd(UpdatePwrdDto updatePwrdDto){
        String DB에저장된비번 = userMapper.findPass(updatePwrdDto.getUserNo());
        System.out.println("DB에 저장된 비밀번호 해시: " + DB에저장된비번);
        // DB에 저장된 기존 비밀번호를 솔트를 통해 일치하는지 검증
        if (!bcrypt.matches(updatePwrdDto.getCurrentPassword(), DB에저장된비번)) {
            return null; // 기존 비밀번호 불일치
        }
        // 기존 비밀번호가 맞으면 새로운 비밀번호를 해시화
        updatePwrdDto.setPassword(bcrypt.encode(updatePwrdDto.getNewPassword() ) );
        int result = userMapper.updatePwrd(updatePwrdDto);
        if (result > 0){
            return UpdatePwrdDto.builder()
                    .userNo(updatePwrdDto.getUserNo())
                    // 비밀번호 제거
                    .newPassword((null))
                    .build();
        }
        return null;
    } // func end

    // [US-11] 회원상태 수정(삭제) deleteUserStatus()
    // <수정> 랭킹 삭제 서비스 추가했습니다
    public int deleteUserStatus(DeleteUserStatusDto deleteUserStatusDto){

        int userNo = deleteUserStatusDto.getUserNo();
        try {
            // 1) 랭킹 데이터 삭제
            rankingService.deleteRankByUser(userNo);
            // 2) 회원 상태 변경
            int result = userMapper.deleteUserStatus(deleteUserStatusDto);

            return result;
        } catch (Exception e) {
            throw new RuntimeException("회원 탈퇴 처리 중 오류 발생: " + e.getMessage() , e);
        }
    }


//    // getGenreNo
//    public int getGenreNo( int userNo ){
//        int result = userMapper.getGenreNo( userNo );;
//        return result;
//    }
//
//    // updateGenre
//    public boolean updateGenre(int userNo, int genreNo){
//        boolean result = userMapper.updateGenre( userNo , genreNo );
//        return result;
//    }

} // class end
