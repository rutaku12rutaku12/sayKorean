package web.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.ExamDto;
import web.model.dto.GenreDto;
import web.model.dto.StudyDto;
import web.service.AdminStudyService;

import java.util.List;


// [*] 예외 핸들러 : 전역으로도 사용 가능
@Log4j2
@RestControllerAdvice(assignableTypes = {AdminStudyController.class}) // 해당 컨트롤러에서만 적용
class AdminStudyExceptionHandler {
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
@RequestMapping("/saykorean/admin/study")
@RequiredArgsConstructor
public class AdminStudyController {
    // [*] DI
    private final AdminStudyService adminStudyService;

    // [AGR-01] 장르 생성
    // 장르 테이블 레코드를 추가한다
    // URL : http://localhost:8080/saykorean/admin/study/genre
    // BODY : { "genreName" : "상대방과 나의 관계에 따른 존칭법" }
    @PostMapping("/genre")
    public ResponseEntity<Integer> createGenre(@RequestBody GenreDto genreDto) {
        int result = adminStudyService.createGenre(genreDto);
        return ResponseEntity.ok(result);
    }

    // [AGR-02] 장르 전체조회 getGenre()
    // 장르 테이블 레코드를 모두 조회한다
    // 반환 List
    // URL : http://localhost:8080/saykorean/admin/study/genre
    @GetMapping("/genre")
    public ResponseEntity<List<GenreDto>> getGenre() {
        List<GenreDto> result = adminStudyService.getGenre();
        return ResponseEntity.ok(result);
    }

    // [AGR-03] 장르 삭제 deleteGenre()
    // 장르 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int
    // URL : http://localhost:8080/saykorean/admin/study/genre?genreNo=9
    @DeleteMapping("/genre")
    public ResponseEntity<Integer> deleteGenre(@RequestParam int genreNo) {
        int result = adminStudyService.deleteGenre(genreNo);
        return ResponseEntity.ok(result);
    }

    // [AST-01] 교육 생성 createStudy()
    // 교육 테이블 레코드를 추가한다
    // 매개변수 StudyDto
    // 반환 int(PK)
    // URL : http://localhost:8080/saykorean/admin/study
    // BODY : { "themeKo" : "안부 안 묻기" , "themeJp" : "lol安否を尋ねる" ,   "themeCn" : "無问好" , "themeEn" : "didn't ask after" , "themeEs" : "non preguntar cómo le va" , "commenKo" : "지금 바빠? 라는 말은 나를 도와줄 수 있냐는 뜻이 되기도 합니다." , "commenJp" : "むやみにごめんなさいと言ったら、本当に申し訳なくなる状況になるかもしれません。" , "commenCn" : "在韩国，有一种文化是照顾与我关系不亲近的他人，这叫礼仪。" , "commenEn" : "In Korea, people who want to talk to someone they are new to on the street may think of as a cult preacher." , "commenEs" : "En Corea, se puede pensar que una persona que intenta hablar con una persona desconocida en la calle es un falso evangelista." , "genreNo" : 1 }
    @PostMapping("")
    public ResponseEntity<Integer> createStudy(@RequestBody StudyDto studyDto) {
        int result = adminStudyService.createStudy(studyDto);
        return ResponseEntity.ok(result);
    }

    // [AST-02] 교육 수정 updateStudy()
    // 교육 테이블 레코드를 변경한다.
    // 매개변수 StudyDto
    // 반환 int
    // URL : http://localhost:8080/saykorean/admin/study
    // BODY : { "studyNo" : 1 , "themeKo" : "안부 묻기" , "themeJp" : "安否を尋ねる" ,   "themeCn" : "问好" , "themeEn" : "ask after" , "themeEs" : "preguntar cómo le va" , "commenKo" : "지금 바빠? 라는 말은 나를 도와줄 수 있냐는 뜻이 되기도 합니다." , "commenJp" : "むやみにごめんなさいと言ったら、本当に申し訳なくなる状況になるかもしれません。" , "commenCn" : "在韩国，有一种文化是照顾与我关系不亲近的他人，这叫礼仪。" , "commenEn" : "In Korea, people who want to talk to someone they are new to on the street may think of as a cult preacher." , "commenEs" : "En Corea, se puede pensar que una persona que intenta hablar con una persona desconocida en la calle es un falso evangelista." , "genreNo" : 1 }
    @PutMapping("")
    public ResponseEntity<Integer> updateStudy(@RequestBody StudyDto studyDto) {
        int result = adminStudyService.updateStudy(studyDto);
        return ResponseEntity.ok(result);
    }

