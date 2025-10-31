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

/*
 * 시험 관련 비즈니스 로직을 담당하는 서비스 레이어
 *
 * 주요 기능
 *  - 시험 목록 조회
 *  - 문항(이미지/오디오/주관식) + 객관식 보기 생성(정답/오답 섞기)
 *  - 제출 처리(객관식은 정오 판정, 주관식은 Gemini 자동 채점)
 *  - 랭킹(응답 기록) 저장 및 점수 집계/최신 회차 조회
 *
 * 설계 포인트
 *  - 문항 유형은 "문항 순서(itemIndex % 3)"로 결정: 0=그림 객관식, 1=음성 객관식, 2=주관식
 *  - 객관식 보기(options)는 정답 1 + 랜덤 오답 2(언어 반영)로 구성 후 셔플
 *  - 주관식 채점 시 GeminiScoringService(score API)를 호출하여 0~100 점수만 반환받음
 *  - 랭킹 저장은 upsert(중복 시 갱신) 형태의 매퍼 호출 가정
 */
@Service
@RequiredArgsConstructor
public class TestService {

    // [의존성] DB 접근 매퍼 + 자동 채점기(Gemini)
    private final TestMapper testMapper;
    private final GeminiScoringService gemini;

    // [상수] 주관식 정답 기준 점수(이상일 때 정답 처리)
    private static final int PASS_THRESHOLD = 60;

    /*
     * [1] 시험 목록
     * @param langNo 언어 번호(화면 표기/문항 텍스트 언어 선택 등에 사용)
     * @return 언어 반영된 시험 목록
     *
     * 주의: mapper 구현에서 langNo를 적절히 활용해야 올바른 목록이 내려감
     */
    public List<TestDto> getListTest(int langNo) {
        return testMapper.getListTest(langNo);
    }

    /*
     * [2] 문항 목록 (이미지/오디오 + 난수 옵션까지 포함)
     *
     * 응답 구조 예시(문항 1개 당 Map):
     * {
     *   "testItemNo": 10,
     *   "testNo": 3,
     *   "questionSelected": "...(사용자 언어로 된 질문)...",
     *   "imageName": "...",
     *   "imagePath": "...",
     *   "audios": [...],                  // 오디오 정보(그대로 전달)
     *   "examSelected": "...",            // (주관식 대비) 언어별 예문
     *   "examKo": "...",                  // (fallback) 한국어 예문
     *   "options": [                      // 객관식일 때만 포함
     *     { "examNo": 1, "examSelected": "...", "examKo": "...", "isCorrect": true/false },
     *     ...
     *   ]
     * }
     *
     * 문항 타입 결정 규칙(핵심)
     *  - itemIndex % 3 == 0 → "그림 객관식"
     *  - itemIndex % 3 == 1 → "음성 객관식"
     *  - itemIndex % 3 == 2 → "주관식"
     *
     * @param testNo 대상 시험 번호
     * @param langNo 대상 언어 번호(표시/예문 조회에 반영)
     * @return 문항 + 보기(객관식만) 포함한 리스트
     */
    public List<Map<String, Object>> findTestItemWithOptions(int testNo, int langNo) {

        // 1) 기본 문항 목록 조회(언어 반영)
        //    - questionSelected, image/audio, examNo 등이 포함된 DTO 리스트
        List<TestItemWithMediaDto> items = testMapper.findTestItemsWithMedia(testNo, langNo);

        // 2) API 응답 형태로 변환할 컬렉션
        List<Map<String, Object>> out = new ArrayList<>();

        // for-each 대신 index 기반 loop를 쓰는 이유
        //  - itemIndex를 이용해 문항 유형(그림/음성/주관식)을 판별하기 위해
        for (int itemIndex = 0; itemIndex < items.size(); itemIndex++) {
            TestItemWithMediaDto item = items.get(itemIndex);

            // 단일 문항 응답용 Map
            Map<String, Object> m = new HashMap<>();
            m.put("testItemNo", item.getTestItemNo());
            m.put("testNo", item.getTestNo());
            m.put("questionSelected", item.getQuestionSelected());
            m.put("imageName", item.getImageName());
            m.put("imagePath", item.getImagePath());
            m.put("audios", item.getAudios()); // 오디오 정보는 구조 그대로 내려줌

            // ===== (핵심) 문항 순서 기반 타입 판별 =====
            // 1번째 문항(index 0) = 그림 + 객관식
            // 2번째 문항(index 1) = 음성 + 객관식
            // 3번째 문항(index 2) = 주관식
            // 이후 반복: 3n+1 = 그림, 3n+2 = 음성, 3n = 주관식
            int questionType = itemIndex % 3; // 0=그림, 1=음성, 2=주관식

            // 3) 정답 예문(Exam) 조회(언어 반영)
            //    - 객관식/주관식 모두 맞춤 텍스트 제공을 위해 필요
            ExamDto correct = testMapper.findExamByNo(item.getExamNo(), langNo);
            if (correct != null) {
                // (주관식 대비) 모델에게 넘길 groundTruth 및 프론트 fallback 제공
                m.put("examSelected", correct.getExamSelected()); // 사용자 언어별 예문
                m.put("examKo", correct.getExamKo());             // 한국어 fallback

                // 객관식(그림/음성)일 때만 options 생성
                if (questionType == 0 || questionType == 1) {
                    List<Map<String, Object>> options = new ArrayList<>();

                    // 3-1) 정답 옵션
                    Map<String, Object> c = new HashMap<>();
                    c.put("examNo", correct.getExamNo());
                    c.put("examSelected", correct.getExamSelected());
                    c.put("examKo", correct.getExamKo());
                    c.put("isCorrect", true);
                    options.add(c);

                    // 3-2) 오답 2개(언어 반영) 랜덤 조회
                    //      - 정답 examNo 제외
                    //      - mapper에서 LIMIT 2 & RAND() 등으로 구현 가정
                    List<ExamDto> wrongs = testMapper.findRandomExamsExcludingWithLang(
                            item.getExamNo(), // 제외할 정답 examNo
                            2,                // 오답 개수
                            langNo            // 언어 번호(문장 언어 맞춤)
                    );

                    // 3-3) 오답 옵션 구성
                    for (ExamDto w : wrongs) {
                        Map<String, Object> wmap = new HashMap<>();
                        wmap.put("examNo", w.getExamNo());
                        wmap.put("examSelected", w.getExamSelected());
                        wmap.put("examKo", w.getExamKo());
                        wmap.put("isCorrect", false);
                        options.add(wmap);
                    }

                    // 3-4) 보기 순서 섞기(정답 위치 랜덤화)
                    Collections.shuffle(options);

                    // 3-5) 응답에 options 추가
                    m.put("options", options);
                }
                // questionType == 2 (주관식) → options 없이 내려감
            }

            // 4) 최종 리스트에 문항 추가
            out.add(m);
        }

        // 5) 전체 문항 결과 반환
        return out;
    }

