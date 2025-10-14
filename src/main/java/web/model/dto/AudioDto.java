package web.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AudioDto {
    private int audioNo;    // PK: 음성파일번호
    private String  audioName;  // 음성 파일명
    private String  audioPath;  // 음성 파일 경로
    private int lang;       // 언어 코드(예: 0=ko, 1=jp, 2=cn, 3=en, 4=es)
    private int examNo;     // FK: exam.examNo

    private MultipartFile audioFile;    // 음성파일 등록용 멤버변수
    private MultipartFile newAudioFile; // 음성파일 수정용 멤버변수
}
