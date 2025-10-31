package web.model.mapper;

import org.apache.ibatis.annotations.*;
import web.model.dto.*;
import java.util.List;

/*
 * TestMapper
 * -----------------------------------------------
 * 시험(Test), 문항(TestItem), 예문(Exam), 오디오(Audio),
 * 랭킹(Ranking) 관련 SQL을 담당하는 MyBatis Mapper 인터페이스
 *
 * 특징:
 *  - @Mapper 어노테이션으로 MyBatis가 인식
 *  - SQL은 모두 어노테이션 기반(inline SQL)으로 작성
 *  - langNo 파라미터에 따라 다국어 컬럼 동적 선택(CASE WHEN 구문)
 *  - Mapper ↔ DTO 간 매핑은 @Results/@Result 설정으로 연결
 */
@Mapper
public interface TestMapper { // mapper start

    /*
     * [1] 시험 목록 조회
     * ------------------------------------------------------
     * 사용자가 선택한 언어(langNo)에 맞춰 시험 제목을 다국어 컬럼에서 선택함.
     * test 테이블 구조 (예시)
     *  ├─ testTitle    (한국어)
     *  ├─ testTitleJp  (일본어)
     *  ├─ testTitleCn  (중국어)
     *  ├─ testTitleEn  (영어)
     *  ├─ testTitleEs  (스페인어)
     *
     * @param langNo 언어 번호 (1=한국어, 2=일본어, 3=중국어, 4=영어, 5=스페인어)
     * @return 언어별 시험 제목이 포함된 TestDto 리스트
     */
    @Select("""
        SELECT
            testNo,
            studyNo,
            CASE #{langNo}
                WHEN 1 THEN testTitle
                WHEN 2 THEN testTitleJp
                WHEN 3 THEN testTitleCn
                WHEN 4 THEN testTitleEn
                WHEN 5 THEN testTitleEs
                ELSE testTitle
            END AS testTitleSelected
        FROM test
        ORDER BY testNo DESC
    """)
    @Results(id = "TestMap", value = {
            @Result(column = "testNo", property = "testNo", id = true),
            @Result(column = "studyNo", property = "studyNo"),
            @Result(column = "testTitleSelected", property = "testTitleSelected")
    })
    List<TestDto> getListTest(int langNo);

    /*
     * [2] 문항 + 예문(이미지/오디오 포함) 조회
     * ------------------------------------------------------
     * testItem + exam 테이블을 JOIN 하여 문항 기본정보 + 이미지경로를 한 번에 가져옴.
     * 이후 examNo 기준으로 오디오(audio) 테이블의 다중행을 추가 조회(@Many)
     *
     * @param testNo 시험번호
     * @param langNo 언어 번호
     * @return 문항 + 이미지/오디오 포함된 DTO 리스트
     */
    @Select("""
        SELECT 
            ti.testItemNo,
            ti.testNo,
            ti.examNo,
            CASE #{langNo}
                WHEN 1 THEN ti.question
                WHEN 2 THEN ti.questionJp
                WHEN 3 THEN ti.questionCn
                WHEN 4 THEN ti.questionEn
                WHEN 5 THEN ti.questionEs
                ELSE ti.question
            END AS questionSelected,
            e.imageName,
            e.imagePath
        FROM testItem ti
        JOIN exam e ON e.examNo = ti.examNo
        WHERE ti.testNo = #{testNo}
        ORDER BY ti.testItemNo
    """)
    @Results(id = "TestItemWithMediaMap", value = {
            @Result(column = "testItemNo", property = "testItemNo", id = true),
            @Result(column = "testNo", property = "testNo"),
            @Result(column = "examNo", property = "examNo"),
            @Result(column = "questionSelected", property = "questionSelected"),
            @Result(column = "imageName", property = "imageName"),
            @Result(column = "imagePath", property = "imagePath"),

            // 오디오: 1:N 관계 (examNo 기준)
            @Result(property = "audios", column = "examNo",
                    many = @Many(select = "findAudiosByExamNo"))
    })
    List<TestItemWithMediaDto> findTestItemsWithMedia(int testNo, int langNo);

    /*
     * [2-1] 오디오 목록 조회
     * ------------------------------------------------------
     * examNo 기준으로 audio 테이블에서 관련된 오디오 파일 모두 로드
     * @param examNo 예문 번호
     * @return AudioDto 리스트
     */
    @Select("""
        SELECT audioNo, audioName, audioPath, lang, examNo
        FROM audio
        WHERE examNo = #{examNo}
        ORDER BY audioNo
    """)
    List<AudioDto> findAudiosByExamNo(int examNo);

    /*
     * [2-2] 랜덤 오답(언어 미반영)
     * ------------------------------------------------------
     * 정답(excludedExamNo)을 제외하고 랜덤한 오답 예문을 limit 개수만큼 추출
     */
    @Select("""
        SELECT examNo, examKo
        FROM exam
        WHERE examNo != #{excludedExamNo}
        ORDER BY RAND()
        LIMIT #{limit}
    """)
    List<ExamDto> findRandomExamsExcluding(@Param("excludedExamNo") int excludedExamNo,
                                           @Param("limit") int limit);

