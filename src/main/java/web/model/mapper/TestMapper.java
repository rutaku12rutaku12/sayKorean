package web.model.mapper;


import org.apache.ibatis.annotations.*;
import web.model.dto.*;

import java.util.List;

@Mapper
public interface TestMapper { // mapper start


    // 내가 배운 주제에 맞는 시험 목록 출력
    // 1) 시험 목록 (특정 studyNo)
    @Select("SELECT * FROM test")
    List<TestDto> getListTest();


    // 2) 특정 시험의 문항 목록
//    @Select("SELECT testItemNo, question, examNo, testNo FROM testItem WHERE testNo = #{testNo} ORDER BY testItemNo")
//    List<TestItemDto> findTestItem( int testNo );


    // 문항 + 정답(exam) 이미지까지 한 번에 로드 (INNER JOIN)
    @Select(
            "SELECT " +
                    "ti.testItemNo, " +
                    "ti.question, " +
                    "ti.testNo, " +
                    "ti.examNo, " +
                    "e.examKo, " +
                    "e.imageName, " +
                    "e.imagePath " +
                    "FROM testItem ti " +
                    "INNER JOIN exam e ON e.examNo = ti.examNo " +
                    "WHERE ti.testNo = #{testNo} " +
                    "ORDER BY ti.testItemNo"
    )
    @Results(id = "TestItemWithMediaMap", value = {
            @Result(column = "testItemNo", property = "testItemNo", id = true),
            @Result(column = "question",   property = "question"),
            @Result(column = "testNo",     property = "testNo"),
            @Result(column = "examNo",     property = "examNo"),
            @Result(column = "examKo",     property = "examKo"),
            @Result(column = "imageName",  property = "imageName"),
            @Result(column = "imagePath",  property = "imagePath"),

            // 오디오는 1:N 이므로 별도 쿼리로 매핑 (@Many)
            @Result(property = "audios", column = "examNo",
                    many = @Many(select = "web.model.mapper.TestMapper.findAudiosByExamNo"))
    })
    List<TestItemWithMediaDto> findTestItemsWithMedia(int testNo);


    // 🎧 exam별 오디오 목록
    @Select(
            "SELECT audioNo, audioName, audioPath, lang, examNo " +
                    "FROM audio " +
                    "WHERE examNo = #{examNo} " +
                    "ORDER BY audioNo"
    )
    List<AudioDto> findAudiosByExamNo(int examNo);

    // 3) 정답(예문) 조회: Gemini 채점용 ground truth 확보
    @Select("SELECT examNo, examKo, examEn, examJp, examCn, examEs FROM exam WHERE examNo = #{examNo}")
    ExamDto findExamByNo( int examNo );





    // 전체 점수 출력 - 로직 : 랭킹테이블에 저장 -> 점수 집계

    // 4) 랭킹(응답 기록) 저장: 누적 INSERT
    @Insert("INSERT INTO ranking (testRound, selectedExamNo, userAnswer, isCorrect, testItemNo, userNo, resultDate) VALUES (#{testRound}, #{selectedExamNo}, #{userAnswer}, #{isCorrect}, #{testItemNo}, #{userNo}, NOW())")
    int upsertRanking( RankingDto dto );

    // 5) 점수 집계 (해당 시험/회차)
    // - score = 정답 개수
    // - total = 전체 문항 수
    @Select("SELECT SUM(CASE WHEN r.isCorrect = 1 THEN 1 ELSE 0 END) AS score, COUNT(*) AS total " +
            "FROM ranking r JOIN testItem ti ON ti.testItemNo = r.testItemNo " +
            "WHERE r.userNo = #{userNo} AND r.testRound = #{testRound} AND ti.testNo = #{testNo}")
    RankingDto getScore(int userNo, int testNo, int testRound);




} // mapper end
