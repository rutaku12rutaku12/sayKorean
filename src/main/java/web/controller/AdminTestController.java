package web.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.aspectj.weaver.ast.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.TestDto;
import web.model.dto.TestItemDto;
import web.model.dto.TestTranslationRequestDto;
import web.model.dto.TranslatedTestDataDto;
import web.service.AdminTestService;
import web.service.RomanizerService;
import web.service.TranslationService;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;

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

@Log4j2
@RestController
@RequestMapping("/saykorean/admin/test")
@RequiredArgsConstructor
public class AdminTestController {

    // [*] DI
    private final AdminTestService adminTestService;
    private final TranslationService translationService;
    private final RomanizerService romanizerService;

    // [ATE-01] 시험 생성 createTest()
    // 시험 테이블 레코드를 추가한다
    // 매개변수 TestDto
    // 반환 int (PK)
    // 1) 셀렉트 박스 활용하여 Genre -> 하위 Study 테이블 -> 하위 Exam 테이블 조회 후 StudyNo 연동
    // 2) 시험제목(testTitle)을 입력받는다
    // 3) 해당하는 Study 테이블의 studyNo를 FK로 받는다."
    // URL : http://localhost:8080/saykorean/admin/test
    // BODY : { "testTitle" : "인사 표현 익히기" , "studyNo" : 1 }
    @PostMapping("")
    public ResponseEntity<Integer> createTest(@RequestBody TestDto testDto) {
        int result = adminTestService.createTest(testDto);
        return ResponseEntity.ok(result);
    }

    // [ATE-01-AUTO] 시험 생성 - 자동 문항 생성 포함
    // URL : http://localhost:8080/saykorean/admin/test/withitems
    @PostMapping("/withitems")
    public ResponseEntity<Map<String, Object>> createTestWithItems(
            @RequestBody TestDto testDto,
            @RequestParam(defaultValue = "true") boolean autoGenerate) {
        Map<String, Object> result = adminTestService.createTestWithItems(testDto, autoGenerate);
        return ResponseEntity.ok(result);
    }

