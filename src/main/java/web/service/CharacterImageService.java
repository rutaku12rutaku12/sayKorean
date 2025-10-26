package web.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.http.HttpHeaders;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class CharacterImageService {

    // [*] DI
    private final FileService fileService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${python.api.url:http://localhost:5001}")
    private String pythonApiUrl;

    @Value("${upload.base.dir}")
    private String baseDir;

    // 학습된 모델 버전 저장 ( * DB 저장하는 게 더 좋음)
    private String trainedModelVersion = null;
    private String triggerWord = "saykorean_character";

    // [1] 캐릭터 학습
    // 최초 1회만 실행, 결과를 DB에 저장하여 재사용
    // @param trainingImages 학습용 이미지 파일 리스트 (10~20개)
    // @param characterName 캐릭터 이름 (트리거 단어로 사용)
    // @return 학습 결과
    public Map<String, Object> trainCharacter(List<MultipartFile> trainingImages, String characterName) throws IOException {

        log.info("캐릭터 학습 시작 - 이미지 수: {} , 캐릭터명: {}",
                trainingImages.size(), characterName);

        if (trainingImages.size() < 10) {
            throw new IllegalArgumentException("최소 10장의 학습 이미지가 필요합니다.");
        }

        try {
            // 1. 복수의 이미지 파일을 임시 저장 후 URL 생성
            List<String> imageUrls = uploadTrainingImages(trainingImages);

            // 2. Python API 호출하여 학습 시작
            String url = pythonApiUrl + "/api/train-character";

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("training_images", imageUrls);
            requestBody.put("trigger_word", characterName);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());

                if (jsonNode.get("success").asBoolean()) {
                    // 학습된 모델 버전 저장
                    this.trainedModelVersion = jsonNode.get("model_version").asText();
                    this.triggerWord = characterName;

                    log.info("캐릭터 학습 완료 - 모델 버전: {}", trainedModelVersion);

                    Map<String, Object> result = new HashMap<>();
                    result.put("success", true);
                    result.put("modelVersion", trainedModelVersion);
                    result.put("triggerWord", triggerWord);
                    result.put("message", "캐릭터 학습이 완료되었습니다.");

                    return result;
                } else {
                    throw new IOException("학습 실패: " + jsonNode.get("message").asText());
                }
            } else {
                throw new IOException("Python API 호출 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("캐릭터 학습 실패", e);
            throw new IOException("캐릭터 학습 중 오류가 발생했습니다: " + e.getMessage(), e);
        }

    } // method end

    // [2] 학습된 캐릭터로 이미지 생성
    // @param prompt 생성할 상황 설명 (예: "두 캐릭터가 공부하고 있는 모습")
    // @param examNo 예문 번호
    // @return 저장된 이미지 경로
    public String generateCharacterImage(String prompt, int examNo) throws IOException {
        return generateCharacterImage(prompt, examNo, 1024, 1024);
    }

    public String generateCharacterImage(String prompt, int examNo, int width, int height) throws IOException {
        log.info("캐릭터 이미지 생성 - examNo: {} , prompt: {}", examNo, prompt);

        if (trainedModelVersion == null) {
            throw new IllegalStateException("캐릭터가 학습되지 않았습니다. 먼저 학습을 진행해주세요.");
        }

        try {
            // Python API 호출
            String imageBase64 = callPythonCharacterImageApi(
                    prompt, trainedModelVersion, triggerWord, width, height
            );

            // Base64 디코딩 및 파일 저장
            byte[] imageBytes = Base64.getDecoder().decode(imageBase64);
            String savedPath = saveGeneratedImage(imageBytes, examNo);

            log.info("캐릭터 이미지 생성 완료 - 경로: {}", savedPath);
            return savedPath;

        } catch (Exception e) {
            log.error("캐릭터 이미지 생성 실패", e);
            throw new IOException("캐럭티 이미지 생성 중 오류: " + e.getMessage(), e);
        }
    } // method end

    // [3] Python API 호출 (캐릭터 이미지 생성)
    private String callPythonCharacterImageApi(String prompt, String modelVersion, String triggerWord, int width, int height)
            throws IOException {
        String url = pythonApiUrl + "/api/generate-character-image";
    }


} // class end
