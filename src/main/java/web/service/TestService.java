package web.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.*;
import web.model.mapper.TestMapper;

import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class TestService {

    private final TestMapper testMapper;
    private final GeminiScoringService geminiScoringService;

    // 1) 시험 목록 조회 (언어 설정 반영)
    public List<TestDto> getListTest(int langNo) {
        log.info("시험 목록 조회 - langNo: {}", langNo);
        return testMapper.getListTest(langNo);
    }

    // 2) 특정 시험의 문항 목록 조회 (언어 설정 반영)
    public List<TestItemWithMediaDto> findTestItemsWithMedia(int testNo, int langNo) {
        log.info("시험 문항 조회 - testNo: {}, langNo: {}", testNo, langNo);
        return testMapper.findTestItemsWithMedia(testNo, langNo);
    }

    // 3) 정답 예문 조회 (언어 설정 반영)
    public ExamDto findExamByNo(int examNo, int langNo) {
        log.info("정답 예문 조회 - examNo: {}, langNo: {}", examNo, langNo);
        return testMapper.findExamByNo(examNo, langNo);
    }

    // 4) 랜덤 오답 예문 조회 (언어 설정 반영)
    public List<ExamDto> findRandomExamsExcluding(int excludedExamNo, int limit, int langNo) {
        log.info("랜덤 오답 예문 조회 - excludedExamNo: {}, limit: {}, langNo: {}",
                excludedExamNo, limit, langNo);
        return testMapper.findRandomExamsExcluding(excludedExamNo, limit, langNo);
    }

    // 5) 답안 제출 및 채점 (Gemini API 활용)
    public ScoringResultDto submitAndScore(ScoringRequestDto request) {
        try {
            // 5-1) 정답 예문 조회 (사용자의 언어 설정에 맞춰)
            ExamDto correctAnswer = testMapper.findExamByNo(request.getExamNo(), request.getLangNo());

            // 5-2) 문항 정보 조회 (질문 텍스트 필요)
            TestItemWithMediaDto testItem = findTestItemByNo(request.getTestItemNo(), request.getLangNo());

            // 5-3) 언어 힌트 생성
            String langHint = getLangHint(request.getLangNo());

            // 5-4) Gemini로 채점
            GeminiScoringService.ScoreResult scoreResult = geminiScoringService.score(
                    testItem.getQuestionSelected() != null ? testItem.getQuestionSelected() : testItem.getQuestion(),
                    correctAnswer.getExamSelected() != null ? correctAnswer.getExamSelected() : correctAnswer.getExamKo(),
                    request.getUserAnswer(),
                    langHint
            );

            // 5-5) 채점 결과를 기반으로 정답 여부 결정 (70점 이상이면 정답)
            boolean isCorrect = scoreResult.score() >= 70;

            // 5-6) 랭킹 테이블에 저장
            RankingDto rankingDto = new RankingDto();
            rankingDto.setTestRound(request.getTestRound());
            rankingDto.setSelectedExamNo(request.getSelectedExamNo());
            rankingDto.setUserAnswer(request.getUserAnswer());
            rankingDto.setIsCorrect(isCorrect ? 1 : 0);
            rankingDto.setTestItemNo(request.getTestItemNo());
            rankingDto.setUserNo(request.getUserNo());

            testMapper.upsertRanking(rankingDto);

            // 5-7) 결과 반환
            ScoringResultDto result = new ScoringResultDto();
            result.setScore(scoreResult.score());
            result.setIsCorrect(isCorrect);
            result.setRawFeedback(scoreResult.rawText());
            result.setCorrectAnswer(correctAnswer.getExamSelected() != null ?
                    correctAnswer.getExamSelected() : correctAnswer.getExamKo());

            log.info("채점 완료 - userNo: {}, testItemNo: {}, score: {}, isCorrect: {}",
                    request.getUserNo(), request.getTestItemNo(), scoreResult.score(), isCorrect);

            return result;

        } catch (Exception e) {
            log.error("채점 중 오류 발생", e);
            throw new RuntimeException("채점 처리 중 오류가 발생했습니다.", e);
        }
    }

    // 6) 간단한 답안 제출 (Gemini 없이 객관식만)
    public int upsertRanking(RankingDto rankingDto) {
        log.info("답안 제출 - userNo: {}, testItemNo: {}",
                rankingDto.getUserNo(), rankingDto.getTestItemNo());
        return testMapper.upsertRanking(rankingDto);
    }

    // 7) 점수 조회
    public RankingDto getScore(int userNo, int testNo, int testRound) {
        log.info("점수 조회 - userNo: {}, testNo: {}, testRound: {}",
                userNo, testNo, testRound);
        return testMapper.getScore(userNo, testNo, testRound);
    }

    // [Helper] 특정 문항 조회
    private TestItemWithMediaDto findTestItemByNo(int testItemNo, int langNo) {
        // TestMapper의 개별 조회 메서드 사용
        TestItemDto testItem = testMapper.findTestItemByNo(testItemNo, langNo);

        if (testItem == null) {
            throw new RuntimeException("문항을 찾을 수 없습니다: " + testItemNo);
        }

        // TestItemDto를 TestItemWithMediaDto로 변환 (필요한 필드만)
        TestItemWithMediaDto result = new TestItemWithMediaDto();
        result.setTestItemNo(testItem.getTestItemNo());
        result.setQuestion(testItem.getQuestion());
        result.setQuestionSelected(testItem.getQuestionSelected());
        result.setTestNo(testItem.getTestNo());
        result.setExamNo(testItem.getExamNo());

        return result;
    }

    // [Helper] 언어 번호를 언어 힌트 문자열로 변환
    private String getLangHint(int langNo) {
        return switch (langNo) {
            case 0, 1 -> "Korean";
            case 2 -> "Japanese";
            case 3 -> "Chinese";
            case 4 -> "English";
            case 5 -> "Spanish";
            default -> "Korean";
        };
    }
}