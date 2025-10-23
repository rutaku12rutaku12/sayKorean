package web.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.util.Map;

/*
 * env.local.json 파일을 읽어 System 환경변수로 등록하는 유틸리티 클래스
 */
public class EnvLoader {

    private static boolean loaded = false;

    public static void loadJsonEnv(String path) {
        if (loaded) return; // 중복 로드 방지
        try {
            File file = new File("src/main/resources/env.app.json");
            if (!file.exists()) {
                System.err.println("[WARN] " + path + " 파일이 존재하지 않습니다. 환경변수 로드 건너뜀");
                return;
            }

            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> env = mapper.readValue(file, Map.class);

            env.forEach((key, value) -> {
                if (System.getenv(key) == null && System.getProperty(key) == null) {
                    System.setProperty(key, value);
                    System.out.println("[ENV] " + key + " = " + maskValue(value));
                }
            });

            loaded = true;
        } catch (Exception e) {
            System.err.println("[ERROR] 환경변수 로드 실패: " + e.getMessage());
        }
    }

    private static String maskValue(String value) {
        if (value == null || value.length() <= 4) return "****";
        return value.substring(0, 2) + "****" + value.substring(value.length() - 2);
    }
}