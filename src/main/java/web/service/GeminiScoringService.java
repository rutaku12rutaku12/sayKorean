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
    // 1~3자리 정수 추출용 정규식
    private static final Pattern INT_PATTERN = Pattern.compile("(\\d{1,3})");

    // JSON 파싱/생성기(필드 초기화)
    private final ObjectMapper om = new ObjectMapper();
    // HTTP 클라이언트(공용 인스턴스)
    private final HttpClient http = HttpClient.newHttpClient();


    // 점수 결과를 담는 레코드(불변 DTO): score(정수), rawText(모델 원문 응답)
    public record ScoreResult(int score, String rawText) {}

    // 채점 메서드: 문제, 기준정답, 사용자의 답, 언어 힌트를 받아 모델을 호출 후 점수만 뽑아 반환
    public ScoreResult score(String question, String groundTruth,
                             String userAnswer, String langHint) throws Exception {

        // [1] 환경 변수 로드: 지정한 JSON에서 키를 읽어 System.properties 등에 세팅
        // 시스템 속성에서 키 조회
        EnvLoader.loadJsonEnv("src/main/resources/env.app.json");

        String apiKey = System.getProperty("GOOGLE_API_KEY");
        // 비어 있으면 재시도 (현재는 같은 키를 다시 조회)
        if (apiKey == null || apiKey.isBlank()) {
            apiKey = System.getProperty("GOOGLE_API_KEY");
        }
        if (apiKey == null || apiKey.isBlank()) { // 여전히 비어 있으면 예외
            throw new IllegalStateException("Google API Key가 비어 있습니다. 환경변수를 확인하세요.");
        }

        // [2] 프롬프트 작성: 모델에게 "정수만 출력"을 강하게 요청 + 채점 기준과 입력 정보 제공
        String prompt = """
                점수는 반드시 0부터 100 사이의 정수로만 출력하세요.
                의미적 동등성, 문법, 관련성을 고려해 채점합니다.

                언어 힌트: %s
                문항: %s
                기준 정답: %s
                사용자 답변: %s
                """.formatted(
                nullToEmpty(langHint), // null 방지 처리
                nullToEmpty(question), // null 방지 처리
                nullToEmpty(groundTruth), // null 방지 처리
                nullToEmpty(userAnswer) // null 방지 처리
        );

        // [3] 요청 JSON 구성: Gemini v1beta generateContent 형식에 맞춘 body
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
        """.formatted(om.writeValueAsString(prompt)); // prompt를 JSON 문자열로 이스케이프해 삽입

        // [4] 요청 생성
        URI uri = URI.create("https://generativelanguage.googleapis.com/v1beta/models/"
                + MODEL + ":generateContent?key=" + apiKey);

        HttpRequest req = HttpRequest.newBuilder(uri)
                .header("Content-Type", "application/json; charset=UTF-8")
                .POST(HttpRequest.BodyPublishers.ofString(bodyJson, StandardCharsets.UTF_8))
                .build();

        // [5] 전송 및 응답 수신: 동기 방식으로 호출(예외 발생 가능)
        HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

        if (res.statusCode() / 100 != 2) { // 2xx(성공) 가 아니면 예외 처리
            throw new RuntimeException("Gemini API error: HTTP " + res.statusCode() + " - " + res.body());
        }

        // [6] 응답 파싱: candidates[0].content.parts[0].text 경로에서 텍스트 추출
        JsonNode root = om.readTree(res.body()); // 응답 문자열을 JSON 트리로 파싱
        String text = root.path("candidates") // candidates 배열 접근
                .path(0) // 첫 번째 후보
                .path("content") // content 객체
                .path("parts") // parts 배열
                .path(0) // 첫 번째 part
                .path("text") // text 필드
                .asText(""); // 문자열로 추출(없으면 빈문자열)

        int score = parseScore(text);  // 원문에서 첫 정수(0~100) 하나만 추출/클램프
        return new ScoreResult(score, text); // 점수와 원문 텍스트를 함께 반환
    }


    // 모델 응답 텍스트에서 1~3자리 정수 하나를 찾아 0~100 범위로 보정해 반환
    private static int parseScore(String raw) {
        Matcher m = INT_PATTERN.matcher(raw == null ? "" : raw); // null 방어 + 정규식 매칭 준비
        if (m.find()) {
            int v = Integer.parseInt(m.group(1)); // 첫 번째 숫자 파싱
            return Math.max(0, Math.min(100, v));// 0~100 범위로
        }
        return 0; // 숫자를 못 찾으면 0점 처리
    }


    // null-safe: null이면 빈문자열 반환
    private static String nullToEmpty(String s) {
        return s == null ? "" : s;
    } // 3항 연산자로 간단 처리
}