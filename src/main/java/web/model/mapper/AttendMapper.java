package web.model.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import web.model.dto.AttendDto;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface AttendMapper {

    // [AT-1] 출석하기 attend()
    @Insert("insert into attendance ( userNo ) value ( #{userNo})")
    public int attend(AttendDto attendDto);

    // [AT-2] 출석 조회 getAttend()
    @Select("select * from attendance where userNo=#{userNo}")
    public List<AttendDto> getAttend(int userNo);

    // [AT-3] 출석 중복 조회
    @Select("SELECT * FROM attendance WHERE userNo = #{userNo} AND DATE(attendday) = #{attendday}")
    public List<AttendDto> checkAttend(int userNo , LocalDate attendday);
}
