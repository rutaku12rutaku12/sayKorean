//package web.service;
//
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import web.model.dto.ExamDto;
//import web.model.dto.RankingDto;
//import web.model.dto.TestDto;
//import web.model.dto.TestItemDto;
//import web.model.mapper.TestMapper;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class TestService { // class start
//
//    private final TestMapper testMapper;
//    private final GeminiScoringService gemini; // 너가 만든 채점 서비스(google-genai 사용)
//    private static final int PASS_THRESHOLD = 60;
//
//    public List<TestDto> getListTest(int studyNo) {
//        return testMapper.getListTest(studyNo);
//    }
//
//    public List<TestItemDto> findTestItem(int testNo) {
//        return testMapper.findTestItem(testNo);
//    }
//
//    public ExamDto findExamByNo(int examNo) {
//        return testMapper.findExamByNo(examNo);
//    }
//
//    public int upsertRanking(RankingDto dto) {
//        return testMapper.upsertRanking(dto);
//    }
//
//    public RankingDto getScore(int userNo, int testNo, int testRound) {
//        return testMapper.getScore(userNo, testNo, testRound);
//    }
//
//    /** 서술형 제출 → Gemini 점수(0~100) → 60↑=정답(1) → ranking INSERT(누적) */
//    @Transactional
//    public int submitFreeAnswer(
//            int userNo,
//            int testNo,
//            int testItemNo,
//            int testRound,
//            Integer selectedExamNo, // 객관식겸용: 서술형이면 null 가능
//            String userAnswer,
//            String langHint
//    ) {
//        // 1) 문항/정답 로드 (리스트에서 필터)
//        TestItemDto item = testMapper.findTestItem(testNo).stream()
//                .filter(t -> t.getTestItemNo() == testItemNo)
//                .findFirst()
//                .orElseThrow(() -> new IllegalArgumentException("잘못된 testItemNo 입니다."));
//
//        ExamDto exam = testMapper.findExamByNo(item.getExamNo());
//        if (exam == null) throw new IllegalArgumentException("예문(exam)을 찾을 수 없습니다.");
//
//        String question = item.getQuestion();
//        String groundTruth = pickGroundTruthByLang(exam, langHint);
//
//        // 2) Gemini 점수
//        int score;
//        try {
//            score = gemini.score(question, groundTruth, userAnswer, langHint).score();
//        } catch (Exception ex) {
//            score = 0; // 장애시 0점 처리(로그는 gemini 내부/외부에서)
//        }
//
//        // 3) 정답 여부
//        int isCorrect = (score >= PASS_THRESHOLD) ? 1 : 0;
//
//        // 4) 랭킹 저장(누적 INSERT)
//        RankingDto rec = new RankingDto();
//        rec.setTestRound(testRound);
//        rec.setSelectedExamNo(selectedExamNo);
//        rec.setUserAnswer(userAnswer);
//        rec.setIsCorrect(isCorrect);
//        rec.setTestItemNo(testItemNo);
//        rec.setUserNo(userNo);
//
//        testMapper.upsertRanking(rec);
//        return score;
//    }
//
//    private String pickGroundTruthByLang(ExamDto exam, String langHint) {
//        if (langHint == null) return safe(exam.getExamKo());
//        switch (langHint.toLowerCase()) {
//            case "en": return safe(exam.getExamEn());
//            case "jp":
//            case "ja": return safe(exam.getExamJp());
//            case "cn":
//            case "zh": return safe(exam.getExamCn());
//            case "es": return safe(exam.getExamEs());
//            default:   return safe(exam.getExamKo());
//        }
//    }
//    private String safe(String s) { return (s == null) ? "" : s; }
//
//} // class end
