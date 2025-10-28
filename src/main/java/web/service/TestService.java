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

//        for (TestItemWithMediaDto item : items) {
        for (int itemIndex = 0; itemIndex < items.size(); itemIndex++) {
            TestItemWithMediaDto item = items.get(itemIndex);
            Map<String, Object> m = new HashMap<>();
            m.put("testItemNo", item.getTestItemNo());
            m.put("testNo", item.getTestNo());
            m.put("questionSelected", item.getQuestionSelected());
            m.put("imageName", item.getImageName());
            m.put("imagePath", item.getImagePath());
            m.put("audios", item.getAudios()); // 그대로 내려줌

            // 2) 객관식 여부 판단: 이미지 또는 오디오가 있으면 객관식
//            boolean isMultiple =
//                    (item.getImagePath() != null && !item.getImagePath().isBlank())
//                            || (item.getAudios() != null && !item.getAudios().isEmpty());
//
//            if (isMultiple) {

            // ===== 🎯 핵심 수정: 문항 순서로 타입 판단 =====
            // 1번째 문항(index 0) = 그림 + 객관식
            // 2번째 문항(index 1) = 음성 + 객관식
            // 3번째 문항(index 2) = 주관식
            // 이후 반복: 3n+1 = 그림, 3n+2 = 음성, 3n = 주관식
            int questionType = itemIndex % 3; // 0=그림, 1=음성, 2=주관식

            if (questionType == 0 || questionType == 1) {
                // ===== 🎯 핵심 수정: 언어별 예문 조회 =====
                // 정답 예문을 언어에 맞게 조회
                ExamDto correct = testMapper.findExamByNo(item.getExamNo(), langNo);
                if (correct != null) {
                    List<Map<String, Object>> options = new ArrayList<>();

                    // 정답 옵션
                    Map<String, Object> c = new HashMap<>();
                    c.put("examNo", correct.getExamNo());
                    c.put("examSelected", correct.getExamSelected()); // 언어별 예문
                    c.put("examKo", correct.getExamKo()); // 한국어 원본 (fallback)
                    c.put("isCorrect", true);
                    options.add(c);

                    // ===== 🎯 오답도 언어별로 조회 =====
                    // 오답 2개를 언어에 맞게 조회
                    List<ExamDto> wrongs = testMapper.findRandomExamsExcludingWithLang(
                            item.getExamNo(),
                            2,
                            langNo  // 언어 번호 전달
                    );

                    for (ExamDto w : wrongs) {
                        Map<String, Object> wmap = new HashMap<>();
                        wmap.put("examNo", w.getExamNo());
                        wmap.put("examSelected", w.getExamSelected()); // 언어별 예문
                        wmap.put("examKo", w.getExamKo()); // fallback
                        wmap.put("isCorrect", false);
                        options.add(wmap);
                    }

                    // 보기 섞기
                    Collections.shuffle(options);
                    m.put("options", options);
                }
            }
            // questionType == 2인 경우 (주관식)는 options를 추가하지 않음
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

    // [6] 제출 처리 (미디어 기반 타입 판별)
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
//        TestItemWithMediaDto item = testMapper.findTestItemsWithMedia(testNo, langNo).stream()
//                .filter(t -> t.getTestItemNo() == testItemNo)
//                .findFirst()
//                .orElseThrow(() -> new IllegalArgumentException("잘못된 testItemNo 입니다."));

        List<TestItemWithMediaDto> allItems = testMapper.findTestItemsWithMedia(testNo, langNo);

        // 해당 문항 찾기 및 순서 확인
        int itemIndex = -1;
        TestItemWithMediaDto item = null;
        for (int i = 0; i < allItems.size(); i++) {
            if (allItems.get(i).getTestItemNo() == testItemNo) {
                item = allItems.get(i);
                itemIndex = i;
                break;
            }
        }

        if (item == null) {
            throw new IllegalArgumentException("잘못된 testItemNo 입니다.");
        }


        final String q = nullToEmpty(item.getQuestionSelected()).trim();
        System.out.printf("[DEBUG] testItemNo=%d, question='%s'%n", testItemNo, q);

//        // ===== 유형 판별 (미디어 존재 기반) =====
//        final boolean hasImage = item.getImagePath() != null && !item.getImagePath().isBlank();
//        final boolean hasAudio = item.getAudios() != null && !item.getAudios().isEmpty();
//
//        final boolean isMC = hasImage || hasAudio;
//        final boolean isSub = !isMC;

        // ===== 유형 판별 (문항 순서 기반) =====
        int questionType = itemIndex % 3; // 0=그림, 1=음성, 2=주관식
        final boolean isMC = (questionType == 0 || questionType == 1);
        final boolean isSub = (questionType == 2);

        System.out.printf("[DEBUG] questionType=%d, isMC=%b, isSub=%b%n",
                questionType, isMC, isSub);

        // 2) 정답 예문 로드
        ExamDto exam = testMapper.findExamByNo(item.getExamNo(), langNo);
        if (exam == null) throw new IllegalArgumentException("예문을 찾을 수 없습니다.");

        int score;
        int isCorrect;

        if (isMC) {
            // 객관식: 선택한 examNo가 정답인지 확인
            isCorrect = (selectedExamNo != null && selectedExamNo.equals(item.getExamNo())) ? 1 : 0;
            score = (isCorrect == 1) ? 100 : 0;
        } else {
            // 주관식: Gemini 채점
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

    // 헬퍼 메서드
    private String nullToEmpty(String s) {
        return s == null ? "" : s;
    }

    // 🎯 언어 번호 -> Gemini 힌트 변환
    private String convertToLangHint(int langNo) {
        switch (langNo) {
            case 2:
                return "jp";  // 일본어
            case 3:
                return "cn";  // 중국어
            case 4:
                return "en";  // 영어
            case 5:
                return "es";  // 스페인어
            default:
                return "ko";  // 한국어
        }
    }
}