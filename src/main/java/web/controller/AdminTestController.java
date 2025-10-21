package web.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import web.service.AdminTestService;

// [*] 예외 핸들러 : 전역으로도 사용 가능
@Log4j2
@RestControllerAdvice(assignableTypes = {AdminTestController.class}) // 해당 컨트롤러에서만 적용
class AdminTestExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        // 로그 에러 개발자에게 반환
        log.error("에러 발생 : {}", e.getMessage(), e);

        // 클라이언트에게 보낼 메시지는 명확하게!
        String userMessage = "요청 처리 중 오류 발생했습니다.";
        if (e.getMessage().contains("Duplicate entry")) {
            userMessage = "이미 존재하는 데이터입니다.";
        } else if (e.getMessage().contains("foreign key constraint")) {
            userMessage = "연관된 데이터가 있어 삭제할 수 없습니다.";
        }

        // 클라이언트 메시지 반환
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(userMessage);
    }
}

@RestController
@RequestMapping("/saykorean/admin/test")
@RequiredArgsConstructor
public class AdminTestController {

    // [*] DI
    private final AdminTestService adminTestService;

    // [ATE-01] 시험 생성 createTest()
    // 시험 테이블 레코드를 추가한다
    // 매개변수 TestDto
    // 반환 int (PK)
    // 1) 셀렉트 박스 활용하여 Genre -> 하위 Study 테이블 -> 하위 Exam 테이블 조회 후 StudyNo 연동
    // 2) 시험제목(testTitle)을 입력받는다
    // 3) 해당하는 Study 테이블의 studyNo를 FK로 받는다."
    // URL : http://localhost:8080/saykorean/admin/test
    // BODY : { "testTitle" : "인사 표현 익히기" , "studyNo" : 1 }

    // [ATE-02] 시험 수정 updateTest()
    // 시험 테이블 레코드를 변경한다
    // 매개변수 TestDto
    // 반환 int
    // 1) ATE-01 로직에서 연결한 studyNo가 같은 study 테이블의 주제를 불러온다.
    // 2) 시험제목(testTitle)을 수정한다
    // URL : http://localhost:8080/saykorean/admin/test
    // BODY : { "testTitle" : "인사 표현 익히기" , "studyNo" : 1 , "testNo" : 1 }

    // [ATE-03] 시험 삭제 deleteTest()
    // 시험 테이블 레코드를 삭제한다
    // 매개변수 int
    // 반환 int
    // URL : http://localhost:8080/saykorean/admin/test?testNo=1

    // [ATE-04] 시험 전체조회 getTest()
    // 시험 테이블 레코드를 모두 조회한다
    // 반환 List<TestDto>
    // URL : http://localhost:8080/saykorean/admin/test

    // [ATE-05]	시험 개별조회	getIndiTest()
    // 시험 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 TestDto
    // URL : http://localhost:8080/saykorean/admin/test/indi?testNo=1

    // [ATI-01]	시험문항 생성	createTestItem()
    // 시험문항 테이블 레코드를 추가한다
    // 매개변수 TestItemDto
    // 반환 int(PK)
    // 1) ATE-01 로직 실행 후 examNo와 testNo를 이어받는다.
    // 2) 셀렉트박스로 질문유형(그림/음성/주관식)을 제공한다.
    // 3) 정기시험 형식으로 주제 당 그림, 음성, 주관식 총 3항목씩만 만들기
    // URL : http://localhost:8080/saykorean/admin/testitem
    // BODY : { "question" : "그림1: 올바른 인사 표현을 고르세요." , "examNo" : 1 , "testNo" : 1 }

    // [ATI-02]	시험문항 수정	updateTestItem()
    // 시험문항 테이블 레코드를 변경한다
    // 매개변수 TestItemDto
    // 반환 int
    // URL : http://localhost:8080/saykorean/admin/testitem
    // BODY : { "question" : "그림1: 올바른 인사 표현을 고르세요." , "examNo" : 1 , "testNo" : 1 , "testItemNo" : 1 }

    // [ATI-03]	시험문항 삭제	deleteTestItem()
    // 시험문항 테이블 레코드를 삭제한다
    // 매개변수 int
    // 반환 int
    // URL : http://localhost:8080/saykorean/admin/testitem?testItemNo=1

    // [ATI-04]	시험문항 전체조회	getTestItem()
    // 시험문항 테이블 레코드를 모두 조회한다
    // 반환 List<TestItemDto>
    // URL : http://localhost:8080/saykorean/admin/testitem

    // [ATI-05]	시험문항 개별조회	getIndiTestItem()
    // 시험문항 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 TestItemDto
    // * 난수화해서 사용자가 시험을 풀 때 조회할 수 있게 한다.
    // URL : http://localhost:8080/saykorean/admin/testitem/indi?testItemNo=1


}
