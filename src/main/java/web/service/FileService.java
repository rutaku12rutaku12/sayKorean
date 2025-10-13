package web.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
        return null;
    }

    // [4] 파일 삭제

    // [5] 파일 수정

}
