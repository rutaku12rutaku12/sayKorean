package web.model.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import web.model.dto.AttendDto;
@Mapper
public interface AttendMapper {

    // [AT-1] 출석하기 attend()
    @Insert("insert into users (attenDate , userNo ) value (#{attenDate} , #{userNo})")
    public int attend(AttendDto attendDto);

    // [AT-2] 출석 조회 getAttend()
    @Select("select * from attendance where userNo=#{userNo}")
    public int getAttend(AttendDto attendDto);


}
