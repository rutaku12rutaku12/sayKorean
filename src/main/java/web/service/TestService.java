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
    private final GeminiScoringService gemini;
    private static final int PASS_THRESHOLD = 60;

    // [1] 시험 목록
    public List<TestDto> getListTest() { return testMapper.getListTest(); }

    // [2] 문항 목록 (이미지/오디오 포함)
    public List<TestItemWithMediaDto> findTestItem(int testNo) {
        return testMapper.findTestItemsWithMedia(testNo);
    }

    // [3] 정답 예문 조회
    public ExamDto findExamByNo(int examNo) { return testMapper.findExamByNo(examNo); }

    // [4] 랭킹 저장
    public int upsertRanking(RankingDto dto) { return testMapper.upsertRanking(dto); }

    // [5] 점수 집계
    public RankingDto getScore(int userNo, int testNo, int testRound) {
        return testMapper.getScore(userNo, testNo, testRound);
    }

    // [6] 제출 처리 (prefix 강제 분기)
    @Transactional // 응답 저장까지 하나의 트랜잭션으로 보장
    public int submitFreeAnswer(
            int userNo,
            int testNo,
            int testItemNo,
            int testRound,
            Integer selectedExamNo, // 객관식이면 필수
            String userAnswer,      // 주관식이면 필수
            String langHint
    ) {
        // 1) 문항 로드
        TestItemWithMediaDto item = testMapper.findTestItemsWithMedia(testNo).stream()
                .filter(t -> t.getTestItemNo() == testItemNo)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("잘못된 testItemNo 입니다."));

        final String q = (item.getQuestion() == null) ? "" : item.getQuestion().trim();
        System.out.printf("[DEBUG] testItemNo=%d, question='%s'%n", testItemNo, q);

        // 2) 정답 예문 로드
        ExamDto exam = testMapper.findExamByNo(item.getExamNo());
        if (exam == null) throw new IllegalArgumentException("예문(exam)을 찾을 수 없습니다.");

        int score = 0;
        int isCorrect = 0;

        // 3) 규칙: "그림:" / "음성:" → 객관식 , "주관식:" → 서술형
        if (isMultipleChoice(q)) {
            if (selectedExamNo == null) {
                // selectedExamNo가 null일 경우 방어
                System.err.println("[WARN] 객관식 문제인데 selectedExamNo가 null입니다 → 오답 처리");
                isCorrect = 0;
                score = 0;
            } else {
                //  null-safe 비교
                isCorrect = selectedExamNo.equals(item.getExamNo()) ? 1 : 0;
                score = (isCorrect == 1) ? 100 : 0;
            }
        }
        else if (isSubjective(q)) {
            // 주관식: Gemini로 채점
            String groundTruth = pickGroundTruthByLang(exam, langHint);
            try {
                score = gemini.score(
                        q.replaceFirst("^주관식\\s*:?\\s*", ""), // "주관식:" prefix 제거
                        groundTruth,
                        nullToEmpty(userAnswer),
                        langHint
                ).score();
            } catch (Exception ex) {
                ex.printStackTrace();
                score = 0; // 장애 시 0점
            }
            isCorrect = (score >= PASS_THRESHOLD) ? 1 : 0;
        }
        else {
            // 규칙에 맞지 않는 경우 방어
            throw new IllegalArgumentException("문항 유형을 판별할 수 없습니다. (그림:/음성:/주관식: 중 하나로 시작해야 합니다)");
        }

        // 4) 랭킹 저장
        RankingDto rec = new RankingDto();
        rec.setTestRound(testRound);
        rec.setSelectedExamNo(selectedExamNo);
        rec.setUserAnswer(userAnswer);
        rec.setIsCorrect(isCorrect);
        rec.setTestItemNo(testItemNo);
        rec.setUserNo(userNo);
        testMapper.upsertRanking(rec);

        System.out.printf("[RESULT] userNo=%d, testItemNo=%d, score=%d, isCorrect=%d%n",
                userNo, testItemNo, score, isCorrect);

        return score;
    }

    // --- helpers ---
    private boolean isMultipleChoice(String q) {
        if (q == null) return false;
        String s = q.strip().replaceAll("\\s+", ""); // 공백·콜론 제거
        return s.startsWith("그림:") || s.startsWith("음성:");
    }

    private boolean isSubjective(String q) {
        if (q == null) return false;
        String s = q.strip().replaceAll("\\s+", "");
        return s.startsWith("주관식:");
    }

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
    private String nullToEmpty(String s) { return s == null ? "" : s; }
}