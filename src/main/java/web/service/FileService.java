package web.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
@Transactional
public class FileService {

    // [*] 기본 경로 설정
    private String baseDir = System.getProperty("user.dir");

    // 업로드 경로 정의
    private String audioPath = baseDir + "/build/resources/main/static/upload/audio/";
    private String imagePath = baseDir + "/build/resources/main/static/upload/image/";

    // [1] 오디오 업로드
    public String uploadAudio(MultipartFile file , int examNo) throws IOException {
        return uploadFile(file, imagePath, examNo, "img");
    }

    // [2] 이미지 업로드
    public String uploadImage(MultipartFile file , int examNo , String lang) throws IOException {
        return uploadFile(file, audioPath, examNo, lang + "_voice");
    }

    // [3] 공통 파일 업로드 로직
    private String uploadFile(MultipartFile file, String targetPath, int examNo , String type) throws IOException {
        if( file == null || file.isEmpty()){
            throw new IllegalArgumentException("파일이 비어있습니다.");
        } // if end

        // 경로 폴더 없으면 생성
        File dir = new File(targetPath);
        if (!dir.exists()) dir.mkdirs();

        // 파일명 규칙 :{examNo}_{type}.{확장자}
        String originalName = file.getOriginalFilename();
        String ext = originalName.substring(originalName.lastIndexOf(".")); // 확장자
        String newFileName = examNo + "_" + type + ext;

        // 실제 저장 경로

        // 기존 파일 덮어쓰기 or 교체ㅔ

        // DB에 저장할 상대경로 리턴

        return null;
    }

    // [4] 파일 삭제

    // [5] 파일 수정

}
