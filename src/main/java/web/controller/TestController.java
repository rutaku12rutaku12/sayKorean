package web.controller;

import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.RankingDto;
import web.model.dto.TestDto;
import web.model.dto.TestItemDto;
import web.service.TestService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/saykorean/test")
@RequiredArgsConstructor
public class TestController { // class start


    private final TestService testService;

    // 1) 시험 목록 조회
    @GetMapping("")
    public ResponseEntity<List<TestDto>> getListTest() {
        return ResponseEntity.ok(testService.getListTest());
    }

    // 2) 특정 시험(testNo)의 문항 목록 조회
//    @GetMapping("/findtestitem")
//    public ResponseEntity<List<TestItemDto>> findTestItem(@RequestParam int testNo) {
//        return ResponseEntity.ok(testService.findTestItem(testNo));
//    }

    // 3) 랭킹(응답 기록) 저장 — 직접 insert 테스트용
    @PostMapping("")
    public ResponseEntity<Integer> upsertRanking(@RequestBody RankingDto dto) {
        return ResponseEntity.ok(testService.upsertRanking(dto));
    }

    // 4) 특정 사용자/회차의 점수 조회
    @GetMapping("/getscore")
    public ResponseEntity<RankingDto> getScore(
            @RequestParam int userNo,
            @RequestParam int testNo,
            @RequestParam int testRound
    ) {
        return ResponseEntity.ok(testService.getScore(userNo, testNo, testRound));
    }


     // [5] 서술형 자동채점 엔드포인트 (Gemini 이용)
     // - Controller에서 직접 TestService 호출
     // - Session에서 userNo 가져옴
     // - 채점 후 점수 Map 형태로 반환

    @PostMapping("/test/{testNo}/items/{testItemNo}/free")
    public ResponseEntity<Map<String, Object>> submitFree(
            @PathVariable int testNo,
            @PathVariable int testItemNo,
            @RequestBody SubmitReq body,
            HttpSession session
    ) throws Exception {
        Integer userNo = (Integer) session.getAttribute("userNo");
        if (userNo == null) return ResponseEntity.status(401).build();

        int score = testService.submitFreeAnswer(
                userNo,
                testNo,
                testItemNo,
                body.getTestRound(),
                body.getSelectedExamNo(),
                body.getUserAnswer(),
                body.getLangHint()
        );

        // 점수만 반환
        return ResponseEntity.ok(Map.of("score", score));
    }

    // 요청 DTO 클래스
    // Controller 내부에서만 잠깐 쓰는 요청/응답 데이터 전송용 DTO
    @Data
    static class SubmitReq {
        private int testRound;           // 시험 회차
        private Integer selectedExamNo;  // 객관식일 경우 선택 보기번호
        private String userAnswer;       // 사용자 답변
        private String langHint;         // 언어 힌트("ko"/"en"/"jp" 등)
    }
} // class end