package web.model.mapper;

import org.apache.ibatis.annotations.*;
import web.model.dto.ExamDto;
import web.model.dto.GenreDto;
import web.model.dto.StudyDto;

import java.util.List;

@Mapper
public interface AdminStudyMapper {

    // [AGR-01] 장르 생성 createGenre()
    // 장르 테이블 레코드를 추가한다
    // 매개변수 GenreDto
    // 반환 int (PK)
    @Insert("insert into genre(genreName) values (#{genreName})")
    @Options(useGeneratedKeys = true , keyProperty = "genreNo")
    int createGenre(GenreDto genreDto);

    // [AGR-02] 장르 전체조회 getGenre()
    // 장르 테이블 레코드를 모두 조회한다
    // 반환 List
    @Select("select * from genre")
    List<GenreDto> getGenre();

    // [AGR-03] 장르 삭제 deleteGenre()
    // 장르 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int
    @Delete("delete from genre where genreNo = #{genreNo}")
    int deleteGenre(int genreNo);

    // [AST-01] 교육 생성 createStudy()
    // 교육 테이블 레코드를 추가한다
    // 매개변수 StudyDto
    // 반환 int(PK)
    @Insert("insert into study(themeKo , themeJp , themeCn , themeEn , themeEs , commenKo , commenJp , commenCn , commenEn , commenEs , genreNo) values (#{themeKo} , #{themeJp}, #{themeCn} , #{themeEn} , #{themeEs} , #{commenKo} , #{commenJp} , #{commenCn} , #{commenEn} , #{commenEs} , #{genreNo}) ")
    @Options(useGeneratedKeys = true , keyProperty = "studyNo")
    int createStudy(StudyDto studyDto);

    // [AST-02] 교육 수정 updateStudy()
    // 교육 테이블 레코드를 변경한다.
    // 매개변수 StudyDto
    // 반환 int
    @Update("update study set themeKo = #{themeKo} , themeJp = #{themeJp} , themeCn = #{themeCn} , themeEn = #{themeEn} , themeEs = #{themeEs} , commenKo = #{commenKo} , commenJp = #{commenJp} , commenCn = #{commenCn} , commenEn = #{commenEn} , commenEs = #{commenEs} , genreNo = #{genreNo} where studyNo = #{studyNo} ")
    int updateStudy(StudyDto studyDto);

    // [AST-03] 교육 삭제 deleteStudy()
    // 교육 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int
    @Delete("delete from study where studyNo = #{studyNo} ")
    int deleteStudy(int studyNo);

    // [AST-04] 교육 전체조회 getStudy()
    // 교육 테이블 레코드를 모두 조회한다
    // 반환 List
    @Select("select * from study ")
    List<StudyDto> getStudy();

    // [AST-05] 교육 개별조회 getIndiStudy()
    // 교육 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 Dto
    @Select("select * from study where studyNo = #{studyNo} ")
    StudyDto getIndiStudy(int studyNo);

    // [AEX-01] 예문 생성 createExam()
    // 예문 테이블 레코드를 추가한다
    // 매개변수 ExamDto
    // 반환 int(PK)
    @Insert("insert into exam(examKo , examRoman , examJp , examCn , examEn , examEs , imageName , imagePath , studyNo) values (#{examKo} , #{examRoman} , #{examJp} , #{examCn} , #{examEn} , #{examEs} , #{imageName} , #{imagePath} , #{studyNo} ) ")
    @Options(useGeneratedKeys = true , keyProperty = "examNo")
    int createExam(ExamDto examDto);

    // [AEX-02] 예문 수정 updateExam()
    // 예문 테이블 레코드를 변경한다.
    // 매개변수 ExamDto
    // 반환 int
    @Update("update exam set examKo = #{examKo} , examRoman = #{examRoman} , examJp = #{examJp} , examCn = #{examCn} , examEn = #{examEn} , examEs = #{examEs} , imageName = #{imageName} , imagePath = #{imagePath} , studyNo = #{studyNo} where examNo = #{examNo} ")
    int updateExam(ExamDto examDto);

    // [AEX-03] 예문 삭제 deleteExam()
    // 예문 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int
    @Delete("delete from exam where examNo = #{examNo} ")
    int deleteExam(int examNo);

    // [AEX-04] 예문 전체조회 getExam()
    // 예문 테이블 레코드를 모두 조회한다
    // 반환 List
    @Select("select * from exam ")
    List<ExamDto> getExam();

    // [AEX-05] 예문 개별조회 getIndiExam()
    // 예문 테이블 레코드를 조회한다
    // 매개변수 int
    // 반환 Dto
    @Select("select * from exam where examNo = #{examNo} ")
    ExamDto getIndiExam(int examNo);

}
