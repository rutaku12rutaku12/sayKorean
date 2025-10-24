package web.model.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import web.model.dto.ExamDto;
import web.model.dto.GenreDto;
import web.model.dto.LanguageDto;
import web.model.dto.StudyDto;

import java.util.List;

@Mapper
public interface StudyMapper {

    // -------------------------------
    // [1] 장르 목록 조회
    // -------------------------------
    @Select("""
        SELECT genreNo, genreName
        FROM genre
        ORDER BY genreNo
    """)
    List<GenreDto> getGenre();


    // -------------------------------
    // [2] 특정 장르의 주제 목록 조회 (언어별 CASE 처리)
    // -------------------------------
    @Select("""
        SELECT studyNo,
               themeKo,
               themeEn,
               CASE
                   WHEN #{langNo} = 2 THEN themeJp
                   WHEN #{langNo} = 3 THEN themeCn
                   WHEN #{langNo} = 4 THEN themeEn
                   WHEN #{langNo} = 5 THEN themeEs
                   ELSE themeKo
               END AS themeSelected
        FROM study
        WHERE genreNo = #{genreNo}
        ORDER BY studyNo
    """)
    List<StudyDto> getSubject( int genreNo, int langNo);



    // -------------------------------
    // [3] 언어 목록 조회
    // -------------------------------
    @Select("""
        SELECT langNo, langName
        FROM languages
        ORDER BY langNo
    """)
    List<LanguageDto> getLang();



    // -------------------------------
    // [4] 주제 + 해설 조회 (언어별 CASE 처리)
    // -------------------------------
    @Select("""
        SELECT studyNo,
               themeKo,
               commenKo,
               CASE
                   WHEN #{langNo} = 2 THEN themeJp
                   WHEN #{langNo} = 3 THEN themeCn
                   WHEN #{langNo} = 4 THEN themeEn
                   WHEN #{langNo} = 5 THEN themeEs
                   ELSE themeKo
               END AS themeSelected,
               CASE
                   WHEN #{langNo} = 2 THEN commenJp
                   WHEN #{langNo} = 3 THEN commenCn
                   WHEN #{langNo} = 4 THEN commenEn
                   WHEN #{langNo} = 5 THEN commenEs
                   ELSE commenKo
               END AS commenSelected
        FROM study
        WHERE studyNo = #{studyNo}
    """)
    StudyDto getDailyStudy( int studyNo, int langNo);



    // -------------------------------
    // [5] 주제에 맞는 예문 조회 (언어별 CASE 처리)
    // -------------------------------
    @Select("""
        SELECT examNo,
               studyNo,
               examKo,
               examEn,
               CASE
                   WHEN #{langNo} = 2 THEN examJp
                   WHEN #{langNo} = 3 THEN examCn
                   WHEN #{langNo} = 4 THEN examEn
                   WHEN #{langNo} = 5 THEN examEs
                   ELSE examKo
               END AS examSelected
        FROM exam
        WHERE studyNo = #{studyNo}
        ORDER BY examNo
    """)
    List<ExamDto> getDailyStudy2( int studyNo, int langNo);
}
