package web.model.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import web.model.dto.ExamDto;
import web.model.dto.GenreDto;
import web.model.dto.LanguageDto;
import web.model.dto.StudyDto;

import java.util.List;

/*
 * StudyMapper
 * -------------------------------------------------------
 * 학습(Study) 관련 DB 조회를 담당하는 MyBatis Mapper.
 * 주요 기능:
 *  [1] 장르 목록 조회
 *  [2] 특정 장르의 주제(Study) 목록 조회
 *  [3] 언어(Language) 목록 조회
 *  [4] 특정 주제 상세(주제명 + 해설) 조회
 *  [5] 예문(Exam) 조회: 처음 / 다음 / 이전
 *
 * 설계 포인트:
 *  - 모든 텍스트 컬럼은 langNo에 따라 CASE 구문으로 다국어 선택 처리.
 *  - 오디오(audio) 테이블은 examNo를 기준으로 연관된 경로를 조회.
 */
@Mapper
public interface StudyMapper {

    // ==========================================================
    // [1] 장르 목록 조회
    // ==========================================================
    /*
     * 사용자가 선택 가능한 장르 목록을 조회.
     * 예: 여행, 음식, 일상회화 등
     *
     * @return GenreDto 리스트 (genreNo, genreName)
     */
    @Select("""
        SELECT genreNo, genreName
        FROM genre
        ORDER BY genreNo
    """)
    List<GenreDto> getGenre();


    // ==========================================================
    // [2] 특정 장르의 주제 목록 조회 (언어별 CASE 처리)
    // ==========================================================
    /*
     * 선택한 장르(genreNo)에 속하는 학습 주제(Study) 목록을 조회.
     * 언어 번호(langNo)에 따라 다국어 컬럼을 매핑.
     *
     * study 테이블 예시 컬럼:
     *  - themeKo, themeJp, themeCn, themeEn, themeEs
     *
     * @param genreNo 장르 번호
     * @param langNo  언어 번호 (1=한국어, 2=일본어, 3=중국어, 4=영어, 5=스페인어)
     * @return StudyDto 리스트
     *  - studyNo, themeSelected(언어별 주제명)
     */
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


    // ==========================================================
    // [3] 언어 목록 조회
    // ==========================================================
    /*
     * 학습 시스템에서 지원하는 언어 목록을 반환.
     * 예: 한국어, 일본어, 중국어, 영어, 스페인어 등
     *
     * @return LanguageDto 리스트 (langNo, langName)
     */
    @Select("""
        SELECT langNo, langName
        FROM languages
        ORDER BY langNo
    """)
    List<LanguageDto> getLang();


    // ==========================================================
    // [4] 특정 주제 상세(주제명 + 해설) 조회
    // ==========================================================
    /*
     * 특정 주제(studyNo)에 대한 상세 정보(주제명 + 해설)를 조회.
     * 언어 번호(langNo)에 맞춰 theme/commen 컬럼을 선택.
     *
     * study 테이블 예시:
     *  - themeKo, themeJp, themeCn, themeEn, themeEs
     *  - commenKo, commenJp, commenCn, commenEn, commenEs
     *
     * @param studyNo 주제 번호
     * @param langNo  언어 번호
     * @return StudyDto (themeSelected, commenSelected 등)
     */
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


    // ==========================================================
    // [5] 예문(Exam) 조회
    // ==========================================================
    /*
     * 주제(studyNo)에 속한 예문(Exam) 목록에서
     * 처음 / 다음 / 이전 1개씩을 가져오는 SQL.
     *
     * 특징:
     *  - langNo에 따라 examKo/Jp/Cn/En/Es 중 하나 선택 (examSelected)
     *  - 각 예문에 대해 오디오 파일을 서브쿼리로 조회하여 경로를 포함시킴.
     *  - "_kor_" / "_en_" 패턴으로 한국어·영어 음성 구분.
     */

    // [5-1] 첫 번째 예문 조회
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

            -- 한국어 오디오 경로 (예: *_kor_*)
            (SELECT audioPath FROM audio 
             WHERE examNo = e.examNo 
             AND audioPath LIKE '%_kor_%'
             LIMIT 1
            ) AS koAudioPath,

            -- 영어 오디오 경로 (예: *_en_*)
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


    // [5-2] 다음 예문 조회
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

            (SELECT audioPath FROM audio 
             WHERE examNo = e.examNo 
             AND audioPath LIKE '%_kor_%'
             LIMIT 1
            ) AS koAudioPath,

            (SELECT audioPath FROM audio 
             WHERE examNo = e.examNo 
             AND audioPath LIKE '%_en_%'
             LIMIT 1
            ) AS enAudioPath

        FROM exam e
        WHERE e.studyNo = #{studyNo}
          AND e.examNo > #{currentExamNo}  -- 현재보다 큰 번호 = 다음 예문
        ORDER BY e.examNo ASC
        LIMIT 1
    """)
    ExamDto getNextExam(int studyNo, int currentExamNo, int langNo);


    // [5-3] 이전 예문 조회
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

            (SELECT audioPath FROM audio 
             WHERE examNo = e.examNo 
             AND audioPath LIKE '%_kor_%'
             LIMIT 1
            ) AS koAudioPath,

            (SELECT audioPath FROM audio 
             WHERE examNo = e.examNo 
             AND audioPath LIKE '%_en_%'
             LIMIT 1
            ) AS enAudioPath

        FROM exam e
        WHERE e.studyNo = #{studyNo}
          AND e.examNo < #{currentExamNo}  -- 현재보다 작은 번호 = 이전 예문
        ORDER BY e.examNo DESC
        LIMIT 1
    """)
    ExamDto getPrevExam(int studyNo, int currentExamNo, int langNo);
}
