//package web.controller;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//import web.service.CharacterImageService;
//
//import java.io.IOException;
//import java.util.List;
//import java.util.Map;
//
//@Slf4j
//@RestController
//@RequestMapping("/saykorean/admin/character")
//@RequiredArgsConstructor
//public class CharacterController {
//
//    private final CharacterImageService characterImageService;
//
//    /**
//     * [STEP 1] 캐릭터 학습 - 최초 1회만 실행
//     *
//     * POST /saykorean/admin/character/train
//     *
//     * Form Data:
//     * - trainingImages: 학습용 이미지 파일들 (10~20개)
//     * - characterName: 캐릭터 이름 (예: "saykorean_bear")
//     *
//     * 응답:
//     * {
//     *   "success": true,
//     *   "modelVersion": "model_version_id",
//     *   "triggerWord": "saykorean_bear",
//     *   "message": "캐릭터 학습이 완료되었습니다."
//     * }
//     */
//    @PostMapping("/train")
//    public ResponseEntity<Map<String, Object>> trainCharacter(
//            @RequestParam("trainingImages") List<MultipartFile> trainingImages,
//            @RequestParam("characterName") String characterName) {
//
//        try {
//            log.info("캐릭터 학습 요청 - 이미지 수: {}, 캐릭터명: {}",
//                    trainingImages.size(), characterName);
//
//            if (trainingImages.size() < 10) {
//                return ResponseEntity.badRequest().body(
//                        Map.of("success", false,
//                                "message", "최소 10장의 학습 이미지가 필요합니다.")
//                );
//            }
//
//            Map<String, Object> result = characterImageService.trainCharacter(
//                    trainingImages, characterName
//            );
//
//            return ResponseEntity.ok(result);
//
//        } catch (IOException e) {
//            log.error("캐릭터 학습 실패", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
//                    Map.of("success", false,
//                            "message", "캐릭터 학습 중 오류가 발생했습니다: " + e.getMessage())
//            );
//        }
//    }
//
//    /**
//     * [STEP 2] 학습된 캐릭터로 이미지 생성
//     *
//     * POST /saykorean/admin/character/generate
//     *
//     * Request Body:
//     * {
//     *   "prompt": "두 캐릭터가 공부하고 있는 모습, korean traditional clothes",
//     *   "examNo": 1,
//     *   "width": 1024,
//     *   "height": 1024
//     * }
//     *
//     * 응답:
//     * {
//     *   "success": true,
//     *   "imagePath": "/upload/image/oct_25/1_character_generated.png",
//     *   "message": "이미지가 생성되었습니다."
//     * }
//     */
//    @PostMapping("/generate")
//    public ResponseEntity<Map<String, Object>> generateCharacterImage(
//            @RequestBody Map<String, Object> request) {
//
//        try {
//            String prompt = (String) request.get("prompt");
//            int examNo = (Integer) request.get("examNo");
//            int width = (Integer) request.getOrDefault("width", 1024);
//            int height = (Integer) request.getOrDefault("height", 1024);
//
//            if (prompt == null || prompt.trim().isEmpty()) {
//                return ResponseEntity.badRequest().body(
//                        Map.of("success", false, "message", "프롬프트를 입력해주세요.")
//                );
//            }
//
//            String imagePath = characterImageService.generateCharacterImage(
//                    prompt, examNo, width, height
//            );
//
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "imagePath", imagePath,
//                    "message", "이미지가 생성되었습니다."
//            ));
//
//        } catch (IllegalStateException e) {
//            // 학습되지 않은 경우
//            return ResponseEntity.status(HttpStatus.PRECONDITION_REQUIRED).body(
//                    Map.of("success", false,
//                            "message", e.getMessage(),
//                            "needTraining", true)
//            );
//
//        } catch (IOException e) {
//            log.error("이미지 생성 실패", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
//                    Map.of("success", false,
//                            "message", "이미지 생성 중 오류가 발생했습니다: " + e.getMessage())
//            );
//        }
//    }
//
//    /**
//     * 학습 상태 확인
//     *
//     * GET /saykorean/admin/character/status?trainingId=xxx
//     */
//    @GetMapping("/status")
//    public ResponseEntity<Map<String, Object>> checkTrainingStatus(
//            @RequestParam String trainingId) {
//
//        try {
//            Map<String, Object> result = characterImageService.getTrainingStatus(trainingId);
//            return ResponseEntity.ok(result);
//
//        } catch (IOException e) {
//            log.error("학습 상태 확인 실패", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
//                    Map.of("success", false,
//                            "message", "상태 확인 중 오류가 발생했습니다: " + e.getMessage())
//            );
//        }
//    }
//
//    /**
//     * 현재 학습된 모델 정보 조회
//     *
//     * GET /saykorean/admin/character/info
//     */
//    @GetMapping("/info")
//    public ResponseEntity<Map<String, Object>> getCharacterInfo() {
//        String modelVersion = characterImageService.getTrainedModelVersion();
//        String triggerWord = characterImageService.getTriggerWord();
//
//        if (modelVersion == null) {
//            return ResponseEntity.ok(Map.of(
//                    "trained", false,
//                    "message", "학습된 캐릭터가 없습니다."
//            ));
//        }
//
//        return ResponseEntity.ok(Map.of(
//                "trained", true,
//                "modelVersion", modelVersion,
//                "triggerWord", triggerWord,
//                "message", "학습된 캐릭터를 사용할 수 있습니다."
//        ));
//    }
//}