package web.service;

import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Insert;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.UserDto;
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
    public int logIn(UserDto userDto){
        int result = userMapper.logIn(userDto);
        return result;
    }
    // [US-04] 내 정보 조회( 로그인 중인 사용자정보 조회 ) info()
    public UserDto info( int userNo ){
        UserDto result = userMapper.info(userNo);
        return result;
    }

} // class end
