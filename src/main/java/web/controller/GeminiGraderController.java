package web.controller;

import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.RankingDto;
import web.service.TestService;

@RestController
@RequestMapping("/saykorean/test")
@RequiredArgsConstructor
public class GeminiGraderController { // class start

    private final TestService testService;

    // 요청 데이터 클래스
    // Controller 내부에서만 잠깐 쓰는 요청/응답 데이터 전송용 DTO
    @Data
    public static class SubmitReq {
        private Integer testRound;       // 시험 회차
        private Integer selectedExamNo;  // 객관식일 경우 선택된 보기번호
        private String userAnswer;       // 서술형 사용자 응답
        private String langHint;         // "ko"/"en" 등 언어 힌트
    }

    // 응답 데이터 구조 정의 (응답용)
    @Data
    public static class SubmitRes {
        private int score;       // 점수(0~100)
        private int isCorrect;   // 정답 여부 (0 or 1)
    }


      // [POST] 서술형 답변 제출 API
      // - 세션에서 userNo 가져오기
      // - 필수값 검증
      // - 서비스 호출 (Gemini 채점)
      // - 점수 및 정답여부 응답

    @PostMapping("/{testNo}/items/{testItemNo}/answer")
    public ResponseEntity<?> submit(
            @PathVariable int testNo,
            @PathVariable int testItemNo,
            @RequestBody SubmitReq body,
            HttpSession session
    ) {
        try {
            // 1) 로그인 세션 확인
            Integer userNo = (Integer) session.getAttribute("userNo");
            if (userNo == null) return ResponseEntity.status(401).body("로그인 필요");

            // 2) 필수 입력값 확인
            if (body.getTestRound() == null || body.getUserAnswer() == null) {
                return ResponseEntity.badRequest().body("testRound와 userAnswer는 필수입니다.");
            }

            // 3) Gemini 자동채점 로직 호출
            int score = testService.submitFreeAnswer(
                    userNo,
                    testNo,
                    testItemNo,
                    body.getTestRound(),
                    body.getSelectedExamNo(),
                    body.getUserAnswer(),
                    body.getLangHint()
            );

            // 4) 응답 객체 구성
            SubmitRes res = new SubmitRes();
            res.setScore(score);
            res.setIsCorrect(score >= 60 ? 1 : 0);

            // 5) 최종 응답 반환
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            // 예외 발생
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("제출 중 오류: " + e.getMessage());
        }
    }


     // [GET] 특정 시험의 전체 점수 집계
     // - 세션 확인
     // -  회차번호 검증
     // -  서비스 호출로 DB 점수 집계

    @GetMapping("/{testNo}/score")
    public ResponseEntity<?> score(
            @RequestParam Integer testRound,
            @PathVariable int testNo,
            HttpSession session
    ) {
        Integer userNo = (Integer) session.getAttribute("userNo");
        if (userNo == null) return ResponseEntity.status(401).body("로그인 필요");
        if (testRound == null) return ResponseEntity.badRequest().body("testRound 필요");

        // 랭킹 테이블 기준 점수/총문항 조회
        RankingDto score = testService.getScore(userNo, testNo, testRound);
        return ResponseEntity.ok(score);
    }
} // class end