    // [AUTO-Translate] 시험 자동 번역 컨트롤러
    // URL : http://localhost:8080/saykorean/admin/test/translate
    // BODY : { "testTitle" : "인사 표현 익히기", "question" : "그림: 올바른 표현을 고르세요." }
    @PostMapping("/translate")
    public ResponseEntity<TranslatedTestDataDto> translateTestData(@RequestBody TestTranslationRequestDto requestDto) {
        try {
            TranslatedTestDataDto response = translationService.translateTestData(requestDto);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("시험 번역에 실패했습니다.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // [*] 한국어 - 발음기호 변환 컨트롤러
    // URL : http://localhost:8080/saykorean/admin/test/romanize?text=안녕하세요
    @GetMapping("/romanize")
    public Map<String , String> romanize(@RequestParam String text) {
        String romanized = romanizerService.romanize(text);
        return Map.of("original" , text , "romanized" , romanized);
    }

    // [ATE-02] 시험 수정 updateTest()
    // 시험 테이블 레코드를 변경한다
    // 매개변수 TestDto
    // 반환 int
    // 1) ATE-01 로직에서 연결한 studyNo가 같은 study 테이블의 주제를 불러온다.
    // 2) 시험제목(testTitle)을 수정한다
    // URL : http://localhost:8080/saykorean/admin/test
    // BODY : { "testTitle" : "인사 표현 익히기" , "studyNo" : 1 , "testNo" : 1 }
    @PutMapping("")
    public ResponseEntity<Integer> updateTest(@RequestBody TestDto testDto) {
        int result = adminTestService.updateTest(testDto);
        return ResponseEntity.ok(result);
    }

    // [ATE-03] 시험 삭제 deleteTest()
    // 시험 테이블 레코드를 삭제한다
    // 매개변수 int
    // 반환 int
    // URL : http://localhost:8080/saykorean/admin/test?testNo=1
    @DeleteMapping("")
    public ResponseEntity<Integer> deleteTest(@RequestParam int testNo) {
        int result = adminTestService.deleteTest(testNo);
        return ResponseEntity.ok(result);
    }

    // [ATE-04] 시험 전체조회 getTest()
    // 시험 테이블 레코드를 모두 조회한다
    // 반환 List<TestDto>
    // URL : http://localhost:8080/saykorean/admin/test
    @GetMapping("")
    public ResponseEntity<List<TestDto>> getTest() {
        List<TestDto> result = adminTestService.getTest();
        return ResponseEntity.ok(result);
    }

    // [ATE-05]	시험 개별조회	getIndiTest()
    // 시험 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 TestDto
    // URL : http://localhost:8080/saykorean/admin/test/indi?testNo=1
    @GetMapping("/indi")
    public ResponseEntity<TestDto> getIndiTest(@RequestParam int testNo) {
        TestDto result = adminTestService.getIndiTest(testNo);
        return ResponseEntity.ok(result);
    }

    // [ATE-06] 특정 시험의 문항 목록 조회
    @GetMapping("/{testNo}/items")
    public ResponseEntity<List<TestItemDto>> getTestItemsByTestNo(@PathVariable int testNo) {
        List<TestItemDto> result = adminTestService.getTestItemsByTestNo(testNo);
        return ResponseEntity.ok(result);
    }

    // [ATI-01]	시험문항 생성	createTestItem()
    // 시험문항 테이블 레코드를 추가한다
    // 매개변수 TestItemDto
    // 반환 int(PK)
    // 1) ATE-01 로직 실행 후 examNo와 testNo를 이어받는다.
    // 2) 셀렉트박스로 질문유형(그림/음성/주관식)을 제공한다.
    // 3) 정기시험 형식으로 주제 당 그림, 음성, 주관식 총 3항목씩만 만들기 (예문 하나씩 가져와서)
    // URL : http://localhost:8080/saykorean/admin/testitem
    // BODY : { "question" : "그림1: 올바른 인사 표현을 고르세요." , "examNo" : 1 , "testNo" : 1 }
    @PostMapping("item")
    public ResponseEntity<Integer> createTestItem(@RequestBody TestItemDto testItemDto) {
        int result = adminTestService.createTestItem(testItemDto);
        return ResponseEntity.ok(result);
    }

    // [ATI-01-BATCH] 시험문항 일괄생성 (커스텀 시 사용)
    @PostMapping("/{testNo}/items/custom")
    public ResponseEntity<List<Integer>> createCustomTestItems(
            @PathVariable int testNo,
            @RequestBody List<TestItemDto> items) {
        List<Integer> result = adminTestService.createCustomTestItems(testNo, items);
        return ResponseEntity.ok(result);
    }

    // [ATI-02]	시험문항 수정	updateTestItem()
    // 시험문항 테이블 레코드를 변경한다
    // 매개변수 TestItemDto
    // 반환 int
    // URL : http://localhost:8080/saykorean/admin/testitem
    // BODY : { "question" : "그림1: 올바른 인사 표현을 고르세요." , "examNo" : 1 , "testNo" : 1 , "testItemNo" : 1 }
    @PutMapping("item")
    public ResponseEntity<Integer> updateTestItem(@RequestBody TestItemDto testItemDto) {
        int result = adminTestService.updateTestItem(testItemDto);
        return ResponseEntity.ok(result);
    }

    // [ATI-03]	시험문항 삭제	deleteTestItem()
    // 시험문항 테이블 레코드를 삭제한다
    // 매개변수 int
    // 반환 int
    // URL : http://localhost:8080/saykorean/admin/testitem?testItemNo=1
    @DeleteMapping("item")
    public ResponseEntity<Integer> deleteTestItem(@RequestParam int testItemNo) {
        int result = adminTestService.deleteTestItem(testItemNo);
        return ResponseEntity.ok(result);
    }

    // [ATI-04]	시험문항 전체조회	getTestItem()
    // 시험문항 테이블 레코드를 모두 조회한다
    // 반환 List<TestItemDto>
    // URL : http://localhost:8080/saykorean/admin/testitem
    @GetMapping("item")
    public ResponseEntity<List<TestItemDto>> getTestItem() {
        List<TestItemDto> result = adminTestService.getTestItem();
        return ResponseEntity.ok(result);
    }

    // [ATI-05]	시험문항 개별조회	getIndiTestItem()
    // 시험문항 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 TestItemDto
    // * 난수화해서 사용자가 시험을 풀 때 조회할 수 있게 한다.
    // URL : http://localhost:8080/saykorean/admin/testitem/indi?testItemNo=1
    @GetMapping("item/indi")
    public ResponseEntity<TestItemDto> getIndiTestItem(@RequestParam int testItemNo) {
        TestItemDto result = adminTestService.getIndiTestItem(testItemNo);
        return ResponseEntity.ok(result);
    }

}
