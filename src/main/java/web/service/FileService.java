package web.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.Locale;

@Service
@Transactional
public class FileService {

    // [*] 기본 경로 설정
    private String baseDir = System.getProperty("user.dir");

    // 업로드 경로 정의
    private String audioPath = baseDir + "/build/resources/main/static/upload/audio/";
    private String imagePath = baseDir + "/build/resources/main/static/upload/image/";

    // [1] 이미지 업로드
    public String uploadImage(MultipartFile file , int examNo) throws IOException {
        return uploadFile(file, imagePath, examNo, "img");
    }

    // [2] 오디오 업로드
    public String uploadAudio(MultipartFile file , int examNo , int lang) throws IOException {
        String langCode;

        // [*] 언어 코드 변환
        switch (lang) {
            case 1 -> langCode = "kor";
            case 2 -> langCode = "eng";
            default -> throw new IllegalArgumentException("지원하지 않는 언어 코드입니다. (1=kor, 2=eng)");
        }

        // [*] type 에 {langCode}_voice 형태로 전달 → 파일명 {examNo}_{langCode}_voice.{확장자}
        return uploadFile(file, audioPath, examNo, langCode + "_voice");
    }

    // [3] 공통 파일 업로드 로직
    private String uploadFile(MultipartFile file, String baseTargetPath, int examNo , String type) throws IOException {
        // [*] 파일 존재여부 확인
        if( file == null || file.isEmpty()){
            throw new IllegalArgumentException("파일이 비어있습니다.");
        } // if end

        // 3-1 월계산
        LocalDate now = LocalDate.now();
        String month = now.getMonth().getDisplayName(TextStyle.SHORT , Locale.ENGLISH).toLowerCase(); // mar, apr 식으로 출력
        String year = String.valueOf(now.getYear()).substring(2); // 23 , 24 , 25(년)
        String monthDir = month + "_" + year; // mar_25

        // 3-2 경로 폴더 없으면 생성
        String targetPath = baseTargetPath + monthDir + "/";
        File dir = new File(targetPath);
        if (!dir.exists()) dir.mkdirs();

        // 3-3 파일명 규칙 :{examNo}_{type}.{확장자}
        String originalName = file.getOriginalFilename();
        if(originalName == null || !originalName.contains(".")){
            throw new IllegalArgumentException("유효하지 않은 파일명 입니다.");
        }
        String ext = originalName.substring(originalName.lastIndexOf(".")); // 확장자(ex : jpg)
        String newFileName = examNo + "_" + type + ext;

        // 3-4 실제 저장 경로
        File targetFile = new File(targetPath + newFileName);

        // 3-5 기존 파일 덮어쓰기 or 교체
        if (targetFile.exists()) targetFile.delete();
        file.transferTo(targetFile);

        // 3-6 DB에 저장할 상대경로 반환 (월 폴더 포함)
        if(targetPath.contains("/image/")){
            return "/upload/image/" + monthDir + "/" + newFileName;
        } else if (targetPath.contains("/audio/")) {
            return "/upload/audio/" + monthDir + "/" + newFileName;
        }

        // 3-7 예외처리 반환
        throw new IllegalStateException("지원하지 않는 업로드 경로입니다.");
    }

    // [4] 파일 삭제
    public boolean deleteFile(String relativePath) {
        // 4-1 경로 위치 확인
        String fullPath = baseDir + "/build/resources/main/static" + relativePath;
        File file = new File(fullPath);
        // 4-2 파일 존재 시 삭제
        return file.exists() && file.delete();
    }

    // [5] 파일 수정
    public String updateFile(MultipartFile newFile , String oldRelativePath , int examNo , String type, int lang) throws IOException {
        // 5-1 기존 파일이 있을 경우 삭제
        if (oldRelativePath != null && !oldRelativePath.isBlank()){
            deleteFile(oldRelativePath);
        }
        // 5-2 파일 형식에 따라 업로드
        if (type.equals("img")) {
            return uploadImage(newFile, examNo);
        } else if (type.equals("_voice")) {
            return uploadAudio(newFile , examNo, lang);
        }
        // 5-3 예외처리
        throw new IllegalStateException("수정 경로가 올바르지 않습니다.");
    }

}
