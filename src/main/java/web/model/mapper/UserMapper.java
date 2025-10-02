package web.model.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import web.model.dto.UserDto;

@Mapper
public interface UserMapper {

    // [US-01] 회원가입 signUp()
    @Insert("insert into users (name,email,password,nickName,phone,genreNo) values ( #{name},#{email},#{password},#{nickName},#{phone},#{genreNo})")
    public int signUp(UserDto userDto);

}
