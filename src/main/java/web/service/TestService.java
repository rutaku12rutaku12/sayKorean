package web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.ExamDto;
import web.model.dto.RankingDto;
import web.model.dto.TestDto;
import web.model.dto.TestItemWithMediaDto;
import web.model.mapper.TestMapper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Collections;

import java.util.*;

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

    // [2] 문항 목록 (이미지/오디오 + 난수 옵션까지 포함)
    public List<Map<String, Object>> findTestItemWithOptions(int testNo, int langNo) {

        // 1) 기본 문항 목록 조회(언어 반영)
        List<TestItemWithMediaDto> items = testMapper.findTestItemsWithMedia(testNo, langNo);
        List<Map<String, Object>> out = new ArrayList<>();

        for (TestItemWithMediaDto item : items) {
            Map<String, Object> m = new HashMap<>();
            m.put("testItemNo", item.getTestItemNo());
            m.put("testNo", item.getTestNo());
            m.put("questionSelected", item.getQuestionSelected());
            m.put("imageName", item.getImageName());
            m.put("imagePath", item.getImagePath());
            m.put("audios", item.getAudios()); // 그대로 내려줌

            // 2) 객관식 여부 판단: 이미지 또는 오디오가 있으면 객관식
            boolean isMultiple =
                    (item.getImagePath() != null && !item.getImagePath().isBlank())
                            || (item.getAudios() != null && !item.getAudios().isEmpty());

            if (isMultiple) {
                // 정답
                ExamDto correct = testMapper.findExamByNo(item.getExamNo(), langNo);
                if (correct != null) {
                    List<Map<String, Object>> options = new ArrayList<>();

                    Map<String, Object> c = new HashMap<>();
                    c.put("examNo", correct.getExamNo());
                    // 언어 반영된 텍스트
                    c.put("examSelected", correct.getExamSelected());
                    // 혹시 프론트에서 examKo fallback 쓰면 대비
                    c.put("examKo", correct.getExamKo());
                    c.put("isCorrect", true);
                    options.add(c);

                    // 오답 2개. 기존 mapper 시그니처 유지(언어 미반영이면 examKo만 옴)
                    List<ExamDto> wrongs = testMapper.findRandomExamsExcluding(item.getExamNo(), 2);
                    for (ExamDto w : wrongs) {
                        Map<String, Object> wmap = new HashMap<>();
                        wmap.put("examNo", w.getExamNo());
                        // 언어 반영값이 없을 수 있으니 둘 다 채움
                        wmap.put("examSelected", w.getExamSelected()); // null일 수 있음
                        wmap.put("examKo", w.getExamKo());
                        wmap.put("isCorrect", false);
                        options.add(wmap);
                    }

                    Collections.shuffle(options);
                    m.put("options", options);
                }
            }

            out.add(m);
        }

        return out;
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

        // ===== 유형 판별 (prefix 제거 방식 대신 미디어 존재기반) =====
        final boolean hasImage = item.getImagePath() != null && !item.getImagePath().isBlank();
        final boolean hasAudio = item.getAudios() != null && !item.getAudios().isEmpty();

        final boolean isMC = hasImage || hasAudio;
        final boolean isSub = !isMC;

        // 2) 정답 예문 로드
        ExamDto exam = testMapper.findExamByNo(item.getExamNo(), langNo);
        if (exam == null) throw new IllegalArgumentException("예문을 찾을 수 없습니다.");

        int score;
        int isCorrect;

        if (isMC) {
            isCorrect = (selectedExamNo != null && selectedExamNo.equals(item.getExamNo())) ? 1 : 0;
            score = (isCorrect == 1) ? 100 : 0;
        } else {
            try {
                score = gemini.score(
                        q,
                        nullToEmpty(exam.getExamSelected()),
                        nullToEmpty(userAnswer),
                        convertToLangHint(langNo)
                ).score();
            } catch (Exception ex) {
                ex.printStackTrace();
                score = 0;
            }
            isCorrect = (score >= PASS_THRESHOLD) ? 1 : 0;
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