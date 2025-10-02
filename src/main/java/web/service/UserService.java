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
        return result;
    }
}
