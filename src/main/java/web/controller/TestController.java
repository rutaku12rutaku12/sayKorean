//package web.controller;
//
//
//import jakarta.servlet.http.HttpSession;
//import lombok.Data;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import web.model.dto.RankingDto;
//import web.model.dto.TestDto;
//import web.model.dto.TestItemDto;
//import web.service.TestService;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/saykorean/test")
//@RequiredArgsConstructor
//public class TestController { // class start
//
//    private final TestService testService;
//
//    @GetMapping("")
//    public ResponseEntity<List<TestDto>> getListTest( @RequestParam int studyNo ){
//        return ResponseEntity.ok( testService.getListTest( studyNo ) );
//    }
//
//    @GetMapping("/findtestitem")
//    public ResponseEntity< List<TestItemDto>> findTestItem( @RequestParam int testNo  ){
//        return ResponseEntity.ok( testService.findTestItem( testNo ) );
//    }
//
//    @PostMapping("")
//    public ResponseEntity<Integer> upsertRanking( @RequestBody RankingDto dto ){
//        return ResponseEntity.ok( testService.upsertRanking( dto ) );
//    }
//
//    @GetMapping("/getscore")
//    public ResponseEntity<RankingDto> getScore( @RequestParam int userNo , @RequestParam int testNo , @RequestParam int testRound ){
//        return ResponseEntity.ok( testService.getScore( userNo , testNo , testRound ) );
//    }
//
//    @PostMapping("/test/{testNo}/items/{testItemNo}/free")
//    public ResponseEntity<Map<String,Object>> submitFree(
//            @PathVariable int testNo,
//            @PathVariable int testItemNo,
//            @RequestBody SubmitReq body,
//            HttpSession session
//    ) throws Exception {
//        Integer userNo = (Integer) session.getAttribute("userNo");
//        if (userNo == null) return ResponseEntity.status(401).build();
//
//        int score = testService.submitFreeAnswer(
//                userNo,
//                testNo,
//                testItemNo,
//                body.getTestRound(),
//                body.getSelectedExamNo(), // 서술형이면 null 가능
//                body.getUserAnswer(),
//                body.getLangHint()
//        );
//
//        return ResponseEntity.ok(Map.of("score", score));
//    }
//
//    @Data
//    static class SubmitReq {
//        private int testRound;
//        private Integer selectedExamNo; // optional
//        private String userAnswer;
//        private String langHint; // "ko", "en" 등 선택사항
//    }
//
//}
