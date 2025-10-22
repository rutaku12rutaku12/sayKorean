package web.model.mapper;

import org.apache.ibatis.annotations.*;
import web.model.dto.TestDto;

@Mapper
public interface AdminTestMapper {

    // [ATE-01] 시험 생성 createTest()
    // 시험 테이블 레코드를 추가한다
    // 매개변수 TestDto
    // 반환 int (PK)
    // 1) 셀렉트 박스 활용하여 Genre -> 하위 Study 테이블 -> 하위 Exam 테이블 조회 후 StudyNo 연동
    // 2) 시험제목(testTitle)을 입력받는다
    // 3) 해당하는 Study 테이블의 studyNo를 FK로 받는다."
    // 4) *난수화해서 다른 문제에 생성될 수 있도록 하기*
    @Insert("insert into test (testTitle, studyNo) values (#{testTitle}, #{studyNo})")
    @Options(useGeneratedKeys = true, keyProperty = "testNo")
    int createTest(TestDto testDto);

    // [ATE-02] 시험 수정 updateTest()
    // 시험 테이블 레코드를 변경한다
    // 매개변수 TestDto
    // 반환 int
    // 1) ATE-01 로직에서 연결한 studyNo가 같은 study 테이블의 주제를 불러온다.
    // 2) 시험제목(testTitle)을 수정한다
    @Update("update test set testTitle = #{testTitle} , studyNo = #{studyNo} where testNo = #{testNo} ")
    int updateTest(TestDto testDto);

    // [ATE-03] 시험 삭제 deleteTest()
    // 시험 테이블 레코드를 삭제한다
    // 매개변수 int
    // 반환 int
    @Delete("delete from test where testNo = #{testNo}")
    int deleteTest(int testNo);

    // [ATE-04] 시험 전체조회 getTest()
    // 시험 테이블 레코드를 모두 조회한다
    // 반환 List<TestDto>

    // [ATE-05]	시험 개별조회	getIndiTest()
    // 시험 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 TestDto

    // [ATI-01]	시험문항 생성	createTestItem()
    // 시험문항 테이블 레코드를 추가한다
    // 매개변수 TestItemDto
    // 반환 int(PK)
    // 1) ATE-01 로직 실행 후 examNo와 testNo를 이어받는다.
    // 2) 셀렉트박스로 질문유형(그림/음성/주관식)을 제공한다.
    // 3) 정기시험 형식으로 주제 당 그림, 음성, 주관식 총 3항목씩만 만들기

    // [ATI-02]	시험문항 수정	updateTestItem()
    // 시험문항 테이블 레코드를 변경한다
    // 매개변수 TestItemDto
    // 반환 int

    // [ATI-03]	시험문항 삭제	deleteTestItem()
    // 시험문항 테이블 레코드를 삭제한다
    // 매개변수 int
    // 반환 int

    // [ATI-04]	시험문항 전체조회	getTestItem()
    // 시험문항 테이블 레코드를 모두 조회한다
    // 반환 List<TestItemDto>

    // [ATI-05]	시험문항 개별조회	getIndiTestItem()
    // 시험문항 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 TestItemDto
    // * 난수화해서 사용자가 시험을 풀 때 조회할 수 있게 한다.





}
