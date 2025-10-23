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

/*
 * Gemini 2.5 Flash REST API 기반 자동 채점 서비스
 * - 0~100 점수만 추출
 * - SDK 설치 불필요
 */
@Service
@RequiredArgsConstructor
public class GeminiScoringService {

    private static final String MODEL = "gemini-2.5-flash";
    private static final Pattern INT_PATTERN = Pattern.compile("(\\d{1,3})");

    private final ObjectMapper om = new ObjectMapper();
    private final HttpClient http = HttpClient.newHttpClient();

    public record ScoreResult(int score, String rawText) {}

    public ScoreResult score(String question, String groundTruth, String userAnswer, String langHint) throws Exception {

        // [1] 환경 변수 로드
        EnvLoader.loadJsonEnv("src/main/resources/env.app.json");

        String apiKey = System.getProperty("GOOGLE_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            apiKey = System.getProperty("GOOGLE_API_KEY");
        }
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Google API Key가 비어 있습니다. 환경변수를 확인하세요.");
        }

        // [2] 프롬프트 작성
        String prompt = """
                점수는 반드시 0부터 100 사이의 정수로만 출력하세요.
                의미적 동등성, 문법, 관련성을 고려해 채점합니다.

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

        // [3] 요청 JSON (2.5-flash 최신 스키마)
        String bodyJson = """
        {
          "contents": [
            {
              "role": "user",
              "parts": [
                { "text": %s }
              ]
            }
          ]
        }
        """.formatted(om.writeValueAsString(prompt));

        // [4] 요청 생성
        URI uri = URI.create("https://generativelanguage.googleapis.com/v1beta/models/"
                + MODEL + ":generateContent?key=" + apiKey);

        HttpRequest req = HttpRequest.newBuilder(uri)
                .header("Content-Type", "application/json; charset=UTF-8")
                .POST(HttpRequest.BodyPublishers.ofString(bodyJson, StandardCharsets.UTF_8))
                .build();

        // [5] 전송 및 응답 수신
        HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

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

    private static int parseScore(String raw) {
        Matcher m = INT_PATTERN.matcher(raw == null ? "" : raw);
        if (m.find()) {
            int v = Integer.parseInt(m.group(1));
            return Math.max(0, Math.min(100, v));
        }
        return 0;
    }

    private static String nullToEmpty(String s) {
        return s == null ? "" : s;
    }
}