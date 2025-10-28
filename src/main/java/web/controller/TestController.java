package web.controller;

import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.RankingDto;
import web.model.dto.TestDto;
import web.model.dto.TestItemWithMediaDto;
import web.service.TestService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/saykorean/test")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    // [1] 시험 목록 조회
    @GetMapping
    public ResponseEntity<List<TestDto>> getListTest(@RequestParam int langNo) {
        return ResponseEntity.ok(testService.getListTest(langNo));
    }

    // [2] 특정 시험 문항 + 보기 조회
    @GetMapping("/findtestitem")
    public ResponseEntity<List<TestItemWithMediaDto>> findTestItem(
            @RequestParam int testNo, @RequestParam int langNo
    ) {
        return ResponseEntity.ok(testService.findTestItem(testNo, langNo));
    }

    // [3] 점수 조회
    @GetMapping("/getscore")
    public ResponseEntity<RankingDto> getScore(
            @RequestParam int userNo,
            @RequestParam int testNo,
            @RequestParam int testRound
    ) {
        return ResponseEntity.ok(testService.getScore(userNo, testNo, testRound));
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