    /*
     * [3] 정답(예문) 조회
     * ------------------------------------------------------
     * Gemini 채점 시 ground truth로 사용할 예문을 langNo에 맞게 조회
     * @param examNo 예문 번호
     * @param langNo 언어 번호
     * @return ExamDto (examNo + examSelected)
     */
    @Select("""
        SELECT 
            examNo,
            CASE #{langNo}
                WHEN 1 THEN examKo
                WHEN 2 THEN examJp
                WHEN 3 THEN examCn
                WHEN 4 THEN examEn
                WHEN 5 THEN examEs
                ELSE examKo
            END AS examSelected
        FROM exam
        WHERE examNo = #{examNo}
    """)
    @Results(id = "ExamMap", value = {
            @Result(column = "examNo", property = "examNo", id = true),
            @Result(column = "examSelected", property = "examSelected")
    })
    ExamDto findExamByNo(@Param("examNo") int examNo,
                         @Param("langNo") int langNo);

    /*
     * [4] 랭킹(응답 기록) 저장
     * ------------------------------------------------------
     * ranking 테이블에 사용자의 답변 기록을 INSERT
     * resultDate는 NOW()로 자동 입력.
     * upsert 기능은 DB 제약 조건(UNIQUE KEY)에 따라 구현 필요
     */
    @Insert("""
        INSERT INTO ranking (
            testRound, selectedExamNo, userAnswer, isCorrect, testItemNo, userNo, resultDate
        )
        VALUES (
            #{testRound}, #{selectedExamNo}, #{userAnswer},
            #{isCorrect}, #{testItemNo}, #{userNo}, NOW()
        )
    """)
    int upsertRanking(RankingDto dto);

    /*
     * [5-1] 최신 회차 점수 집계
     * ------------------------------------------------------
     * - 특정 사용자(userNo)가 응시한 가장 최근 testRound 기준으로
     *   정답 수(score) / 전체 문항 수(total)를 집계
     * - 서브쿼리로 MAX(testRound) 선택 후 GROUP BY
     */
    @Select("""
        SELECT 
            SUM(CASE WHEN r.isCorrect = 1 THEN 1 ELSE 0 END) AS score,
            COUNT(*) AS total,
            r.testRound
        FROM ranking r
        JOIN testItem ti 
            ON r.testItemNo = ti.testItemNo 
            AND ti.testNo = #{testNo}
        WHERE r.userNo = #{userNo}
          AND r.testRound = (
              SELECT MAX(r2.testRound)
              FROM ranking r2
              JOIN testItem ti2 ON r2.testItemNo = ti2.testItemNo
              WHERE ti2.testNo = #{testNo}
                AND r2.userNo = #{userNo}
          )
        GROUP BY r.testRound
    """)
    RankingDto getLatestScore(@Param("userNo") int userNo,
                              @Param("testNo") int testNo);

    /*
     * [5-2] 특정 회차 점수 집계
     * ------------------------------------------------------
     * 사용자의 지정된 회차(testRound)에 대해
     *  - score = 정답 수
     *  - total = 전체 문항 수
     */
    @Select("""
        SELECT 
            SUM(CASE WHEN r.isCorrect = 1 THEN 1 ELSE 0 END) AS score,
            COUNT(*) AS total
        FROM ranking r
        JOIN testItem ti 
            ON r.testItemNo = ti.testItemNo 
            AND ti.testNo = #{testNo}
        WHERE r.userNo = #{userNo}
          AND r.testRound = #{testRound}
    """)
    RankingDto getScore(int userNo, int testNo, int testRound);

    /*
     * [6] 다음 회차 번호 계산
     * ------------------------------------------------------
     * 현재까지 해당 시험에서 사용자가 기록한 최대 회차(max testRound)를 찾아 +1
     * 응시 기록이 없다면 1부터 시작(coalesce로 0+1 처리)
     */
    @Select("""
        SELECT COALESCE(MAX(r.testRound), 0) + 1
        FROM ranking r
        JOIN testItem ti ON r.testItemNo = ti.testItemNo
        WHERE ti.testNo = #{testNo}
          AND r.userNo = #{userNo}
    """)
    int getNextRound(@Param("userNo") int userNo,
                     @Param("testNo") int testNo);

    /*
     * [7] 언어별 오답 조회 (객관식용)
     * ------------------------------------------------------
     * 정답을 제외하고, 언어별 예문을 맞춰서 랜덤으로 limit 개 가져옴.
     * - examSelected : 사용자 언어 기준 예문
     * - examKo : 한국어 원문(백업용)
     */
    @Select("""
        SELECT 
            examNo,
            CASE #{langNo}
                WHEN 1 THEN examKo
                WHEN 2 THEN examJp
                WHEN 3 THEN examCn
                WHEN 4 THEN examEn
                WHEN 5 THEN examEs
                ELSE examKo
            END AS examSelected,
            examKo
        FROM exam 
        WHERE examNo != #{excludedExamNo} 
        ORDER BY RAND() 
        LIMIT #{limit}
    """)
    List<ExamDto> findRandomExamsExcludingWithLang(
            @Param("excludedExamNo") int excludedExamNo,
            @Param("limit") int limit,
            @Param("langNo") int langNo
    );
} // mapper end
