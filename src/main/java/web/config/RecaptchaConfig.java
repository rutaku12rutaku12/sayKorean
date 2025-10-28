package web.config;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import org.springframework.context.annotation.Configuration;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

@Configuration
public class RecaptchaConfig {

    // 구글 reCAPTCHA 검증 요청을 보낼 때 사용할 기본 URL
    public static final String url = "https://www.google.com/recaptcha/api/siteverify";

    // HTTP 요청 시, 브라우저처럼 보이게 하기 위해 사용하는 User-Agent 값
    private final static String USER_AGENT = "Mozilla/5.0";

    // 구글 비밀키 저장용 변수
    private static String secret;

    // 비밀키 설정
    public static void setSecretKey(String key) {
        secret = key;
    }

    // 구글 reCAPTCHA의 응답 토큰(gRecaptchaResponse)을 받아서 실제 유효한지 검증하는 함수
    public static boolean verify(String gRecaptchaResponse) throws IOException {
        // 사용자가 보낸 응답이 비어있거나 null이면 검증할 필요 없으므로 false 반환
        if (gRecaptchaResponse == null || gRecaptchaResponse.isEmpty()) {
            return false;
        }

        try {
            // 구글 서버 연결
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();

            // HTTP 연결을 열어서 POST 방식으로 요청할 준비
            con.setRequestMethod("POST");
            // User-Agent 헤더를 추가해서 브라우저처럼 요청하도록 설정
            con.setRequestProperty("User-Agent", USER_AGENT);

            // 구글에 보낼 데이터 (비밀키 + 사용자의 reCAPTCHA 응답 토큰)
            String postParams = "secret=" + secret + "&response=" + gRecaptchaResponse;

            // POST 요청을 실제로 보낼 수 있도록 설정
            con.setDoOutput(true);
            // 데이터를 구글 서버로 전송
            try (DataOutputStream wr = new DataOutputStream(con.getOutputStream())) {
                wr.writeBytes(postParams);
            }

            // 구글 서버로부터 응답을 받을 준비
            StringBuilder response = new StringBuilder();
            try (BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()))) {
                String line;
                // 응답을 한 줄씩 읽어서 StringBuilder에 저장
                while ((line = in.readLine()) != null) {
                    response.append(line);
                }
            }

            // 받은 응답은 JSON 형태이므로 파싱을 위해 JsonReader 사용
            JsonReader reader = Json.createReader(new StringReader(response.toString()));
            JsonObject json = reader.readObject();
            reader.close();


            // JSON 객체에서 "success" 키의 값을 가져옴 (true면 인증 성공)
            System.out.println("Recaptcha json = " + json);
            return json.getBoolean("success");

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
