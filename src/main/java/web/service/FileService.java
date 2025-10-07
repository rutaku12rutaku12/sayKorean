package web.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class FileService {

    // [*] 기본 경로 설정
    private String baseDir = System.getProperty("user.dir");

    // 월 단위로 경로명 변경하는 함수

    // 업로드 경로 정의
    private String audioPath = baseDir + "/build/resources/main/static/upload/audio/";
    private String imagePath = baseDir + "/build/resources/main/static/upload/image/";

    // [1] 파일 업로드
//    public String fileUpload(MultipartFile multipartFile) {
//        int index = 1;
//        String fileName = index++ + "_" + multipartFile.getOriginalFilename().replaceAll("_" , "-");
//
//    }

    // [2] 파일 다운로드

    // [3] 파일 삭제

}