    // [AST-03] 교육 삭제 deleteStudy()
    // 교육 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int
    // URL : http://localhost:8080/saykorean/admin/study/indi?studyNo=1
    @DeleteMapping("")
    public ResponseEntity<Integer> deleteStudy(@RequestParam int studyNo) {
        int result = adminStudyService.deleteStudy(studyNo);
        return ResponseEntity.ok(result);
    }

    // [AST-04] 교육 전체조회 getStudy()
    // 교육 테이블 레코드를 모두 조회한다
    // 반환 List
    // URL : http://localhost:8080/saykorean/admin/study
    @GetMapping("")
    public ResponseEntity<List<StudyDto>> getStudy() {
        List<StudyDto> result = adminStudyService.getStudy();
        return ResponseEntity.ok(result);
    }

    // [AST-05] 교육 개별조회 getIndiStudy()
    // 교육 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 Dto
    // URL : http://localhost:8080/saykorean/admin/study/indi?studyNo=2
    @GetMapping("/indi")
    public ResponseEntity<StudyDto> getIndiStudy(@RequestParam int studyNo) {
        StudyDto result = adminStudyService.getIndiStudy(studyNo);
        return ResponseEntity.ok(result);
    }

    // [AEX-01] 예문 생성 createExam()
    // 예문 테이블 레코드를 추가한다
    // 매개변수 ExamDto
    // 반환 int(PK)
    // URL : http://localhost:8080/saykorean/admin/study/exam
    // BODY : { "examKo" : "배고파 죽겠지?" , "examRoman" : "baegopa jukgetjji?" , "examJp" : "お腹すいて死にそう?" , "examCn" : "饿死了?" , "examEn" : "you are starving?" , "examEs" : "es muero de hambre." , "imageName" : "100_img" , "imagePath" : "/image/oct_twpfive" , "studyNo" : 4 }
    @PostMapping("/exam")
    public ResponseEntity<Integer> createExam(@RequestBody ExamDto examDto) {
        int result = adminStudyService.createExam(examDto);
        return ResponseEntity.ok(result);
    }

    // [AEX-02] 예문 수정 updateExam()
    // 예문 테이블 레코드를 변경한다.
    // 매개변수 StudyDto
    // 반환 int
    // URL : http://localhost:8080/saykorean/admin/study/exam
    // BODY : { "examNo" : 1 , "examKo" : "배고파 죽겠느뇨?" , "examRoman" : "baegopa jukgetda." , "examJp" : "お腹すいて死にそう。" , "examCn" : "饿死了。" , "examEn" : "I’m starving." , "examEs" : "Me muero de hambre." , "imageName" : "1_img" , "imagePath" : "/image/oct_twpfive" , "studyNo" : 4 }
    @PutMapping("/exam")
    public ResponseEntity<Integer> updateExam(@RequestBody ExamDto examDto) {
        int result = adminStudyService.updateExam(examDto);
        return ResponseEntity.ok(result);
    }

    // [AEX-03] 예문 삭제 deleteExam()
    // 예문 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int
    // URL : http://localhost:8080/saykorean/admin/study/exam?examNo=76
    @DeleteMapping("/exam")
    public ResponseEntity<Integer> deleteExam(@RequestParam int examNo) {
        int result = adminStudyService.deleteExam(examNo);
        return ResponseEntity.ok(result);
    }

    // [AEX-04] 예문 전체조회 getExam()
    // 예문 테이블 레코드를 모두 조회한다
    // 반환 List
    // URL : http://localhost:8080/saykorean/admin/study/exam
    @GetMapping("/exam")
    public ResponseEntity<List<ExamDto>> getExam() {
        List<ExamDto> result = adminStudyService.getExam();
        return ResponseEntity.ok(result);
    }

    // [AEX-05] 예문 개별조회 getIndiExam()
    // 예문 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 Dto
    // URL : http://localhost:8080/saykorean/admin/study/exam/indi?examNo=1
    @GetMapping("/exam/indi")
    public ResponseEntity<ExamDto> getIndiExam(@RequestParam int examNo) {
        ExamDto result = adminStudyService.getIndiExam(examNo);
        return ResponseEntity.ok(result);
    }


}
