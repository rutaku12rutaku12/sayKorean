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
 *
 * 특징
 * - 외부 SDK(클라이언트 라이브러리) 설치 없이 Java 11+ 표준 HttpClient로 호출
 * - 모델 응답에서 "정수 점수(0~100)"만 정규식으로 안전하게 추출
 * - 점수 외에 모델 원문 텍스트(rawText)도 함께 반환하여 디버깅/로깅 가능
 *
 * 사용법(예시)
 *   ScoreResult r = geminiScoringService.score("문제", "기준정답", "사용자답", "ko");
 *   int score = r.score();     // 0~100
 *   String raw = r.rawText();  // 모델이 실제로 출력한 문자열
 */
@Service
@RequiredArgsConstructor
public class GeminiScoringService {

    // [모델명] Google Generative Language API(v1beta)에서 사용할 모델 이름
    //  - 필요한 경우 콘솔/문서에서 사용 가능한 모델 이름을 확인 후 교체
    private static final String MODEL = "gemini-2.5-flash";

    // [정수 추출 정규식] 1~3자리 정수(0~999)를 한 번만 뽑아내기 위한 패턴
    //  - "점수는 87점입니다" → "87" 매칭
    //  - 첫 매칭 숫자만 사용하며, 이후 0~100 범위로 보정(clamp)
    private static final Pattern INT_PATTERN = Pattern.compile("(\\d{1,3})");

    // [JSON 파서/생성기]
    //  - 문자열 ↔ JSON 트리 간 변환에 사용
    private final ObjectMapper om = new ObjectMapper();

    // [HTTP 클라이언트]
    //  - 애플리케이션 전역에서 재사용 가능한 HttpClient
    private final HttpClient http = HttpClient.newHttpClient();

    /*
     * 점수 결과를 담는 불변 DTO(자바 record)
     * @param score   0~100 사이 정수 점수(정규식 추출+클램프 결과)
     * @param rawText 모델 원문 응답 텍스트(디버깅/로깅 용도)
     */
    public record ScoreResult(int score, String rawText) {}

    /*
     * 채점 메서드
     *
     * @param question     문항(질문)
     * @param groundTruth  기준 정답(정답 문장/표현)
     * @param userAnswer   사용자 답변
     * @param langHint     언어 힌트(예: "ko", "en" 또는 "한국어", "영어" 등 설명 텍스트)
     * @return             ScoreResult(점수, 모델 원문 응답)
     * @throws Exception   네트워크 오류/인증 오류/JSON 파싱 오류 등
     *
     * 동작 순서
     *  1) 환경 변수/설정에서 API 키 로드
     *  2) 모델에 줄 지시문(prompt) 구성(반드시 정수만 출력하도록 강요)
     *  3) Gemini v1beta generateContent 포맷으로 요청 JSON 생성
     *  4) HTTP POST 요청 전송
     *  5) 응답 코드 검사(2xx 아니면 예외)
     *  6) JSON 파싱 → 텍스트 추출
     *  7) 정규식으로 첫 정수 추출 → 0~100 클램프
     *  8) 점수와 원문 텍스트를 함께 반환
     */
    public ScoreResult score(String question, String groundTruth,
                             String userAnswer, String langHint) throws Exception {

        // [1] 환경 변수/설정 로드
        // - EnvLoader는 "src/main/resources/env.app.json" 파일을 읽어
        //   System.properties 등에 키를 주입하는 유틸이라고 가정
        EnvLoader.loadJsonEnv("src/main/resources/env.app.json");

        // - GOOGLE_API_KEY 시스템 속성에서 키 조회
        //   (OS 환경변수 등 다른 경로로 넣어두었다면 그쪽에서 바로 노출됨)
        String apiKey = System.getProperty("GOOGLE_API_KEY");

        // - 비어있으면 재시도(여기서는 동일 키를 다시 조회하지만, 필요시 다른 소스도 확인 가능)
        if (apiKey == null || apiKey.isBlank()) {
            apiKey = System.getProperty("GOOGLE_API_KEY");
        }

        // - 여전히 비어 있으면 명확한 에러를 던져 빠르게 원인 파악 가능
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Google API Key가 비어 있습니다. 환경변수를 확인하세요.");
        }

