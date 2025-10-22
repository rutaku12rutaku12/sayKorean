package web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.ExamDto;
import web.model.dto.RankingDto;
import web.model.dto.TestDto;
import web.model.dto.TestItemWithMediaDto;
import web.model.mapper.TestMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestMapper testMapper;
    private final GeminiScoringService gemini; // Gemini 기반 자동 채점
    private static final int PASS_THRESHOLD = 60; // 통과 기준점

    // [1] 시험 목록 조회
    public List<TestDto> getListTest() {
        return testMapper.getListTest();
    }

    // [2] 특정 시험의 문항 목록 조회 (이미지+음성 포함)
    public List<TestItemWithMediaDto> findTestItem(int testNo) {
        return testMapper.findTestItemsWithMedia(testNo);
    }

    // [3] 특정 예문(정답 데이터) 조회
    public ExamDto findExamByNo(int examNo) {
        return testMapper.findExamByNo(examNo);
    }

    // [4] 랭킹(응답) 저장
    public int upsertRanking(RankingDto dto) {
        return testMapper.upsertRanking(dto);
    }

    // [5] 점수 집계 (랭킹 테이블 기준)
    public RankingDto getScore(int userNo, int testNo, int testRound) {
        return testMapper.getScore(userNo, testNo, testRound);
    }

    // [6] 서술형 답변 제출 → Gemini 채점 → 랭킹 저장
    @Transactional
    public int submitFreeAnswer(
            int userNo,
            int testNo,
            int testItemNo,
            int testRound,
            Integer selectedExamNo,
            String userAnswer,
            String langHint
    ) {
        // 1) 문항 로드
        TestItemWithMediaDto item = testMapper.findTestItemsWithMedia(testNo).stream()
                .filter(t -> t.getTestItemNo() == testItemNo)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("잘못된 testItemNo 입니다."));

        // 2) 예문 로드
        ExamDto exam = testMapper.findExamByNo(item.getExamNo());
        if (exam == null) throw new IllegalArgumentException("예문(exam)을 찾을 수 없습니다.");

        // 3) 문제/정답 준비
        String question = item.getQuestion();
        String groundTruth = pickGroundTruthByLang(exam, langHint);

        // 4) Gemini 채점
        int score;
        try {
            score = gemini.score(question, groundTruth, userAnswer, langHint).score();
        } catch (Exception ex) {
            score = 0;
        }

        // 5) 정답 여부 판단
        int isCorrect = (score >= PASS_THRESHOLD) ? 1 : 0;

        // 6) 랭킹 저장
        RankingDto rec = new RankingDto();
        rec.setTestRound(testRound);
        rec.setSelectedExamNo(selectedExamNo);
        rec.setUserAnswer(userAnswer);
        rec.setIsCorrect(isCorrect);
        rec.setTestItemNo(testItemNo);
        rec.setUserNo(userNo);

        testMapper.upsertRanking(rec);
        return score;
    }

    // [7] 언어 힌트에 따라 정답 선택
    private String pickGroundTruthByLang(ExamDto exam, String langHint) {
        if (langHint == null) return safe(exam.getExamKo());
        switch (langHint.toLowerCase()) {
            case "en": return safe(exam.getExamEn());
            case "jp":
            case "ja": return safe(exam.getExamJp());
            case "cn":
            case "zh": return safe(exam.getExamCn());
            case "es": return safe(exam.getExamEs());
            default:   return safe(exam.getExamKo());
        }
    }

    private String safe(String s) { return (s == null) ? "" : s; }
}
