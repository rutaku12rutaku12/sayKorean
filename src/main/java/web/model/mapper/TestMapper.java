package web.model.mapper;


import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import web.model.dto.ExamDto;
import web.model.dto.RankingDto;
import web.model.dto.TestDto;
import web.model.dto.TestItemDto;

import java.util.List;

@Mapper
public interface TestMapper { // mapper start


    // 내가 배운 주제에 맞는 시험 목록 출력
    // 1) 시험 목록 (특정 studyNo)
    @Select("SELECT * FROM test WHERE studyNo = #{studyNo} ORDER BY testNo DESC")
    List<TestDto> getListTest( int studyNo );


    // 2) 특정 시험의 문항 목록
    @Select("SELECT testItemNo, question, examNo, testNo FROM testItem WHERE testNo = #{testNo} ORDER BY testItemNo")
    List<TestItemDto> findTestItem( int testNo );

    // 3) 정답(예문) 조회: Gemini 채점용 ground truth 확보
    @Select("SELECT examNo, examKo, examEn, examJp, examCn, examEs FROM exam WHERE examNo = #{examNo}")
    ExamDto findExamByNo(int examNo);





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
