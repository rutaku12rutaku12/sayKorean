package web.model.mapper;


import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import web.model.dto.RankingDto;
import web.model.dto.TestDto;
import web.model.dto.TestItemDto;

import java.util.List;

@Mapper
public interface TestMapper { // mapper start


    // 내가 배운 주제에 맞는 시험 목록 출력
    // 특정 studyNo의 시험 목록
    @Select("SELECT testTitle, studyNo FROM test WHERE studyNo = #{studyNo} ORDER BY testNo DESC")
    List<TestDto> getListTest( int studyNo );

    // 시험 조회
    // 시험 단건
    @Select("SELECT testNo, testTitle FROM test WHERE testNo = #{testNo}")
    TestDto findTest( int testNo );




    // 특정 시험의 문항 목록
    @Select("SELECT testItemNo, question, examNo, testNo FROM test_item WHERE testNo = #{testNo} ORDER BY testItemNo")
    List<TestItemDto> findTestItem( int testNo );



    // 전체 점수 출력 - 로직 : 랭킹테이블에 저장 -> 점수 집계

    // 랭킹테이블 저장
    @Insert("INSERT INTO ranking (testRound, selectedExamNo, userAnswer, isCorrect, testItemNo, userNo) VALUES (#{testRound}, #{selectedExamNo}, #{userAnswer}, #{isCorrect}, #{testItemNo}, #{userNo})ON DUPLICATE KEY UPDATE selectedExamNo = VALUES(selectedExamNo), userAnswer = VALUES(userAnswer), isCorrect = VALUES(isCorrect), resultDate = CURRENT_TIMESTAMP")
    int upsertRanking( RankingDto dto );

    // 점수 집계: 해당 시험(testNo) & 회차(testRound)에서
// - score = 정답 개수
// - total = 전체 문항 수
    @Select("SELECT CAST(SUM(CASE WHEN r.isCorrect = 1 THEN 1 ELSE 0 END) AS UNSIGNED) AS score, CAST(COUNT(*) AS UNSIGNED) AS total FROM ranking r JOIN test_item ti ON ti.testItemNo = r.testItemNo WHERE r.userNo = #{userNo} AND r.testRound = #{testRound AND ti.testNo   = #{testNo}")
    RankingDto getScore( int userNo , int testNo , int testRound );




} // mapper end
