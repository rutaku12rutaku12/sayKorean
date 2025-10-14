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
    public int createGenre(GenreDto genreDto) {
        adminStudyMapper.createGenre(genreDto);
        return genreDto.getGenreNo(); // PK 반환
    }

    // [AGR-02] 장르 전체조회 getGenre()
    // 장르 테이블 레코드를 모두 조회한다
    // 반환 List
    public List<GenreDto> getGenre() {
        return adminStudyMapper.getGenre();
    }

    // [AGR-03] 장르 삭제 deleteGenre()
    // 장르 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int
    public int deleteGenre(int genreNo) {
        return adminStudyMapper.deleteGenre(genreNo);
    }

    // [AST-01] 교육 생성 createStudy()
    // 교육 테이블 레코드를 추가한다
    // 매개변수 StudyDto
    // 반환 int(PK)
    public int createStudy(StudyDto studyDto) {
        adminStudyMapper.createStudy(studyDto);
        return studyDto.getStudyNo(); // PK 반환
    }

    // [AST-02] 교육 수정 updateStudy()
    // 교육 테이블 레코드를 변경한다.
    // 매개변수 StudyDto
    // 반환 int
    public int updateStudy(StudyDto studyDto) {
        return adminStudyMapper.updateStudy(studyDto);
    }

    // [AST-03] 교육 삭제 deleteStudy()
    // 교육 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int
    public int deleteStudy(int studyNo) {
        return adminStudyMapper.deleteStudy(studyNo);
    }

    // [AST-04] 교육 전체조회 getStudy()
    // 교육 테이블 레코드를 모두 조회한다
    // 반환 List
    public List<StudyDto> getStudy() {
        return adminStudyMapper.getStudy();
    }

    // [AST-05] 교육 개별조회 getIndiStudy()
    // 교육 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 Dto
    public StudyDto getIndiStudy(int studyNo) {
        return adminStudyMapper.getIndiStudy(studyNo);
    }

    // [AEX-01] 예문 생성 createExam()
    // 예문 테이블 레코드를 추가한다
    // 매개변수 ExamDto
    // 반환 int(PK)
    // 그림 파일 추가를 위한 파일 서비스 넣기
    public int createExam(ExamDto examDto, MultipartFile imageFile) throws IOException {
        // 1. 텍스트 데이터를 먼저 DB에 저장
        examDto.setImageName(null);
        examDto.setImagePath(null);
        adminStudyMapper.createExam(examDto);

        // 2. 그림 파일이 있으면, 파일 저장 및 DB 업데이트
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = null;
            try {
                // 2-1. 실제 examNo를 활용한 파일 업로드
                imagePath = fileService.uploadImage(imageFile, examDto.getExamNo());
                // 2-2. DTO에 이미지 정보 설정
                examDto.setImagePath(imagePath);
                examDto.setImageName(imageFile.getOriginalFilename());
                // 2-3. DB에 이미지 정보 업데이트 (새로운 Mapper 메소드 사용)
                adminStudyMapper.updateExamImage(examDto);
            } catch (Exception e) { // 2-4. 예외 발생 시 예문 레코드와 파일 롤백 처리
                if (imagePath != null) {
                    fileService.deleteFile(imagePath);
                }
                adminStudyMapper.deleteExam(examDto.getExamNo());
                throw new IOException("이미지 처리 중 오류 발생하여 예문 생성 취소되었습니다", e);
            }
        }
        // 3. 생성된 예문의 PK 반환
        return examDto.getExamNo();
    }

    // [AEX-02] 예문 수정 updateExam()
    // 예문 테이블 레코드를 변경한다.
    // 매개변수 StudyDto
    // 반환 int
    // 그림 파일 변경을 위한 파일 서비스 넣기
    public int updateExam(ExamDto examDto, MultipartFile newImageFile) throws IOException {
        // 1. DB에서 현재 레코드 정보를 가져와, 클라이언트가 보낸 정보에 의존하지 않도록 함
        ExamDto originalExam = adminStudyMapper.getIndiExam(examDto.getExamNo());
        if (originalExam == null) {
            throw new IOException("수정할 예문이 존재하지 않습니다.");
        }

        String newPath = null;
        // 2. 새로운 이미지 파일이 제공된 경우, 기존 파일 삭제 및 새 파일 업로드
        if (newImageFile != null && !newImageFile.isEmpty()) {
            try {
                // 2-1. 기존 이미지가 있으면 삭제
                if (originalExam.getImagePath() != null && !originalExam.getImagePath().isEmpty()) {
                    fileService.deleteFile(originalExam.getImagePath());
                }
                // 2-2. 새 파일을 올바른 examNo로 업로드
                newPath = fileService.uploadImage(newImageFile, examDto.getExamNo());
                // 2-3. DTO에 새로운 이미지 정보 설정 (imagePath와 imageName 모두 올바르게 설정)
                examDto.setImagePath(newPath);
                examDto.setImageName(newImageFile.getOriginalFilename());
            } catch (Exception e) { // 2-4. 파일 처리 중 예외 발생 시, 업로드 파일 삭제하고 예외처리
                if (newPath != null) {
                    fileService.deleteFile(newPath);
                }
                throw new IOException("이미지 파일 교체 중 오류가 발생했습니다." , e);
            }
        } else {
            // 2-5. 새 이미지가 없으면 기존 이미지 정보를 그대로 유지한다
            examDto.setImageName(originalExam.getImageName());
            examDto.setImagePath(originalExam.getImagePath());
        }
        return adminStudyMapper.updateExam(examDto);
    }

    // [AEX-03] 예문 삭제 deleteExam()
    // 예문 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int
    public int deleteExam(int examNo) {
        // 1. DB에 파일 있는지 확인 후 삭제
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
    public List<ExamDto> getExam() {
        return adminStudyMapper.getExam();
    }

    // [AEX-05] 예문 개별조회 getIndiExam()
    // 예문 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 Dto
    public ExamDto getIndiExam(int examNo) {
        return adminStudyMapper.getIndiExam(examNo);
    }

}
