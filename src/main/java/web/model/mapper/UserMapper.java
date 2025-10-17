package web.model.mapper;

import org.apache.catalina.User;
import org.apache.commons.compress.harmony.pack200.CPUTF8;
import org.apache.ibatis.annotations.*;
import web.model.dto.*;

@Mapper
public interface UserMapper {

    // [US-01] 회원가입 signUp() 테스트
    @Insert("insert into users (name,email,password,nickName,phone) values ( #{name},#{email},#{password},#{nickName},#{phone})")
    @Options(useGeneratedKeys = true, keyProperty = "userNo") // 마이바티스 generatekey 사용 어노테이션 : insert 이후 pk값인 userNo를 반환하기 위해서 사용
    public int signUp(UserDto userDto);

    // [US-02] 로그인 logIn()
    @Select("select * from users where email = #{email} and password = #{password} and userState != -1")
    public int logIn(LoginDto loginDto);

    // [US-04] 내 정보 조회( 로그인 중인 사용자정보 조회 ) info()
    @Select("select userNo,name,email,nickName,phone,userState,userDate from users where UserNo = #{userNo}")
    public UserDto info( int userNo );

    // [US-05] 이메일 중복검사 checkEmail()
    @Select("select count(*) from users where email = #{email}")
    public int checkEmail(String email);

    // [US-06] 연락처 중복검사 checkPhone()
    @Select("select count(*) from users where phone = #{phone}")
    public int checkPhone(String phone);

    // [US-07] 이메일 찾기 findEmail()
    @Select("select email from users where name=#{name} and phone=#{phone}")
    public String findEmail(String name , String phone);

    // [US-08] 비밀번호 찾기 findPwrd()
        @Select("select password from users where name=#{name} and phone = #{phone} and email=#{email}")
        public String findPwrd(String name, String phone, String email);

        // [US-09] 회원정보 수정 updateUserInfo()
        @Update("update users set name=#{name}, nickName=#{nickName}, phone=#{phone} where userNo = #{userNo}")
        public int updateUserInfo(UpdateUserInfoDto updateUserInfoDto);


        // [US-10] 비밀번호 수정 updatePwrd()
        @Update("update users set password=#{password} where userNo=#{userNo}")
        public int updatePwrd(UpdatePwrdDto updatePwrdDto);

        // [US-11] 회원상태 수정(삭제) deleteUserStatus()
    @Update("update users set userState = -1 where userNo=#{userNo} and password=#{password}")
    public int deleteUserStatus(DeleteUserStatusDto deleteUserStatusDto);

//    // getGenre
//    @Select("SELECT genreNo FROM users WHERE userNo=#{userNo}")
//    public int getGenreNo( int userNo );
//
//    // updateGenre
//    @Update("UPDATE users SET genreNo = #{genreNo} WHERE userNo = #{userNo}")
//    boolean updateGenre(@Param("userNo") int userNo, @Param("genreNo") int genreNo);


} // interface end
