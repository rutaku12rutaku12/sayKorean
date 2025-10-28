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
    public List<TestDto> getListTest(int langNo) {
        return testMapper.getListTest(langNo);
    }

    // [2] 문항 목록 (이미지/오디오 포함)
    public List<TestItemWithMediaDto> findTestItem(int testNo, int langNo) {
        return testMapper.findTestItemsWithMedia(testNo, langNo);
    }


    // [3] 정답 예문 조회
    public ExamDto findExamByNo(int examNo, int langNo) {
        return testMapper.findExamByNo(examNo, langNo);
    }


    // [4] 랭킹 저장
    public int upsertRanking(RankingDto dto) {
        return testMapper.upsertRanking(dto);
    }

    // [5] 점수 집계
    public RankingDto getScore(int userNo, int testNo, int testRound) {
        return testMapper.getScore(userNo, testNo, testRound);
    }

    // [6] 제출 처리 (prefix 강제 분기)
    @Transactional
    public int submitFreeAnswer(
            int userNo,
            int testNo,
            int testItemNo,
            int testRound,
            Integer selectedExamNo,
            String userAnswer,
            int langNo
    ) {
        // 1) 문항 로드 (언어 반영)
        TestItemWithMediaDto item = testMapper.findTestItemsWithMedia(testNo, langNo).stream()
                .filter(t -> t.getTestItemNo() == testItemNo)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("잘못된 testItemNo 입니다."));

        final String q = nullToEmpty(item.getQuestionSelected()).trim();
        System.out.printf("[DEBUG] testItemNo=%d, question='%s'%n", testItemNo, q);

        // ===== 여기서 직접 유형 판별 =====
        // 공백/콜론 제거 후 접두어로 판별
        final String norm = q.replaceAll("\\s+", "");
        final boolean isMC = norm.startsWith("그림:") || norm.startsWith("음성:");
        final boolean isSub = norm.startsWith("주관식:");

        // 2) 정답 예문 로드 (언어 반영)
        ExamDto exam = testMapper.findExamByNo(item.getExamNo(), langNo);
        if (exam == null) throw new IllegalArgumentException("예문(exam)을 찾을 수 없습니다.");

        int score;
        int isCorrect;

        if (isMC) {
            isCorrect = (selectedExamNo != null && selectedExamNo.equals(item.getExamNo())) ? 1 : 0;
            score = (isCorrect == 1) ? 100 : 0;
        } else if (isSub) {
            try {
                score = gemini.score(
                        // "주관식:" 접두어 제거
                        q.replaceFirst("^주관식\\s*:?\\s*", ""),
                        nullToEmpty(exam.getExamSelected()),
                        nullToEmpty(userAnswer),
                        convertToLangHint(langNo)
                ).score();
            } catch (Exception ex) {
                ex.printStackTrace();
                score = 0;
            }
            isCorrect = (score >= PASS_THRESHOLD) ? 1 : 0;
        } else {
            throw new IllegalArgumentException("문항 유형을 판별할 수 없습니다. (그림:/음성:/주관식: 중 하나로 시작)");
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

    // 필요하면 그대로 사용
    private String nullToEmpty(String s) {
        return s == null ? "" : s;
    }

    private String convertToLangHint(int langNo) {
        switch (langNo) {
            case 2:
                return "en";
            case 3:
                return "jp";
            case 4:
                return "cn";
            case 5:
                return "es";
            default:
                return "ko";
        }
    }
} // class end