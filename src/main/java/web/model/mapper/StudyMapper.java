package web.model.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import web.model.dto.GenreDto;

import java.util.List;

@Mapper
public interface StudyMapper { // mapper start

    // 사용자단 : 장르 목록 조회
    @Select("SELECT genreName FROM genre ORDER BY genreNo")
    List< GenreDto > getGenre();




} // mapper end
