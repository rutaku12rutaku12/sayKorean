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
    @GetMapping("")
    public ResponseEntity<List<TestDto>> getListTest() {
        return ResponseEntity.ok(testService.getListTest());
    }

    // [2] 랭킹(응답 기록) 저장 — 직접 insert 테스트용
    @PostMapping("")
    public ResponseEntity<Integer> upsertRanking(@RequestBody RankingDto dto) {
        return ResponseEntity.ok(testService.upsertRanking(dto));
    }

     @GetMapping("/findtestitem")
    public ResponseEntity<List<TestItemWithMediaDto>> findTestItem( @RequestParam int testNo ){
        return ResponseEntity.ok( testService.findTestItem( testNo ) );
    }

    // [3] 특정 사용자/회차의 점수 조회
    @GetMapping("/getscore")
    public ResponseEntity<RankingDto> getScore(
            @RequestParam int userNo, // 사용자 번호(임시: 쿼리로 수신)
            @RequestParam int testNo,
            @RequestParam int testRound
    ) {
        return ResponseEntity.ok(testService.getScore(userNo, testNo, testRound));
    }

    //
    // [4] 문제 제출 (객관식/주관식 통합)
    // - 세션의 userNo 사용
    // 경로 변수로 시험/문항 지정
    @PostMapping("/{testNo}/items/{testItemNo}/answer")
    public ResponseEntity<?> submitAnswer(
            @PathVariable int testNo,
            @PathVariable int testItemNo,
            @RequestBody SubmitReq body,
            HttpSession session
    ) {
        try {
            // 1) 로그인 체크: 세션에 userNo 없으면 401
            Integer userNo = (Integer) session.getAttribute("userNo");
            if (userNo == null) {
                return ResponseEntity.status(401).body("로그인 필요");
            }

            // 2) 필수값 검증: 회차 누락 방지
            if (body.getTestRound() == null) {
                return ResponseEntity.badRequest().body("testRound는 필수입니다.");
            }

            // 3) 서비스 호출: 내부에서 객관식/주관식 자동 판별 및 채점/저장
            int score = testService.submitFreeAnswer(
                    userNo,
                    testNo,
                    testItemNo,
                    body.getTestRound(),
                    body.getSelectedExamNo(),
                    body.getUserAnswer(),
                    body.getLangHint()
            );

            // 4) 응답 구성: 점수와 정답 여부(60점 이상)
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

    // 요청 DTO (객관식/주관식 공통)
    @Data
    static class SubmitReq {
        private Integer testRound;       // 회차
        private Integer selectedExamNo;  // 객관식 선택번호
        private String userAnswer;       // 주관식 답변
        private String langHint;        // 힌트
    }
}
