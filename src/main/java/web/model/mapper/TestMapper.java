package web.model.mapper;


import org.apache.ibatis.annotations.*;
import web.model.dto.*;

import java.util.List;

@Mapper
public interface TestMapper { // mapper start


    // 내가 배운 주제에 맞는 시험 목록 출력
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



    // 2) 특정 시험의 문항 목록
//    @Select("SELECT testItemNo, question, examNo, testNo FROM testItem WHERE testNo = #{testNo} ORDER BY testItemNo")
//    List<TestItemDto> findTestItem( int testNo );


    // 문항 + 정답(exam) 이미지까지 한 번에 로드 (INNER JOIN)
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
            @Result(column = "testNo",     property = "testNo"),
            @Result(column = "examNo",     property = "examNo"),
            @Result(column = "questionSelected", property = "questionSelected"),
            @Result(column = "imageName", property = "imageName"),
            @Result(column = "imagePath", property = "imagePath"),

            @Result(property = "audios", column = "examNo",
                    many = @Many(select = "findAudiosByExamNo"))
    })
    List<TestItemWithMediaDto> findTestItemsWithMedia( int testNo, int langNo );



    // exam별 오디오 목록
    @Select(
            "SELECT audioNo, audioName, audioPath, lang, examNo " +
                    "FROM audio " +
                    "WHERE examNo = #{examNo} " +
                    "ORDER BY audioNo"
    )
    List<AudioDto> findAudiosByExamNo(int examNo);


    @Select("select examNo, examKo from exam where examNo != #{excludedExamNo} order by rand() limit #{limit}")
    List<ExamDto> findRandomExamsExcluding(@Param("excludedExamNo") int excludedExamNo,
                                           @Param("limit") int limit);



    // 3) 정답(예문) 조회: Gemini 채점용 ground truth 확보
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






    // 전체 점수 출력 - 로직 : 랭킹테이블에 저장 -> 점수 집계

    // 4) 랭킹(응답 기록) 저장: 누적 INSERT
    @Insert("INSERT INTO ranking (testRound, selectedExamNo, userAnswer, isCorrect, testItemNo, userNo, resultDate) VALUES (#{testRound}, #{selectedExamNo}, #{userAnswer}, #{isCorrect}, #{testItemNo}, #{userNo}, NOW())")
    int upsertRanking( RankingDto dto );

    // 5) 점수 집계 (해당 시험/회차)
    // - score = 정답 개수
    // - total = 전체 문항 수
    @Select("SELECT \n" +
            "    SUM(CASE WHEN r.isCorrect = 1 THEN 1 ELSE 0 END) AS score,\n" +
            "    COUNT(*) AS total\n" +
            "FROM ranking r\n" +
            "JOIN testItem ti \n" +
            "    ON r.testItemNo = ti.testItemNo \n" +
            "    AND ti.testNo = #{testNo}\n" +
            "WHERE r.userNo = #{userNo}\n" +
            "  AND r.testRound = #{testRound};")
    RankingDto getScore(int userNo, int testNo, int testRound);




} // mapper end