package web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import web.model.dto.ExamDto;
import web.model.dto.GenreDto;
import web.model.dto.StudyDto;
import web.model.mapper.AdminStudyMapper;

import java.io.IOException;
import java.util.List;

@Service
@Transactional // 관리자 검증 비즈니스 로직을 통과해야 DB <-> 클라이언트 처리를 함
@RequiredArgsConstructor
public class AdminStudyService {
    // DI
    private final AdminStudyMapper adminStudyMapper;
    private final FileService fileService;

    // [AGR-01] 장르 생성 createGenre()
    // 장르 테이블 레코드를 추가한다
    // 매개변수 GenreDto
    // 반환 int (PK)
    public int createGenre(GenreDto genreDto){
        adminStudyMapper.createGenre(genreDto);
        return genreDto.getGenreNo(); // PK 반환
    }

    // [AGR-02] 장르 전체조회 getGenre()
    // 장르 테이블 레코드를 모두 조회한다
    // 반환 List
    public List<GenreDto> getGenre(){
        return adminStudyMapper.getGenre();
    }

    // [AGR-03] 장르 삭제 deleteGenre()
    // 장르 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int
    public int deleteGenre(int genreNo){
        return adminStudyMapper.deleteGenre(genreNo);
    }

    // [AST-01] 교육 생성 createStudy()
    // 교육 테이블 레코드를 추가한다
    // 매개변수 StudyDto
    // 반환 int(PK)
    public int createStudy(StudyDto studyDto){
        adminStudyMapper.createStudy(studyDto);
        return studyDto.getStudyNo(); // PK 반환
    }

    // [AST-02] 교육 수정 updateStudy()
    // 교육 테이블 레코드를 변경한다.
    // 매개변수 StudyDto
    // 반환 int
    public int updateStudy(StudyDto studyDto){
        return adminStudyMapper.updateStudy(studyDto);
    }

    // [AST-03] 교육 삭제 deleteStudy()
    // 교육 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int
    public int deleteStudy(int studyNo){
        return adminStudyMapper.deleteStudy(studyNo);
    }

    // [AST-04] 교육 전체조회 getStudy()
    // 교육 테이블 레코드를 모두 조회한다
    // 반환 List
    public List<StudyDto> getStudy(){
        return adminStudyMapper.getStudy();
    }

    // [AST-05] 교육 개별조회 getIndiStudy()
    // 교육 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 Dto
    public StudyDto getIndiStudy(int studyNo){
        return adminStudyMapper.getIndiStudy(studyNo);
    }

    // [AEX-01] 예문 생성 createExam()
    // 예문 테이블 레코드를 추가한다
    // 매개변수 ExamDto
    // 반환 int(PK)
    // 그림 파일 추가를 위한 파일 서비스 넣기
    public int createExam(ExamDto examDto , MultipartFile imageFile) throws IOException {

        // 1. 그림 파일이 있으면 저장
        if(imageFile != null && !imageFile.isEmpty()) {
            String imagePath = fileService.uploadImage(imageFile , examDto.getExamNo());
            examDto.setImagePath(imagePath);
            examDto.setImageName(imageFile.getOriginalFilename());
        }

        // 2. DB에 예문 저장
        adminStudyMapper.createExam(examDto);
        return examDto.getExamNo(); // PK 반환
    }

    // [AEX-02] 예문 수정 updateExam()
    // 예문 테이블 레코드를 변경한다.
    // 매개변수 StudyDto
    // 반환 int
    // 그림 파일 변경을 위한 파일 서비스 넣기
    public int updateExam(ExamDto examDto , MultipartFile newImageFile) throws IOException{
       
        // 1. 기존 이미지가 있을 때, 새로운 파일이 들어오면 교체
        if (newImageFile != null && !newImageFile.isEmpty()) {
            fileService.deleteFile(examDto.getImagePath());
            String newPath = fileService.uploadImage(newImageFile, examDto.getExamNo());
            examDto.setImageName(newPath);
            examDto.setImageName(newImageFile.getOriginalFilename());
        }
        
        // 2. DB 업데이트
        return adminStudyMapper.updateExam(examDto);
    }

    // [AEX-03] 예문 삭제 deleteExam()
    // 예문 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int
    public int deleteExam(int examNo){
        // 1. DB에 파일 있는지 확인
        ExamDto exam = adminStudyMapper.getIndiExam(examNo);
        if (exam.getImagePath() != null) {
            fileService.deleteFile(exam.getImagePath());
        }
        // 2. DB 삭제
        return adminStudyMapper.deleteExam(examNo);
    }

    // [AEX-04] 예문 전체조회 getExam()
    // 예문 테이블 레코드를 모두 조회한다
    // 반환 List
    public List<ExamDto> getExam(){
        return adminStudyMapper.getExam();
    }

    // [AEX-05] 예문 개별조회 getIndiExam()
    // 예문 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 Dto
    public ExamDto getIndiExam(int examNo){
        return adminStudyMapper.getIndiExam(examNo);
    }

}