    /*
     * [3] 정답 예문 단건 조회(언어 반영)
     * - 주관식 채점 시 groundTruth로 사용
     */
    public ExamDto findExamByNo(int examNo, int langNo) {
        return testMapper.findExamByNo(examNo, langNo);
    }

    /*
     * [4] 랭킹 저장(upsert)
     * - 사용자의 각 문항 응답 기록을 저장(있으면 갱신)
     * - DB 제약(유니크키: userNo+testItemNo+testRound 등) 전제
     */
    public int upsertRanking(RankingDto dto) {
        return testMapper.upsertRanking(dto);
    }

    /*
     * [5-1] 점수 집계 (특정 회차)
     * - 회차별 총점/정답수 등을 집계하여 반환
     * - mapper에서 SUM/COUNT 등을 통해 구현 가정
     */
    public RankingDto getScore(int userNo, int testNo, int testRound) {
        return testMapper.getScore(userNo, testNo, testRound);
    }

    /*
     * [5-2] 최신 회차 점수 집계
     * - 사용자의 최신 응시 회차를 조회하여 그 회차의 집계 결과 반환
     */
    public RankingDto getLatestScore(int userNo, int testNo) {
        return testMapper.getLatestScore(userNo, testNo);
    }

    /*
     * [5-3] 다음 회차 번호 계산
     * - 현재까지의 응답 기록을 바탕으로 다음 응시 round 번호 산출
     */
    public int getNextRound(int userNo, int testNo) {
        return testMapper.getNextRound(userNo, testNo);
    }

