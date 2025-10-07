package web.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.GenreDto;
import web.service.AdminStudyService;

@RestController
@RequestMapping("/saykorean/admin/study")
@RequiredArgsConstructor
@Log4j2
public class AdminStudyController {
    // [*] DI
    private final AdminStudyService adminStudyService;

    // [AGR-01] 장르 생성
    // 장르 테이블 레코드를 추가한다
    @PostMapping("/genre")
    public ResponseEntity<Integer> createGenre(@RequestBody GenreDto genreDto) {
        int result = adminStudyService.createGenre(genreDto);
        return ResponseEntity.ok(result);
    }

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

// [*] 예외 핸들러 : 전역으로도 사용 가능
@RestControllerAdvice (assignableTypes = {AdminStudyController.class}) // 해당 컨트롤러에서만 적용
class AdminStudyExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        // 오류 메시지를 문자열 타입으로 반환한다
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}
