package web.model.mapper;

import org.apache.ibatis.annotations.*;
import web.model.dto.*;

import java.util.List;

@Mapper
public interface TestMapper {

    // 1) 시험 목록 (langNo 반영)
    @Select("""
            SELECT 
                testNo,
                studyNo,
                testTitle,
                CASE 
                    WHEN #{langNo} = 2 THEN testTitleJp
                    WHEN #{langNo} = 3 THEN testTitleCn
                    WHEN #{langNo} = 4 THEN testTitleEn
                    WHEN #{langNo} = 5 THEN testTitleEs
                    ELSE testTitle
                END AS testTitleSelected
            FROM test
            ORDER BY testNo
            """)
    List<TestDto> getListTest(int langNo);

    // 2) 특정 시험의 문항 목록 (langNo 반영) + 정답(exam) 이미지까지
    @Select("""
            SELECT 
                ti.testItemNo,
                ti.question,
                CASE 
                    WHEN #{langNo} = 2 THEN ti.questionJp
                    WHEN #{langNo} = 3 THEN ti.questionCn
                    WHEN #{langNo} = 4 THEN ti.questionEn
                    WHEN #{langNo} = 5 THEN ti.questionEs
                    ELSE ti.question
                END AS questionSelected,
                ti.testNo,
                ti.examNo,
                e.examKo,
                CASE 
                    WHEN #{langNo} = 2 THEN e.examJp
                    WHEN #{langNo} = 3 THEN e.examCn
                    WHEN #{langNo} = 4 THEN e.examEn
                    WHEN #{langNo} = 5 THEN e.examEs
                    ELSE e.examKo
                END AS examSelected,
                e.imageName,
                e.imagePath
            FROM testItem ti
            INNER JOIN exam e ON e.examNo = ti.examNo
            WHERE ti.testNo = #{testNo}
            ORDER BY ti.testItemNo
            """)
    @Results(id = "TestItemWithMediaMap", value = {
            @Result(column = "testItemNo", property = "testItemNo", id = true),
            @Result(column = "question", property = "question"),
            @Result(column = "questionSelected", property = "questionSelected"),
            @Result(column = "testNo", property = "testNo"),
            @Result(column = "examNo", property = "examNo"),
            @Result(column = "examKo", property = "examKo"),
            @Result(column = "examSelected", property = "examSelected"),
            @Result(column = "imageName", property = "imageName"),
            @Result(column = "imagePath", property = "imagePath"),
            @Result(property = "audios", column = "examNo",
                    many = @Many(select = "web.model.mapper.TestMapper.findAudiosByExamNo"))
    })
    List<TestItemWithMediaDto> findTestItemsWithMedia(@Param("testNo") int testNo, @Param("langNo") int langNo);

    // 2-2) 특정 문항 개별 조회 (langNo 반영)
    @Select("""
            SELECT 
                ti.testItemNo,
                ti.question,
                CASE 
                    WHEN #{langNo} = 2 THEN ti.questionJp
                    WHEN #{langNo} = 3 THEN ti.questionCn
                    WHEN #{langNo} = 4 THEN ti.questionEn
                    WHEN #{langNo} = 5 THEN ti.questionEs
                    ELSE ti.question
                END AS questionSelected,
                ti.testNo,
                ti.examNo
            FROM testItem ti
            WHERE ti.testItemNo = #{testItemNo}
            """)
    TestItemDto findTestItemByNo(@Param("testItemNo") int testItemNo, @Param("langNo") int langNo);

    // exam별 오디오 목록
    @Select("""
            SELECT audioNo, audioName, audioPath, lang, examNo
            FROM audio
            WHERE examNo = #{examNo}
            ORDER BY audioNo
            """)
    List<AudioDto> findAudiosByExamNo(int examNo);

    // 3-1) 정답(예문) 조회: Gemini 채점용 (langNo 반영)
    @Select("""
            SELECT 
                examNo,
                examKo,
                CASE 
                    WHEN #{langNo} = 2 THEN examJp
                    WHEN #{langNo} = 3 THEN examCn
                    WHEN #{langNo} = 4 THEN examEn
                    WHEN #{langNo} = 5 THEN examEs
                    ELSE examKo
                END AS examSelected,
                examEn, examJp, examCn, examEs
            FROM exam
            WHERE examNo = #{examNo}
            """)
    ExamDto findExamByNo(@Param("examNo") int examNo, @Param("langNo") int langNo);

    // 3-2) N개의 랜덤 오답 예문 조회 (정답 제외, langNo 반영)
    @Select("""
            SELECT 
                examNo,
                examKo,
                CASE 
                    WHEN #{langNo} = 2 THEN examJp
                    WHEN #{langNo} = 3 THEN examCn
                    WHEN #{langNo} = 4 THEN examEn
                    WHEN #{langNo} = 5 THEN examEs
                    ELSE examKo
                END AS examSelected
            FROM exam
            WHERE examNo != #{excludedExamNo}
            ORDER BY RAND()
            LIMIT #{limit}
            """)
    List<ExamDto> findRandomExamsExcluding(
            @Param("excludedExamNo") int excludedExamNo,
            @Param("limit") int limit,
            @Param("langNo") int langNo);

    // 4) 랭킹(응답 기록) 저장
    @Insert("""
            INSERT INTO ranking (testRound, selectedExamNo, userAnswer, isCorrect, testItemNo, userNo, resultDate)
            VALUES (#{testRound}, #{selectedExamNo}, #{userAnswer}, #{isCorrect}, #{testItemNo}, #{userNo}, NOW())
            """)
    int upsertRanking(RankingDto dto);

    // 5) 점수 집계
    @Select("""
            SELECT 
                SUM(CASE WHEN r.isCorrect = 1 THEN 1 ELSE 0 END) AS score,
                COUNT(*) AS total
            FROM ranking r
            JOIN testItem ti ON r.testItemNo = ti.testItemNo AND ti.testNo = #{testNo}
            WHERE r.userNo = #{userNo} AND r.testRound = #{testRound}
            """)
    RankingDto getScore(@Param("userNo") int userNo, @Param("testNo") int testNo, @Param("testRound") int testRound);

}