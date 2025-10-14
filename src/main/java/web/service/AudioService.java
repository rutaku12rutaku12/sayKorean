package web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import web.model.dto.AudioDto;
import web.model.mapper.AudioMapper;

import java.io.IOException;

@Service
@Transactional
@RequiredArgsConstructor
public class AudioService {

    // DI
    private final AudioMapper audioMapper;
    private final FileService fileService;

    // [AAD-01] 음성파일 생성 createAudio()
    // 음성 테이블 레코드를 추가한다
    // 매개변수 AudioDto
    // 반환 int (PK)
    // * 추후 추가
    // 1-1) 음성파일을 직접 등록한다.
    // 1-2) 텍스트를 읽고 음성파일로 변환 후 등록한다. (파이썬 로직!!) todo
    public int createAudio(AudioDto audioDto , MultipartFile audioFile) throws IOException {
        // 1. 음성 파일이 있으면 파일 저장 및 DB 업데이트
        if(audioFile != null && !audioFile.isEmpty()){
            String audioPath = null;
            try {
                // 2-1. 실제 audioNo와 lang을 활용한 파일 업로드
                audioPath = fileService.uploadAudio(audioFile , audioDto.getAudioNo() , audioDto.getLang());
                // 2-2. DTO에 음성파일 정보 설정
                audioDto.setAudioPath(audioPath);
                audioDto.setAudioName(audioFile.getOriginalFilename());
                // 2-3. DB에 음성 정보 업데이트
                audioMapper.createAudio(audioDto);
            } catch (Exception e) { // 2-4. 예외 발생 시 음성 레코드와 파일 롤백 처리
                if (audioPath != null){
                    fileService.deleteFile(audioPath);
                }
                audioMapper.deleteAudio(audioDto.getExamNo());
                throw new IOException("음성 파일 업로드 중 오류 발생하여 생성이 취소되었습니다." , e);
            }
        }
        // 3. 생성한 음성 레코드의 PK 반환
        return audioDto.getAudioNo();
    }

    // [AAD-02] 음성파일 수정	updateAudio()
    // 음성 테이블 레코드를 변경한다.
    // 매개변수 AudioDto
    // 반환 int
    // * 추후 추가
    // 1-1) 음성파일을 직접 변경한다.
    // 1-2) 텍스트를 읽고 음성파일로 변환 후 수정한다. (파이썬 로직!!) todo
    public int updateAudio(AudioDto audioDto , MultipartFile newAudioFile) throws IOException {
        // 1. DB에서 현재 레코드 정보 호출
        AudioDto originalAudio = audioMapper.getIndiAudio(audioDto.getAudioNo());
        if (originalAudio == null){
            throw new IOException("수정할 음성파일이 존재하지 않습니다.");
        }
        
        String audioPath = null;
        // 2. 새로운 음성 파일이 제공된 경우, 기존 파일 삭제 및 새 파일 업로드
        if (newAudioFile != null && !newAudioFile.isEmpty()){
            try{
                // 2-1. 기존 음성파일이 있으면 삭제
                if(originalAudio.getAudioPath() != null && !originalAudio.getAudioPath().isEmpty()){
                    fileService.deleteFile(originalAudio.getAudioPath());
                }

            } catch (Exception e) {
                throw new IOException("음성 파일 변경 중에 오류 발생했습니다." , e);
            }
        }
        return audioMapper.updateAudio(audioDto);
    }

    // [AAD-03]	음성파일 삭제	deleteAudio()
    // 음성 테이블 레코드를 삭제한다.
    // 매개변수 int audioNo
    // 반환 int

    // [AAD-04]	음성파일 전체조회 getAudio()
    // 음성 테이블 레코드를 모두 조회한다
    // 반환 List<AudioDto>

    // [AAD-05] 음성파일 개별조회 getIndiAudio()
    // 음성 테이블 레코드를 조회한다
    // 매개변수 int audioNo
    // 반환 AudioDto

}
