package web.controller;

import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.RankingDto;
import web.model.dto.TestDto;
import web.service.TestService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/saykorean/test")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    // [1] 시험 목록 조회
    @GetMapping("")
    public ResponseEntity<List<TestDto>> getListTest(@RequestParam int langNo) {
        return ResponseEntity.ok(testService.getListTest(langNo));
    }

    // [2] 특정 시험 문항 + 보기 조회
    @GetMapping("/findtestitem")
    public ResponseEntity<List<Map<String , Object>>> findTestItem(
            @RequestParam int testNo,
            @RequestParam int langNo
    ){
        return ResponseEntity.ok(testService.findTestItemWithOptions(testNo, langNo));
    }

    // [3-1] 최신 회차 점수 조회 (수정)
    @GetMapping("/getscore")
    public ResponseEntity<RankingDto> getScore(
            @RequestParam int userNo,
            @RequestParam int testNo,
            @RequestParam(required = false) Integer testRound   // null 값 먹이려고 Integer로 변경
    ) {
        // 추가 : testRound가 없으면 최신 회차를 조회
        if (testRound == null){
            return ResponseEntity.ok(testService.getLatestScore(userNo, testNo));
        }
        // testRound가 있으면 특정 회차를 조회
        return ResponseEntity.ok(testService.getScore(userNo, testNo, testRound));
    }

    // [3-2] 다음 회차 번호 조회 (추가)
    @GetMapping("/getnextround")
    public ResponseEntity<Integer> getNextRound(
            @RequestParam int testNo,
            HttpSession session
    ) {
        Integer userNo = (Integer) session.getAttribute("userNo");
        if (userNo == null){
            userNo = 1; // 임시 (실제로는 로그인 필수)
        }
        int nextRound = testService.getNextRound(userNo, testNo);
        return ResponseEntity.ok(nextRound);
    }

    // [4] 제출 API
    @PostMapping("/{testNo}/items/{testItemNo}/answer")
    public ResponseEntity<?> submitAnswer(
            @PathVariable int testNo,
            @PathVariable int testItemNo,
            @RequestBody SubmitReq body,
            HttpSession session
    ) {
        try {
            Integer userNo = (Integer) session.getAttribute("userNo");
            if (userNo == null) {
                return ResponseEntity.status(401).body("로그인 필요");
            }

            if (body.getTestRound() == null) {
                return ResponseEntity.badRequest().body("testRound는 필수입니다.");
            }

            // langHint → langNo 전달
            int score = testService.submitFreeAnswer(
                    userNo,
                    testNo,
                    testItemNo,
                    body.getTestRound(),
                    body.getSelectedExamNo(),
                    body.getUserAnswer(),
                    body.getLangNo()
            );

            return ResponseEntity.ok(Map.of(
                    "score", score,
                    "isCorrect", (score >= 60 ? 1 : 0)
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("제출 중 오류: " + e.getMessage());
        }
    }

    @Data
    static class SubmitReq {
        private Integer testRound;
        private Integer selectedExamNo;
        private String userAnswer;
        private Integer langNo; // 변경
    }
}