        // [2] 프롬프트(지시문) 작성
        // - 모델에게 "정수만 출력"하도록 강한 제약을 명시
        // - 채점 기준(의미적 동등성, 문법, 관련성)을 간단히 제시
        // - null 방어(nullToEmpty)로 JSON 직렬화 시 NPE/누락 방지
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

        // [3] 요청 JSON 구성(Gemini v1beta: generateContent 포맷)
        // - contents[0].parts[0].text 에 사용자 프롬프트를 넣는 형식
        // - prompt를 JSON 안전 문자열로 이스케이프(om.writeValueAsString)
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
        // - :generateContent 엔드포인트로 POST
        // - key 쿼리 파라미터에 API 키 포함
        URI uri = URI.create("https://generativelanguage.googleapis.com/v1beta/models/"
                + MODEL + ":generateContent?key=" + apiKey);

        HttpRequest req = HttpRequest.newBuilder(uri)
                .header("Content-Type", "application/json; charset=UTF-8")
                .POST(HttpRequest.BodyPublishers.ofString(bodyJson, StandardCharsets.UTF_8))
                .build();

        // [5] 동기 전송 및 응답 수신
        // - 네트워크 오류/타임아웃 등 Exception 발생 가능
        HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

        // - HTTP 2xx(성공)가 아니면 런타임 예외로 실패 처리(상위 레이어에서 핸들링)
        if (res.statusCode() / 100 != 2) {
            // 서버가 준 에러 메시지(res.body())를 그대로 포함 → 원인 파악 용이
            throw new RuntimeException("Gemini API error: HTTP " + res.statusCode() + " - " + res.body());
        }

        // [6] 응답 파싱
        // - 일반적으로 candidates[0].content.parts[0].text 에 모델 출력이 존재
        //   (모델/버전에 따라 구조가 달라질 수 있으므로 .path() 체인으로 안전 접근)
        JsonNode root = om.readTree(res.body());
        String text = root.path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText(""); // 존재하지 않으면 빈 문자열 반환(NullPointerException 방지)

        // [7] 점수 추출
        // - 모델 응답 문자열에서 가장 먼저 등장하는 1~3자리 정수를 찾아 파싱
        // - 0~100 범위로 클램프(이상치/실수 방지)
        int score = parseScore(text);

        // [8] 결과 반환
        // - score: 정수 점수(0~100)
        // - rawText: 모델 원문(로깅/디버깅용)
        return new ScoreResult(score, text);
    }

    /*
     * 모델 응답 텍스트에서 1~3자리 정수 하나를 찾아 0~100 범위로 보정해 반환
     *
     * @param raw 모델이 출력한 원문 텍스트(문장)
     * @return    0~100 사이 정수. 숫자 미검출 시 0
     *
     * 동작
     *  1) null 방어 후 정규식 매칭
     *  2) 첫 번째 숫자 그룹만 파싱
     *  3) Math.max/min으로 하한(0)/상한(100) 보정
     */
    private static int parseScore(String raw) {
        // null → "" 로 치환 후 매칭 준비
        Matcher m = INT_PATTERN.matcher(raw == null ? "" : raw);

        if (m.find()) {
            // 첫 번째 매칭된 숫자 그룹 가져오기
            int v = Integer.parseInt(m.group(1));
            // 0~100 범위로 클램프하여 반환
            return Math.max(0, Math.min(100, v));
        }

        // 아예 숫자가 없으면 0점 처리(보수적 디폴트)
        return 0;
    }

    /*
     * null-safe 유틸
     * @param s 입력 문자열(또는 null)
     * @return  null이면 ""(빈 문자열), 아니면 원본
     *
     * JSON 직렬화/문자열 연결 시 null로 인한 예외/누락을 방지
     */
    private static String nullToEmpty(String s) {
        return s == null ? "" : s;
    }
}
