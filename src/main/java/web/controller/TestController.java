package web.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.*;
import web.service.TestService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/saykorean/test")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    // 1) 시험 목록 조회 (언어 설정 반영)
    // URL: http://localhost:8080/saykorean/test?langNo=4
    @GetMapping("")
    public ResponseEntity<List<TestDto>> getListTest(@RequestParam(defaultValue = "0") int langNo) {
        List<TestDto> result = testService.getListTest(langNo);
        return ResponseEntity.ok(result);
    }

    // 2) 특정 시험의 문항 목록 조회 (언어 설정 반영)
    // URL: http://localhost:8080/saykorean/test/1/items?langNo=4
    @GetMapping("/{testNo}/items")
    public ResponseEntity<List<TestItemWithMediaDto>> getTestItems(
            @PathVariable int testNo,
            @RequestParam(defaultValue = "0") int langNo) {
        List<TestItemWithMediaDto> result = testService.findTestItemsWithMedia(testNo, langNo);
        return ResponseEntity.ok(result);
    }

    // 3) 정답 예문 조회 (언어 설정 반영)
    // URL: http://localhost:8080/saykorean/test/exam/1?langNo=4
    @GetMapping("/exam/{examNo}")
    public ResponseEntity<ExamDto> getExam(
            @PathVariable int examNo,
            @RequestParam(defaultValue = "0") int langNo) {
        ExamDto result = testService.findExamByNo(examNo, langNo);
        return ResponseEntity.ok(result);
    }

    // 4) 랜덤 오답 예문 조회 (언어 설정 반영)
    // URL: http://localhost:8080/saykorean/test/exam/random?excludedExamNo=1&limit=3&langNo=4
    @GetMapping("/exam/random")
    public ResponseEntity<List<ExamDto>> getRandomExams(
            @RequestParam int excludedExamNo,
            @RequestParam(defaultValue = "3") int limit,
            @RequestParam(defaultValue = "0") int langNo) {
        List<ExamDto> result = testService.findRandomExamsExcluding(excludedExamNo, limit, langNo);
        return ResponseEntity.ok(result);
    }

    // 5-1) 답안 제출 및 Gemini 채점 (주관식)
    // URL: http://localhost:8080/saykorean/test/submit/score
    // BODY: { "userNo": 1, "testItemNo": 1, "examNo": 1, "userAnswer": "안녕하세요", "testRound": 1, "langNo": 4 }
    @PostMapping("/submit/score")
    public ResponseEntity<ScoringResultDto> submitAndScore(@RequestBody ScoringRequestDto request) {
        ScoringResultDto result = testService.submitAndScore(request);
        return ResponseEntity.ok(result);
    }

    // 5-2) 답안 제출 (객관식 - Gemini 없이)
    // URL: http://localhost:8080/saykorean/test/submit
    @PostMapping("/submit")
    public ResponseEntity<Integer> submitAnswer(@RequestBody RankingDto rankingDto) {
        int result = testService.upsertRanking(rankingDto);
        return ResponseEntity.ok(result);
    }

    // 6) 점수 조회
    // URL: http://localhost:8080/saykorean/test/score?userNo=1&testNo=1&testRound=1
    @GetMapping("/score")
    public ResponseEntity<RankingDto> getScore(
            @RequestParam int userNo,
            @RequestParam int testNo,
            @RequestParam int testRound) {
        RankingDto result = testService.getScore(userNo, testNo, testRound);
        return ResponseEntity.ok(result);
    }
}