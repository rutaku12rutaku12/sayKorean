package web.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.ExamDto;
import web.model.dto.RankingDto;
import web.model.dto.TestDto;
import web.model.dto.TestItemDto;
import web.model.mapper.TestMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestService { // class start

    private final TestMapper testMapper;
    // Gemini 기반 자동 채점 서비스
    private final GeminiScoringService gemini; // 너가 만든 채점 서비스(google-genai 사용)
    // 통과 기준 점수
    private static final int PASS_THRESHOLD = 60;

    // [1] 시험 목록 조회
    public List<TestDto> getListTest() {
        return testMapper.getListTest();
    }

    // [2] 특정 시험의 문항 목록 조회
    public List<TestItemDto> findTestItem(int testNo) {
        return testMapper.findTestItem(testNo);
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

    // 서술형 제출 → Gemini 점수(0~100) → 60↑=정답(1) → ranking INSERT(누적)
    // submitFreeAnswer()는 서술형 제출 전체 흐름을 처리하며, 트랜잭션으로 랭킹 저장까지 보장

    // [6] 서술형 답변 제출 처리 로직
    //  - 문항 및 정답 로드
    //  - Gemini API 채점 (0~100점)
    //  - 기준 이상이면 정답 처리
    //  - 랭킹 테이블에 결과 저장
    @Transactional
    public int submitFreeAnswer(
            int userNo,
            int testNo,
            int testItemNo,
            int testRound,
            Integer selectedExamNo, // 객관식겸용: 서술형이면 null 가능
            String userAnswer,
            String langHint
    ) {
        // 1) testNo에 해당하는 문항 중 testItemNo 일치하는 문항 탐색
        TestItemDto item = testMapper.findTestItem(testNo).stream()
                .filter(t -> t.getTestItemNo() == testItemNo)
                .findFirst()
                // 문항이 존재하지 않으면 예외 발생
                .orElseThrow(() -> new IllegalArgumentException("잘못된 testItemNo 입니다."));

        // 해당 문항의 예문(정답 데이터) 조회
        ExamDto exam = testMapper.findExamByNo(item.getExamNo());
        if (exam == null) throw new IllegalArgumentException("예문(exam)을 찾을 수 없습니다.");

        // Gemini에게 보낼 문제와 기준정답 준비
        String question = item.getQuestion();
        String groundTruth = pickGroundTruthByLang(exam, langHint);

        // 2) Gemini API 호출로 점수 채점 (0~100)
        int score;
        try {
            score = gemini.score(question, groundTruth, userAnswer, langHint).score();
        } catch (Exception ex) {
            score = 0; //  Gemini 호출 실패 시 0점 처리
        }

        // 3) 정답 여부 : 기준점수 이상이면 정답 처리
        int isCorrect = (score >= PASS_THRESHOLD) ? 1 : 0;

        // 4) 랭킹 기록용 DTO 생성
        RankingDto rec = new RankingDto();
        rec.setTestRound(testRound);
        rec.setSelectedExamNo(selectedExamNo);
        rec.setUserAnswer(userAnswer);
        rec.setIsCorrect(isCorrect);
        rec.setTestItemNo(testItemNo);
        rec.setUserNo(userNo);

        // 5) DB에 INSERT (응답 누적 저장)
        testMapper.upsertRanking(rec);
        // 6) 점수 반환 (Controller로 전달)
        return score;
    }


    // 언어 힌트에 맞는 정답 선택( 되는지 확인 필요 )
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

    // null 방지 헬퍼
    private String safe(String s) { return (s == null) ? "" : s; }

} // class end
