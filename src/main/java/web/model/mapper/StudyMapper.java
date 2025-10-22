package web.model.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import web.model.dto.ExamDto;
import web.model.dto.GenreDto;
import web.model.dto.StudyDto;

import java.util.List;

@Mapper
public interface StudyMapper { // mapper start

    // 장르 목록 조회
    // genreNo도 함께 가져오면 프론트에서 클릭 시 정보 넘겨주기 더 쉬움
    @Select("SELECT genreNo, genreName FROM genre ORDER BY genreNo")
    List< GenreDto > getGenre();



    // 특정 장르의 주제 목록 조회
    @Select("SELECT studyNo, themeKo,themeJp,themeCn,themeEn,themeEs FROM study WHERE genreNo = #{genreNo} ORDER BY studyNo")
    List<StudyDto> getSubject( int genreNo );


    // 주제와 주제에 대한 해설 조회
    // 지금은 한글만 됨
    @Select("SELECT studyNo , themeKo , commenKo FROM study WHERE studyNo = #{studyNo}")
    StudyDto getDailyStudy( int studyNo );


    // 주제에 맞는 예문 조회
    // 일단은 DB저장 없이 조회만 가능
    @Select("SELECT * FROM exam WHERE studyNo = #{studyNo}")
    List<ExamDto> getDailyStudy2( int themeNo );



} // mapper end
