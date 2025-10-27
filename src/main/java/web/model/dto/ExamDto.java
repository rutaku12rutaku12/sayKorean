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
public class ExamDto {
    private int examNo;     // PK: 예문번호
    private String  examKo;     // 한국어 예문 (UNIQUE)
    private String  examRoman;  // 발음/로마자 (UNIQUE)
    private String  examJp;     // 일본어 예문 (UNIQUE)
    private String  examCn;     // 중국어 예문 (UNIQUE)
    private String  examEn;     // 영어 예문 (UNIQUE)
    private String  examEs;     // 스페인어 예문 (UNIQUE)

    private String  imageName;  // 그림 파일명
    private String  imagePath;  // 그림 파일 경로

    private int studyNo;    // FK: study.themeNo

    private MultipartFile imageFile;    // 이미지파일 등록용 멤버변수 
    private MultipartFile newImageFile; // 이미지파일 수정용 멤버변수


    private String examSelected; // 프론트가 사용할 언어별 예문 필드

    private String koAudioPath;
    private String enAudioPath;

}
