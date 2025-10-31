package web.controller;

import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.ExamDto;
import web.model.dto.GenreDto;
import web.model.dto.LanguageDto;
import web.model.dto.StudyDto;
import web.service.StudyService;

import java.util.List;



/*
 * StudyController
 * --------------------------------------------------------
 * 학습(Study) 관련 요청을 처리하는 REST 컨트롤러.
 * - URI Prefix : /saykorean/study
 * - Service : StudyService 주입 (비즈니스 로직 담당)
 *
 * 주요 기능
 *  [1] 장르 목록 조회
 *  [2] 주제(Study) 목록 조회 (장르 + 언어 선택 기반)
 *  [3] 언어 목록 조회
 *  [4] 특정 주제 상세(해설 포함)
 *  [5] 예문(Exam) 탐색 (처음 / 다음 / 이전)
 *
 * 공통 규칙
 *  - ResponseEntity로 일관된 응답 구조 유지
 *  - @Positive : ID 파라미터의 유효성 검증 (양수만 허용)
 *  - langNo : 사용자가 선택한 언어 번호 (기본값 1=한국어)
 */
@RestController
@RequestMapping("/saykorean/study")
@RequiredArgsConstructor
public class StudyController {

    // StudyService : DB 조회 및 비즈니스 로직 처리
    private final StudyService studyService;


    /*
     * [1] 장르 목록 조회
     * --------------------------------------------------------
     * 클라이언트에서 학습 진입 시,
     * 사용자가 선택할 수 있는 "장르(예: 여행, 음식, 문화 등)" 목록을 조회.
     *
     * GET /saykorean/study/getGenre
     *
     * @return GenreDto 리스트
     *  - genreNo : 장르 번호
     *  - genreName : 장르명
     */
    @GetMapping("/getGenre")
    public ResponseEntity<List<GenreDto>> getGenre() {
        return ResponseEntity.ok(studyService.getGenre());
    }


    /*
     * [2] 주제(Study) 목록 조회
     * --------------------------------------------------------
     * 특정 장르(genreNo)에 속한 주제 목록을 선택한 언어(langNo)에 맞춰 반환.
     * 예: "여행 장르" 선택 시 → "공항 회화", "길 묻기" 등
     *
     * GET /saykorean/study/getSubject?genreNo=1&langNo=4
     *
     * @param genreNo 장르 번호 (필수, 양수)
     * @param langNo  언어 번호 (선택, 기본 1=한국어)
     * @return StudyDto 리스트
     *  - studyNo, genreNo, studyTitleSelected(언어별 제목)
     */
    @GetMapping("/getSubject")
    public ResponseEntity<List<StudyDto>> getSubject(
            @RequestParam @Positive int genreNo,
            @RequestParam(defaultValue = "1") int langNo // localStorage의 언어번호 반영
    ) {
        return ResponseEntity.ok(studyService.getSubject(genreNo, langNo));
    }


    /*
     * [3] 언어 목록 조회
     * --------------------------------------------------------
     * 사용자가 학습 언어를 변경할 수 있도록
     * 지원되는 언어 목록을 조회함.
     *
     * GET /saykorean/study/getlang
     *
     * @return LanguageDto 리스트
     *  - langNo : 언어 번호
     *  - langName : 언어명 (예: 한국어, 영어, 일본어 등)
     */
    @GetMapping("/getlang")
    public ResponseEntity<List<LanguageDto>> getLang() {
        return ResponseEntity.ok(studyService.getLang());
    }


    /*
     * [4] 특정 주제 상세(주제 + 해설) 조회
     * --------------------------------------------------------
     * 주제 번호(studyNo)에 해당하는 학습 콘텐츠를 언어(langNo)에 맞게 가져옴.
     *  - 주제명, 해설(commentary), 이미지, 오디오 등 포함 가능
     *
     * GET /saykorean/study/getDailyStudy?studyNo=3&langNo=2
     *
     * @param studyNo 학습 주제 번호
     * @param langNo  언어 번호 (기본값 1)
     * @return StudyDto or 404 (데이터 없을 경우)
     */
    @GetMapping("/getDailyStudy")
    public ResponseEntity<?> getDailyStudy(
            @RequestParam @Positive int studyNo,
            @RequestParam(defaultValue = "1") int langNo
    ) {
        var dto = studyService.getDailyStudy(studyNo, langNo);
        // 없으면 404, 있으면 200 OK
        return (dto == null)
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(dto);
    }


    /*
     * [5-1] 첫 번째 예문 조회
     * --------------------------------------------------------
     * 특정 주제(studyNo)의 첫 번째 예문(Exam)을 가져옴.
     * (예: "길 묻기" 주제의 첫 예문)
     *
     * GET /saykorean/study/exam/first?studyNo=2&langNo=3
     *
     * @param studyNo 학습 주제 번호
     * @param langNo  언어 번호
     * @return ExamDto (examNo, examSelected, examKo 등)
     */
    @GetMapping("/exam/first")
    public ResponseEntity<ExamDto> getFirstExam(
            @RequestParam @Positive int studyNo,
            @RequestParam(defaultValue = "1") int langNo
    ) {
        return ResponseEntity.ok(studyService.getFirstExam(studyNo, langNo));
    }


    /*
     * [5-2] 다음 예문 조회
     * --------------------------------------------------------
     * 사용자가 학습 중 “다음” 버튼을 눌렀을 때 호출.
     * 현재 예문(currentExamNo) 기준으로 다음 예문 반환.
     *
     * GET /saykorean/study/exam/next?studyNo=2&currentExamNo=5&langNo=1
     *
     * @param studyNo        학습 주제 번호
     * @param currentExamNo  현재 예문 번호
     * @param langNo         언어 번호
     * @return 다음 ExamDto (없으면 null)
     */
    @GetMapping("/exam/next")
    public ResponseEntity<ExamDto> getNextExam(
            @RequestParam @Positive int studyNo,
            @RequestParam @Positive int currentExamNo,
            @RequestParam(defaultValue = "1") int langNo
    ) {
        return ResponseEntity.ok(studyService.getNextExam(studyNo, currentExamNo, langNo));
    }


    /*
     * [5-3] 이전 예문 조회
     * --------------------------------------------------------
     * 사용자가 학습 중 “이전” 버튼을 눌렀을 때 호출.
     * 현재 예문(currentExamNo) 기준으로 이전 예문 반환.
     *
     * GET /saykorean/study/exam/prev?studyNo=2&currentExamNo=5&langNo=1
     *
     * @param studyNo        학습 주제 번호
     * @param currentExamNo  현재 예문 번호
     * @param langNo         언어 번호
     * @return 이전 ExamDto (없으면 null)
     */
    @GetMapping("/exam/prev")
    public ResponseEntity<ExamDto> getPrevExam(
            @RequestParam @Positive int studyNo,
            @RequestParam @Positive int currentExamNo,
            @RequestParam(defaultValue = "1") int langNo
    ) {
        return ResponseEntity.ok(studyService.getPrevExam(studyNo, currentExamNo, langNo));
    }
}
