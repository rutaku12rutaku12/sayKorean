package web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.ExamDto;
import web.model.dto.GenreDto;
import web.model.dto.LanguageDto;
import web.model.dto.StudyDto;
import web.model.mapper.StudyMapper;

import java.util.List;

/*
 * StudyService
 * ------------------------------------------------------------
 * 학습(Study) 관련 비즈니스 로직을 담당하는 서비스 레이어.
 * - Controller ↔ Service ↔ Mapper 흐름에서 "중간 계층" 역할
 * - 트랜잭션 경계(@Transactional) 관리
 *
 * 주요 기능
 *  [1] 장르 목록 조회
 *  [2] 특정 장르의 주제(Study) 목록 조회 (언어 반영)
 *  [3] 언어(Language) 목록 조회
 *  [4] 특정 주제 상세(주제명 + 해설) 조회 (언어 반영)
 *  [5] 예문(Exam) 처음/다음/이전 조회 (언어 반영)
 *
 * 트랜잭션 정책
 *  - 클래스 레벨 @Transactional: 기본적으로 모든 메서드가 트랜잭션 경계 안에서 실행
 *  - 현재 메서드들은 모두 "조회" 성격 → readOnly 옵션을 고려할 수 있음
 *    (예: @Transactional(readOnly = true) at class or method)
 */
@Service
@Transactional
@RequiredArgsConstructor
public class StudyService { // class start

    // Mapper 의존성 주입 (생성자 주입)
    private final StudyMapper studyMapper;

    /*
     * [1] 장르 목록
     * - 사용자가 학습 진입 시 선택할 수 있는 장르(카테고리) 전체 목록 반환
     * - 단순 위임: Mapper → DB
     * @return List<GenreDto>
     */
    public List<GenreDto> getGenre(){
        List<GenreDto> result = studyMapper.getGenre();
        return result;
    }

    /*
     * [2] 특정 장르의 주제(Study) 목록
     * - genreNo에 속한 주제를 langNo에 맞춰(다국어 CASE) 조회
     * - 프론트의 언어 설정(localStorage 등)을 그대로 전달받아 반영
     * @param genreNo 장르 번호(양수)
     * @param langNo  언어 번호(기본 1=한국어)
     * @return List<StudyDto>
     */
    public List<StudyDto> getSubject( int genreNo , int langNo ){
        List< StudyDto > result = studyMapper.getSubject( genreNo , langNo );
        return result;
    }

    /*
     * [3] 언어 목록
     * - 시스템에서 지원하는 학습 언어 리스트 반환
     * @return List<LanguageDto>
     */
    public List<LanguageDto> getLang(){
        List<LanguageDto> result = studyMapper.getLang();
        return result;
    }

    /*
     * [4] 주제와 주제 해설 조회
     * - 특정 studyNo의 주제명(themeSelected)과 해설(commenSelected)을 langNo에 맞춰 반환
     * - 존재하지 않으면 null (Controller에서 404 처리 가능)
     * @param studyNo 주제 번호(양수)
     * @param langNo  언어 번호
     * @return StudyDto or null
     */
    public StudyDto getDailyStudy( int studyNo , int langNo ){
        StudyDto result = studyMapper.getDailyStudy( studyNo , langNo );
        return result;

    }

    /*
     * [5-1] 주제에 맞는 첫 예문 조회
     * - studyNo의 가장 앞(examNo ASC) 예문 1건 반환
     * - 오디오 경로(ko/en)·이미지 경로 포함 (Mapper의 서브쿼리/조인 로직에 따름)
     * @param studyNo 주제 번호
     * @param langNo  언어 번호
     * @return ExamDto
     */
    public ExamDto getFirstExam( int studyNo , int langNo ){
        ExamDto result = studyMapper.getFirstExam( studyNo , langNo );
        return result;
    }

    /*
     * [5-2] 다음 예문 조회
     * - 현재 예문 번호(currentExamNo)보다 큰 examNo 중 가장 작은 1건 반환
     * @param studyNo        주제 번호
     * @param currentExamNo  현재 예문 번호
     * @param langNo         언어 번호
     * @return ExamDto or null (마지막이면 null 가능)
     */
    public ExamDto getNextExam( int studyNo , int currentExamNo , int langNo ){
        ExamDto result = studyMapper.getNextExam( studyNo , currentExamNo , langNo );
        return result;
    }

    /*
     * [5-3] 이전 예문 조회
     * - 현재 예문 번호(currentExamNo)보다 작은 examNo 중 가장 큰 1건 반환
     * @param studyNo        주제 번호
     * @param currentExamNo  현재 예문 번호
     * @param langNo         언어 번호
     * @return ExamDto or null (첫 번째이면 null 가능)
     */
    public ExamDto getPrevExam( int studyNo , int currentExamNo , int langNo ){
        ExamDto result = studyMapper.getPrevExam( studyNo , currentExamNo , langNo );
        return result;
    }

} // class end










