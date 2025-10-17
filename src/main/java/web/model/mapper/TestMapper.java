package web.model.mapper;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import web.model.dto.TestDto;

import java.util.List;

@Mapper
public interface TestMapper { // mapper start


    // 내가 배운 주제에 맞는 시험 목록 출력
    // 특정 studyNo의 시험 목록
    @Select("SELECT testNo, testTitle, studyNo FROM test WHERE studyNo = #{studyNo}ORDER BY testNo DESC")
    List<TestDto> getListTest( int studyNo );

    // 시험 조회
    // 시험 단건
    @Select("SELECT testNo, testTitle FROM test WHERE testNo = #{testNo}")
    TestDto findTest( int testNo );



    // 문제 정답/오답 확인




    // 전체 점수 출력



} // mapper end
