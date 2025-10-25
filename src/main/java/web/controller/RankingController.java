package web.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.RankingDto;
import web.service.RankingService;

import java.util.List;
import java.util.Map;

// [*] 예외 핸들러 : 전역으로도 사용 가능
@Log4j2
@RestControllerAdvice(assignableTypes = {RankingController.class}) // 해당 컨트롤러에서만 적용
class RankingExceptionHandler {
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
@RequestMapping("/saykorean/rank")
@RequiredArgsConstructor
public class RankingController {

    // [*] DI
    private final RankingService rankingService;

    // [RK-01]	랭킹 생성	createRank()
    // 랭킹 테이블 레코드를 추가한다.
    // 매개변수 RankingDto
    // 반환 int (PK)
    // * 사용자가 시험을 본 후 로직을 받아 처리한다.
    // * 추가 : 제미나이 정확도 채점 로직 API 활용하여 isCorrect 측정
    // 유진님이 함 패스 ㅅㄱ
    // URL : http://localhost:8080/saykorean/rank
    // BODY : { "testRound" : 1 , "userAnswer" : "객관식 문항이거나 공란으로 제출했습니다." , "isCorrect" : 1 , "resultDate" : "2025-10-16" , "testItemNo" : 1, "userNo" : 1 }


    // [RK-02]	랭킹 삭제	deleteRank()
    // 랭킹 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int
    // * 사용자가 탈퇴했을 경우에 사용하는 로직
    // URL : http://localhost:8080/saykorean/rank?rankNo=1
    @DeleteMapping("")
    public ResponseEntity<Integer> deleteRank(@RequestParam int userNo) {
        int result = rankingService.deleteRankByUser(userNo);
        return ResponseEntity.ok(result);
    }

    // [RK-03] 랭킹 분야별조회 	getRank()
    // 랭킹 테이블 레코드를 조회한다.
    // 사용자닉네임(userNo FK)과 시험명(examNo FK), 시험문항명(examNo FK)도 함께 조회.
    // 랭킹 로직 : type 분기 처리해서 넘기기
    // 1) 정답왕 : 정답률이 높은 순
    // (isCorrect의 인트값 합산이 가장 높은 사람)
    // 2) 도전왕 : 가장 많이 문제를 푼 순서
    // (isCorrect의 레코드 합산이 가장 높은 사람)
    // 3) 끈기왕 : 같은 문제에 여러번 도전한 순
    // (testRound의 평균값이 가장 높은 사람)
    // 매개변수 int
    // 반환 List<RankingDto>
    // URL : http://localhost:8080/saykorean/rank?type
    @GetMapping("")
    public ResponseEntity<List<Map<String, Object>>> getRank(@RequestParam String type) {
        List<Map<String, Object>> result = rankingService.getRank(type);
        return ResponseEntity.ok(result);
    }

    // [RK-04]	랭킹 검색조회	searchRank()
    // 랭킹 테이블 레코드를 검색조회한다.
    // 사용자닉네임(userNo FK)과 시험명(examNo FK), 시험문항명(examNo FK)도 함께 조회.
    // 서브쿼리 활용
    // 1) 사용자(userNo 조인)
    // 2) 시험문항별(testItemNo 조인)
    // 매개변수 int
    // 반환 RankingDto
    // URL : http://localhost:8080/saykorean/rank/search?userNo=3&examNo=2
    // URL : http://localhost:8080/saykorean/rank/search?userNo=3
    // URL : http://localhost:8080/saykorean/rank/search?examNo=2
    @GetMapping("/search")
    public ResponseEntity<List<RankingDto>> searchRank(
            @RequestParam(required = false) Integer userNo,
            @RequestParam(required = false) Integer testItemNo
    ) {
        List<RankingDto> result = rankingService.searchRank(userNo, testItemNo);
        return ResponseEntity.ok(result);
    }

}
