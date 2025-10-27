package web.service;

import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Update;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.*;
import web.model.mapper.UserMapper;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final RankingService rankingService;

    // 비크립트 라이브러리 객체 주입
    private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();

    // [US-01] 회원가입 signUp()
    public int signUp(UserDto userDto){
        // 비밀번호를 해쉬화
        userDto.setPassword(bcrypt.encode(userDto.getPassword() ) );

        int result = userMapper.signUp(userDto);
        // insert 성공 시 userNo 반환
        if(result>=1){
            return userDto.getUserNo();
        } // 실패 시 0 반환
        return 0;
    } // func end

    // [US-01-1] 소셜 회원가입
    public UserDto oauth2UserSignup( String uid , String name ){
        // 기존 회원인지 검사
        UserDto userDto = userMapper.checkUid(uid);
        if( userDto == null ){
            UserDto oauthUser = new UserDto();
            oauthUser.setUid(uid);
            oauthUser.setSignupMethod(2);
            oauthUser.setPassword("oauth");
            oauthUser.setName(name);
            oauthUser.setUrole("USER");
            userMapper.signUp(oauthUser);
            return oauthUser;
        }
        return null;
    }

    // [US-02] 로그인 logIn()
    public LoginDto logIn(LoginDto loginDto){
        LoginDto result = userMapper.logIn(loginDto);
        // 평문과 암호문 비교
        boolean result2 = bcrypt.matches( loginDto.getPassword(), result.getPassword());
        if( result2 ){
            result.setPassword(null);
            return result;
        }else {return null;}
    } // func end

    // [US-04] 내 정보 조회( 로그인 중인 사용자정보 조회 ) info()
    public UserDto info( int userNo ){
        UserDto result = userMapper.info(userNo);
        return result;
    } // func end

    // [US-05] 이메일 중복검사 checkEmail()
    public int checkEmail(String email){
        int result = userMapper.checkEmail(email);
        // 중복이면 쿼리 수가 1이므로 0보다 크다.
        if(result>0){return result;}
        // 중복이 아니면 쿼리 수가 0개
        else return 0;
    } // func end

    // [US-06] 연락처 중복검사 checkPhone()
    public int checkPhone(String phone){
        int result = userMapper.checkPhone(phone);
        // 중복이면 쿼리 수가 1이므로 0보다 크다.
        if(result>0){return result;}
        // 중복이 아니면 쿼리 수가 0개
        else return 0;
    } // func end

    // [US-07] 이메일 찾기 findEmail()
    public String findEmail(String name , String phone){
        String result = userMapper.findEmail(name,phone);
        return result;
    } // func end

    // [US-08] 비밀번호 찾기 findPwrd()
    public String findPwrd(String name, String phone, String email){
        String result = userMapper.findPwrd(name,phone,email);
        return result;
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
