//package web.controller;
//
//import jakarta.servlet.http.HttpSession;
//import lombok.Data;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import web.model.dto.RankingDto;
//import web.service.TestService;
//
//
//
//@RestController
//@RequestMapping("/saykorean/test")
//@RequiredArgsConstructor
//public class GeminiGraderController { // class start
//    private final TestService testService;
//
//    @Data
//    public static class SubmitReq {
//        private Integer testRound;       // 회차
//        private Integer selectedExamNo;  // 객관식 쓰면 전달, 아니면 null
//        private String userAnswer;       // 서술형 답
//        private String langHint;         // "ko" 등(선택)
//    }
//
//    @Data
//    public static class SubmitRes {
//        private int score;
//        private int isCorrect;
//    }
//
//    @PostMapping("/{testNo}/items/{testItemNo}/answer")
//    public ResponseEntity<?> submit(
//            @PathVariable int testNo,
//            @PathVariable int testItemNo,
//            @RequestBody SubmitReq body,
//            HttpSession session
//    ) {
//        try {
//            Integer userNo = (Integer) session.getAttribute("userNo");
//            if (userNo == null) return ResponseEntity.status(401).body("로그인 필요");
//
//            if (body.getTestRound() == null || body.getUserAnswer() == null) {
//                return ResponseEntity.badRequest().body("testRound와 userAnswer는 필수입니다.");
//            }
//
//            int score = testService.submitFreeAnswer(
//                    userNo,
//                    testNo,
//                    testItemNo,
//                    body.getTestRound(),
//                    body.getSelectedExamNo(),
//                    body.getUserAnswer(),
//                    body.getLangHint()
//            );
//
//            SubmitRes res = new SubmitRes();
//            res.setScore(score);
//            res.setIsCorrect(score >= 60 ? 1 : 0);
//            return ResponseEntity.ok(res);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.internalServerError().body("제출 중 오류: " + e.getMessage());
//        }
//    }
//
//    @GetMapping("/{testNo}/score")
//    public ResponseEntity<?> score(
//            @RequestParam Integer testRound,
//            @PathVariable int testNo,
//            HttpSession session
//    ) {
//        Integer userNo = (Integer) session.getAttribute("userNo");
//        if (userNo == null) return ResponseEntity.status(401).body("로그인 필요");
//
//        if (testRound == null) return ResponseEntity.badRequest().body("testRound 필요");
//
//        RankingDto score = testService.getScore(userNo, testNo, testRound);
//        return ResponseEntity.ok(score);
//    }
//} // class end
