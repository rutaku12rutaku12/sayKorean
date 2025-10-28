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
    List<StudyDto> getSubject(int genreNo, int langNo);


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
    StudyDto getDailyStudy(int studyNo, int langNo);


    // -------------------------------
    // [5] 주제에 맞는 예문 조회
    // - 이전 예문, 다음 예문을 백에서 처리해야 나중에 예문이 늘어났을 때 안정성 보장이 되고 유지보수성이 올라감
    // currentExamNo는 **프론트(또는 API 요청 param)**에서 전달받는 값
    // -------------------------------


    // 첫 예문 1개 조회
    @Select("""
    SELECT 
        e.examNo,
        e.studyNo,

        e.examKo,
        e.examEn,
        CASE 
            WHEN #{langNo} = 2 THEN e.examJp
            WHEN #{langNo} = 3 THEN e.examCn
            WHEN #{langNo} = 4 THEN e.examEn
            WHEN #{langNo} = 5 THEN e.examEs
            ELSE e.examKo
        END AS examSelected,

        e.imagePath,

        -- Korean audio
        (SELECT audioPath FROM audio 
            WHERE examNo = e.examNo 
            AND audioPath LIKE '%_kor_%'
            LIMIT 1
        ) AS koAudioPath,

        -- English audio
        (SELECT audioPath FROM audio 
            WHERE examNo = e.examNo 
            AND audioPath LIKE '%_en_%'
            LIMIT 1
        ) AS enAudioPath

    FROM exam e
    WHERE e.studyNo = #{studyNo}
    ORDER BY e.examNo ASC
    LIMIT 1
""")
    ExamDto getFirstExam(int studyNo, int langNo);



    // 다음 예문 1개
    @Select("""
    SELECT 
        e.examNo,
        e.studyNo,

        e.examKo,
        e.examEn,
        CASE 
            WHEN #{langNo} = 2 THEN e.examJp
            WHEN #{langNo} = 3 THEN e.examCn
            WHEN #{langNo} = 4 THEN e.examEn
            WHEN #{langNo} = 5 THEN e.examEs
            ELSE e.examKo
        END AS examSelected,

        e.imagePath,

        -- Korean audio
        (SELECT audioPath FROM audio 
         WHERE examNo = e.examNo 
         AND audioPath LIKE '%_kor_%'
         LIMIT 1
        ) AS koAudioPath,

        -- English audio
        (SELECT audioPath FROM audio 
         WHERE examNo = e.examNo 
         AND audioPath LIKE '%_en_%'
         LIMIT 1
        ) AS enAudioPath

    FROM exam e
    WHERE e.studyNo = #{studyNo}
      AND e.examNo > #{currentExamNo}
    ORDER BY e.examNo ASC
    LIMIT 1
""")
    ExamDto getNextExam(int studyNo, int currentExamNo, int langNo);

    // 이전 예문 1개
    @Select("""
    SELECT 
        e.examNo,
        e.studyNo,

        e.examKo,
        e.examEn,
        CASE 
            WHEN #{langNo} = 2 THEN e.examJp
            WHEN #{langNo} = 3 THEN e.examCn
            WHEN #{langNo} = 4 THEN e.examEn
            WHEN #{langNo} = 5 THEN e.examEs
            ELSE e.examKo
        END AS examSelected,

        e.imagePath,

        -- Korean audio
        (SELECT audioPath FROM audio 
         WHERE examNo = e.examNo 
         AND audioPath LIKE '%_kor_%'
         LIMIT 1
        ) AS koAudioPath,

        -- English audio
        (SELECT audioPath FROM audio 
         WHERE examNo = e.examNo 
         AND audioPath LIKE '%_en_%'
         LIMIT 1
        ) AS enAudioPath

    FROM exam e
    WHERE e.studyNo = #{studyNo}
      AND e.examNo < #{currentExamNo}
    ORDER BY e.examNo DESC
    LIMIT 1
""")
    ExamDto getPrevExam(int studyNo, int currentExamNo, int langNo);

}