    /*
     * [6] 제출 처리 (미디어 기반이 아닌 "문항 순서" 기반 타입 판별)
     *
     * 처리 플로우
     *  1) (성능 고려 여지) 모든 문항 조회 후 testItemNo에 해당하는 문항/인덱스 탐색
     *  2) itemIndex % 3 로 유형 판별 (0/1=객관식, 2=주관식)
     *  3) 정답 예문 조회(언어 반영)
     *  4) 객관식 → selectedExamNo와 정답 비교하여 0/100 점수
     *     주관식 → Gemini 채점(예외 시 0점), PASS_THRESHOLD 이상이면 정답 처리
     *  5) 랭킹(upsert) 저장
     *
     * 트랜잭션 주석
     *  - 랭킹 저장을 포함하므로 @Transactional로 트랜잭션 경계를 묶어 일관성 보장
     *  - 필요 시 격리수준/전파옵션 추가 고려 가능
     */
    @Transactional
    public int submitFreeAnswer(
            int userNo,           // 사용자 번호
            int testNo,           // 시험 번호
            int testItemNo,       // 제출한 문항 번호
            int testRound,        // 응시 회차
            Integer selectedExamNo, // 객관식에서 사용자가 선택한 보기의 examNo(주관식인 경우 null)
            String userAnswer,    // 주관식 사용자의 자유 입력(객관식이면 보통 null/빈 문자열)
            int langNo            // 언어 번호(표기/채점 groundTruth 선택)
    ) {
        // 1) 문항 로드 (언어 반영)
        //    - 모든 문항을 가져온 뒤 특정 testItemNo를 가진 문항을 탐색
        //    - (성능 최적화 여지) mapper에 단건 조회 API를 추가해도 좋음
        List<TestItemWithMediaDto> allItems = testMapper.findTestItemsWithMedia(testNo, langNo);

        // testItemNo에 해당하는 문항과 그 인덱스 찾기
        int itemIndex = -1;
        TestItemWithMediaDto item = null;
        for (int i = 0; i < allItems.size(); i++) {
            if (allItems.get(i).getTestItemNo() == testItemNo) {
                item = allItems.get(i);
                itemIndex = i;
                break;
            }
        }
        // 문항이 없으면 즉시 예외 처리(클라이언트/데이터 불일치 방지)
        if (item == null) {
            throw new IllegalArgumentException("잘못된 testItemNo 입니다.");
        }

        // 사용 언어로 선택된 질문 텍스트 확보(null 방어 + trim)
        final String q = nullToEmpty(item.getQuestionSelected()).trim();
        System.out.printf("[DEBUG] testItemNo=%d, question='%s'%n", testItemNo, q);

        // ===== 유형 판별 (문항 순서 기반) =====
        // 0=그림 객관식, 1=음성 객관식, 2=주관식
        int questionType = itemIndex % 3;
        final boolean isMC  = (questionType == 0 || questionType == 1); // 객관식 여부
        final boolean isSub = (questionType == 2);                       // 주관식 여부

        System.out.printf("[DEBUG] questionType=%d, isMC=%b, isSub=%b%n",
                questionType, isMC, isSub);

        // 2) 정답 예문 로드(언어 반영)
        //    - 객관식: 정답 비교용 examNo
        //    - 주관식: groundTruth(예: examSelected)로 채점
        ExamDto exam = testMapper.findExamByNo(item.getExamNo(), langNo);
        if (exam == null) throw new IllegalArgumentException("예문을 찾을 수 없습니다.");

        int score;     // 채점 점수(0~100)
        int isCorrect; // 정오(1=정답, 0=오답)

        if (isMC) {
            // [객관식]
            // - 선택한 보기의 examNo와 실제 정답 examNo가 일치하면 정답
            isCorrect = (selectedExamNo != null && selectedExamNo.equals(item.getExamNo())) ? 1 : 0;
            score = (isCorrect == 1) ? 100 : 0; // 객관식은 전부 정답/오답 100/0 점수
        } else {
            // [주관식] Gemini 자동 채점
            try {
                score = gemini.score(
                        q,                                   // 질문
                        nullToEmpty(exam.getExamSelected()), // 기준 정답(사용자 언어)
                        nullToEmpty(userAnswer),             // 사용자 입력
                        convertToLangHint(langNo)            // 모델에 넘길 언어 힌트
                ).score();
            } catch (Exception ex) {
                // 모델 호출/네트워크/파싱 오류 등은 0점 처리(보수적)
                ex.printStackTrace();
                score = 0;
            }
            // 임계값 이상이면 정답 처리
            isCorrect = (score >= PASS_THRESHOLD) ? 1 : 0;
        }

        // 4) 랭킹 저장(upsert)
        // - 사용자의 응답 결과를 기록(정오/점수는 집계에 활용될 수 있음)
        RankingDto rec = new RankingDto();
        rec.setTestRound(testRound);
        rec.setSelectedExamNo(selectedExamNo);
        rec.setUserAnswer(userAnswer);
        rec.setIsCorrect(isCorrect);
        rec.setTestItemNo(testItemNo);
        rec.setUserNo(userNo);
        testMapper.upsertRanking(rec);

        // 서버 로그로 결과를 남겨 추적성 확보
        System.out.printf("[RESULT] userNo=%d, testItemNo=%d, score=%d, isCorrect=%d%n",
                userNo, testItemNo, score, isCorrect);

        // 프론트/호출자에게 점수만 반환
        return score;
    }

    // ===== 헬퍼 메서드 =====

    /*
     * null-safe 변환 유틸
     * - 문자열이 null이면 빈 문자열로 치환
     * - JSON 직렬화/문자열 처리 과정의 NPE 방지
     */
    private String nullToEmpty(String s) {
        return s == null ? "" : s;
    }

    /*
     * 언어 번호 → Gemini 힌트 문자열 매핑
     * - 모델 프롬프트에 간단한 힌트를 제공하여 언어 맥락 강화
     * - 필요 시 "ko-KR" 등으로 구체화 가능
     */
    private String convertToLangHint(int langNo) {
        switch (langNo) {
            case 2:
                return "jp";  // 일본어
            case 3:
                return "cn";  // 중국어(간체/번체 구분 필요 시 확장)
            case 4:
                return "en";  // 영어
            case 5:
                return "es";  // 스페인어
            default:
                return "ko";  // 한국어(기본)
        }
    }
}
