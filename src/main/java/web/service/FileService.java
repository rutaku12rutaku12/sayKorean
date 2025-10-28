package web.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.Locale;

@Service
@Transactional
public class FileService {

    // 1. application.properties에서 설정한 외부 경로를 주입받습니다.
    @Value("${upload.path}")
    private String uploadRootPath;

    // [1] 이미지 업로드
    public String uploadImage(MultipartFile file, int examNo) throws IOException {
        // 'image/' 서브디렉토리에 저장
        return uploadFile(file, "image/", examNo, "img");
    }

    // [2-1] 오디오 파일 업로드
    public String uploadAudio(MultipartFile file, int examNo, int lang) throws IOException {
        String langCode;
        switch (lang) {
            case 1 -> langCode = "kor";
            case 2 -> langCode = "eng";
            default -> throw new IllegalArgumentException("지원하지 않는 언어 코드입니다. (1=kor, 2=eng)");
        }
        // 'audio/' 서브디렉토리에 저장
        return uploadFile(file, "audio/", examNo, langCode + "_voice");
    }

    // [2-2] TTS로 생성된 오디오 바이트 배열 저장
    public String uploadAudioFromBytes(byte[] audioData, int examNo, int lang) throws IOException {
        String langCode;
        switch (lang) {
            case 1 -> langCode = "kor";
            case 2 -> langCode = "eng";
            default -> throw new IllegalArgumentException("지원하지 않는 언어 코드입니다.");
        }

        LocalDate now = LocalDate.now();
        String monthDir = now.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH).toLowerCase() + "_" + String.valueOf(now.getYear()).substring(2);

        // 2. 저장 경로를 외부 경로 기준으로 재구성
        String relativePath = "audio/" + monthDir + "/";
        String fullPath = Paths.get(uploadRootPath, relativePath).toString();

        File dir = new File(fullPath);
        if (!dir.exists()) dir.mkdirs();

        String newFileName = examNo + "_" + langCode + "_voice.mp3";
        File targetFile = new File(fullPath, newFileName);

        if (targetFile.exists()) targetFile.delete();

        try (FileOutputStream fos = new FileOutputStream(targetFile)) {
            fos.write(audioData);
        }

        // 3. DB에 저장할 URL 경로는 그대로 유지
        return "/upload/audio/" + monthDir + "/" + newFileName;
    }

    // [3] 공통 파일 업로드 로직
    private String uploadFile(MultipartFile file, String subDir, int examNo, String type) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        LocalDate now = LocalDate.now();
        String monthDir = now.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH).toLowerCase() + "_" + String.valueOf(now.getYear()).substring(2);

        // 4. 저장 경로를 외부 경로 기준으로 재구성
        // 예: C:/dev/saykorean_uploads/image/oct_25/
        String relativePath = subDir + monthDir + "/";
        String fullPath = Paths.get(uploadRootPath, relativePath).toString();

        File dir = new File(fullPath);
        if (!dir.exists()) dir.mkdirs();

        String originalName = file.getOriginalFilename();
        if (originalName == null || !originalName.contains(".")) {
            throw new IllegalArgumentException("유효하지 않은 파일명 입니다.");
        }
        String ext = originalName.substring(originalName.lastIndexOf("."));
        String newFileName = examNo + "_" + type + ext;

        // 5. 최종 저장 경로
        File targetFile = new File(fullPath, newFileName);

        if (targetFile.exists()) targetFile.delete();
        file.transferTo(targetFile);

        // 6. DB에 저장할 URL 경로는 그대로 유지 (WebConfig에서 이 URL을 실제 파일 경로와 매핑)
        // 예: /upload/image/oct_25/1_img.jpg
        return "/upload/" + relativePath + newFileName;
    }

    // [4] 파일 삭제
    public boolean deleteFile(String relativeUrlPath) {
        if (relativeUrlPath == null || relativeUrlPath.isBlank()) {
            return false;
        }
        // 7. URL 경로에서 '/upload/' 부분을 제거하여 실제 파일 시스템의 상대 경로를 얻음
        // 예: /upload/image/oct_25/1.jpg -> image/oct_25/1.jpg
        String relativeFilePath = relativeUrlPath.startsWith("/upload/") ? relativeUrlPath.substring("/upload/".length()) : relativeUrlPath;

        // 8. 외부 저장소 루트와 조합하여 전체 파일 경로를 만듦
        String fullPath = Paths.get(uploadRootPath, relativeFilePath).toString();
        File file = new File(fullPath);

        return file.exists() && file.delete();
    }

    // [5] 파일 수정 (로직 수정 불필요)
    // deleteFile과 upload... 메소드가 수정되었으므로 이 메소드는 자동으로 새 로직을 따릅니다.
    public String updateFile(MultipartFile newFile, String oldRelativePath, int examNo, String type, int lang) throws IOException {
        if (oldRelativePath != null && !oldRelativePath.isBlank()) {
            deleteFile(oldRelativePath);
        }
        if (type.equals("img")) {
            return uploadImage(newFile, examNo);
        } else if (type.equals("_voice")) {
            return uploadAudio(newFile, examNo, lang);
        }
        throw new IllegalStateException("수정 경로가 올바르지 않습니다.");
    }
}
