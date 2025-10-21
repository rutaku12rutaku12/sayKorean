package web.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

//GeminiScoringService
// Google Gemini REST API 호출 → 0~100 점수 반환
@Service
@RequiredArgsConstructor
public class GeminiScoringService {

    private static final String MODEL = "gemini-1.5-flash";
    private static final Pattern INT_PATTERN = Pattern.compile("(\\d{1,3})");

    private final ObjectMapper om = new ObjectMapper();
    private final HttpClient http = HttpClient.newHttpClient();

    public record ScoreResult(int score, String rawText) {}

    // question(문항) + groundTruth(기준정답) + userAnswer(사용자답) → 0~100 점수

    public ScoreResult score(String question, String groundTruth, String userAnswer, String langHint) throws Exception {
        String apiKey = System.getenv("GOOGLE_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GOOGLE_API_KEY 환경변수가 비어 있습니다.");
        }

        String prompt = """
                점수는 0부터 100 사이의 정수로만 매깁니다!
                의미적 동등성, 문법, 관련성을 고려해서 채점하겠습니다!
                Consider semantic equivalence, grammar, and relevance.

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

        // Google AI Studio REST: POST /v1beta/models/...:generateContent
        URI uri = URI.create("https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent?key=" + apiKey);

        String bodyJson = om.createObjectNode()
                .putArray("contents")
                .addObject()
                .putArray("parts")
                .addObject()
                .put("text", prompt)
                .toString();

        HttpRequest req = HttpRequest.newBuilder(uri)
                .header("Content-Type", "application/json; charset=UTF-8")
                .POST(HttpRequest.BodyPublishers.ofString(bodyJson, StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
        if (res.statusCode() / 100 != 2) {
            throw new RuntimeException("Gemini API error: HTTP " + res.statusCode() + " - " + res.body());
        }

        JsonNode root = om.readTree(res.body());
        String text = root.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText("");
        int score = parseScore(text);

        return new ScoreResult(score, text);
    }

    // ㅜparseScore()는 비정상 응답에도 0점 fallback → 안정적
    private static int parseScore(String raw) {
        Matcher m = INT_PATTERN.matcher(raw);
        if (m.find()) {
            int v = Integer.parseInt(m.group(1));
            if (v < 0) v = 0;
            if (v > 100) v = 100;
            return v;
        }
        return 0;
    }

    private static String nullToEmpty(String s) { return s == null ? "" : s; }
}
