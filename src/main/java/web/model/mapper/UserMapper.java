package web.model.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import web.model.dto.UserDto;

@Mapper
public interface UserMapper {

    // [US-01] 회원가입 signUp()
    @Insert("insert into users (name,email,password,nickName,phone,genreNo) values ( #{name},#{email},#{password},#{nickName},#{phone},#{genreNo})")
    @Options(useGeneratedKeys = true, keyProperty = "userNo") // 마이바티스 generatekey 사용 어노테이션 : insert 이후 pk값인 userNo를 반환하기 위해서 사용
    public int signUp(UserDto userDto);

}
