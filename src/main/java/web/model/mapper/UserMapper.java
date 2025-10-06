package web.model.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import web.model.dto.UserDto;

@Mapper
public interface UserMapper {

    // [US-01] 회원가입 signUp()
    @Insert("insert into users (name,email,password,nickName,phone,genreNo) values ( #{name},#{email},#{password},#{nickName},#{phone},#{genreNo})")
    @Options(useGeneratedKeys = true, keyProperty = "userNo") // 마이바티스 generatekey 사용 어노테이션 : insert 이후 pk값인 userNo를 반환하기 위해서 사용
    public int signUp(UserDto userDto);

    // [US-02] 로그인 logIn()
    @Select("select * from users where email = #{email} and password = #{password}")
    public int logIn(UserDto userDto);

    // [US-04] 내 정보 조회( 로그인 중인 사용자정보 조회 ) info()
    @Select("select userNo,name,email,nickName,phone,genreNo from users where UserNo = #{userNo}")
    public UserDto info( int userNo );

    // [US-05] 이메일 중복검사 checkEmail()
    @Select("select * from users where email = #{email}")
    public int checkEmail(String email);

    // [US-06] 연락처 중복검사 checkPhone()
    @Select("select * from users where phone = #{phone}")
    public int checkPhone(String phone);

    // [US-07] 이메일 찾기 findEmail()
    @Select("select email from users where name=#{name} and phone=#{phone}")
    public String findEmail(String name , String phone);

    // [US-08] 비밀번호 찾기 findPwrd()
    @Select("select password from users where name=#{name} and phone = #{phone} and email=#{email}")
    public String

} // interface end
