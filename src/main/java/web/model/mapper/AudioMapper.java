package web.model.mapper;

import org.apache.ibatis.annotations.*;
import web.model.dto.AudioDto;

import java.util.List;

@Mapper
public interface AudioMapper {

    // [AAD-01] 음성파일 생성 createAudio()
    // 음성 테이블 레코드를 추가한다
    // 매개변수 AudioDto
    // 반환 int (PK)
    // * 추후 추가
    // 1-1) 음성파일을 직접 등록한다.
    // 1-2) 텍스트를 읽고 음성파일로 변환 후 등록한다. (파이썬 로직!!) todo
    @Insert("insert into audio(audioName , audioPath, lang, examNo) values (#{audioName} , #{audioPath}, #{lang}, #{examNo}) ")
    @Options(useGeneratedKeys = true , keyProperty = "audioNo")
    int createAudio(AudioDto audioDto);

    // 예문 생성 후 이미지 정보 업데이트
    @Update("update audio set audioName = #{audioName} , audioPath = #{audioPath} where audioNo = #{audioNo}")
    int updateAudioAfterCreate(AudioDto audioDto);

    // [AAD-02] 음성파일 수정	updateAudio()
    // 음성 테이블 레코드를 변경한다.
    // 매개변수 AudioDto
    // 반환 int
    // * 추후 추가
    // 1-1) 음성파일을 직접 변경한다.
    // 1-2) 텍스트를 읽고 음성파일로 변환 후 수정한다. (파이썬 로직!!) todo
    @Update("update audio set audioName = #{audioName} ,  audioPath = #{audioPath} , lang = #{lang} , examNo = #{examNo} where audioNo = #{audioNo}")
    int updateAudio(AudioDto audioDto);

    // [AAD-03]	음성파일 삭제	deleteAudio()
    // 음성 테이블 레코드를 삭제한다.
    // 매개변수 int audioNo
    // 반환 int
    @Delete("delete from audio where audioNo = #{audioNo}" )
    int deleteAudio(int audioNo);

    // [AAD-04]	음성파일 전체조회 getAudio()
    // 음성 테이블 레코드를 모두 조회한다
    // 반환 List<AudioDto>
    @Select("select * from audio order by audioNo ")
    List<AudioDto> getAudio();

    // [AAD-05] 음성파일 개별조회 getIndiAudio()
    // 음성 테이블 레코드를 조회한다
    // 매개변수 int audioNo
    // 반환 AudioDto
    @Select("select * from audio where audioNo = #{audioNo} ")
    AudioDto getIndiAudio(int audioNo);

}
