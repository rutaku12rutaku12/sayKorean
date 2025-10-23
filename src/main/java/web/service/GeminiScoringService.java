package web.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import web.config.EnvLoader;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// Google Gemini REST API 호출 → 0~100 점수 반환
@Service
@RequiredArgsConstructor
public class GeminiScoringService {

    private static final String MODEL = "gemini-1.5-flash";
    private static final Pattern INT_PATTERN = Pattern.compile("(\\d{1,3})");

    private final ObjectMapper om = new ObjectMapper();
    private final HttpClient http = HttpClient.newHttpClient();

    public record ScoreResult(int score, String rawText) {}

    public ScoreResult score(String question, String groundTruth, String userAnswer, String langHint) throws Exception {

        // [1] JSON 환경파일 자동 로드
        EnvLoader.loadJsonEnv("src/main/resources/env.app.json");

        String apiKey = System.getProperty("GOOGLE_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            apiKey = System.getenv("GOOGLE_API_KEY");
        }
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GOOGLE_API_KEY 환경변수가 비어 있습니다.");
        }

        // [2] 프롬프트 정의
        String prompt = """
                점수는 0부터 100 사이의 정수로만 매깁니다.
                의미적 동등성, 문법, 관련성을 고려해서 채점해주세요.

                언어 힌트: %s
                문항: %s
                기준 정답: %s
                사용자 답변: %s
                """.formatted(
                nullToEmpty(langHint),
                nullToEmpty(question),
                nullToEmpty(groundTruth),
                nullToEmpty(userAnswer)
        );

        // [3] ✅ 최신 v1beta generateContent 형식으로 JSON 구성
        String bodyJson = om.writeValueAsString(
                om.createObjectNode()
                        .putArray("contents")
                        .addObject()
                        .putArray("parts")
                        .addObject()
                        .put("text", prompt)
        );

        System.out.println("[DEBUG] bodyJson = " + bodyJson);

        // [4] 올바른 엔드포인트 (v1beta + generateContent)
        URI uri = URI.create("https://generativelanguage.googleapis.com/v1beta/models/"
                + MODEL + ":generateContent?key=" + apiKey);

        HttpRequest req = HttpRequest.newBuilder(uri)
                .header("Content-Type", "application/json; charset=UTF-8")
                .POST(HttpRequest.BodyPublishers.ofString(bodyJson, StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

        // [5] 오류 처리
        if (res.statusCode() / 100 != 2) {
            throw new RuntimeException("Gemini API error: HTTP " + res.statusCode() + " - " + res.body());
        }

        // [6] 응답 파싱
        JsonNode root = om.readTree(res.body());
        String text = root.path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText("");

        int score = parseScore(text);

        return new ScoreResult(score, text);
    }

    // 숫자 파싱: "95점" → 95
    private static int parseScore(String raw) {
        Matcher m = INT_PATTERN.matcher(raw);
        if (m.find()) {
            int v = Integer.parseInt(m.group(1));
            return Math.max(0, Math.min(100, v));
        }
        return 0;
    }

    private static String nullToEmpty(String s) { return s == null ? "" : s; }
}