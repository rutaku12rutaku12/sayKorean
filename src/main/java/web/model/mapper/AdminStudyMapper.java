package web.model.mapper;

import org.apache.ibatis.annotations.Mapper;
import web.model.dto.GenreDto;

@Mapper
public interface AdminStudyMapper {

    // [AGR-01] 장르 생성 createGenre()
    // 장르 테이블 레코드를 추가한다
    // 매개변수 GenreDto
    // 반환 int (PK)

    // [AGR-02] 장르 전체조회 getGenre()
    // 장르 테이블 레코드를 모두 조회한다
    // 반환 List

    // [AGR-03] 장르 삭제 deleteGenre()
    // 장르 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int

    // [AST-01] 교육 생성 createStudy()
    // 교육 테이블 레코드를 추가한다
    // 매개변수 StudyDto
    // 반환 int(PK)

    // [AST-02] 교육 수정 updateStudy()
    // 교육 테이블 레코드를 변경한다.
    // 매개변수 StudyDto
    // 반환 int

    // [AST-03] 교육 삭제 deleteStudy()
    // 교육 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int

    // [AST-04] 교육 전체조회 getStudy()
    // 교육 테이블 레코드를 모두 조회한다
    // 반환 List

    // [AST-05] 교육 개별조회 getIndiStudy()
    // 교육 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 Dto

    // [AEX-01] 예문 생성 createExam()
    // 예문 테이블 레코드를 추가한다
    // 매개변수 ExamDto
    // 반환 int(PK)

    // [AEX-02] 예문 수정 updateExam()
    // 예문 테이블 레코드를 변경한다.
    // 매개변수 StudyDto
    // 반환 int

    // [AEX-03] 예문 삭제 deleteExam()
    // 예문 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int

    // [AEX-04] 예문 전체조회 getExam()
    // 예문 테이블 레코드를 모두 조회한다
    // 반환 List

    // [AEX-05] 예문 개별조회 getIndiExam()
    // 예문 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 Dto


}
