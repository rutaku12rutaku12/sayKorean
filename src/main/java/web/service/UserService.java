package web.service;

import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.*;
import web.model.mapper.UserMapper;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;

    // [US-01] 회원가입 signUp()
    public int signUp(UserDto userDto){
        int result = userMapper.signUp(userDto);
        // insert 성공 시 userNo 반환
        if(result>=1){
            return userDto.getUserNo();
        } // 실패 시 0 반환
        return 0;
    } // func end

    // [US-02] 로그인 logIn()
    public int logIn(LoginDto loginDto){
        int result = userMapper.logIn(loginDto);
        return result;
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
    public int updatePwrd(UpdatePwrdDto updatePwrdDto){
        int result = userMapper.updatePwrd(updatePwrdDto);
        return result;
    } // func end

    // [US-11] 회원상태 수정(삭제) deleteUserStatus()
    public int deleteUserStatus(DeleteUserStatusDto deleteUserStatusDto){
        int result = userMapper.deleteUserStatus(deleteUserStatusDto);
        return result;
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
