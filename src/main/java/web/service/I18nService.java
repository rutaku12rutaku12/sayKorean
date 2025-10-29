package web.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class I18nService {

    // 캐시: 언어별 번역 데이터 저장
    private final Map<String, Map<String, String>> cache = new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper = new ObjectMapper();

    // 지원 언어 목록
    private static final String[] SUPPORTED_LANGUAGES = {"ko", "en", "ja", "zh-CN", "es"};

    /**
     * 애플리케이션 시작 시 모든 JSON 파일을 메모리에 로드
     */
    @PostConstruct
    public void init() {
        for (String lang : SUPPORTED_LANGUAGES) {
            try {
                loadLanguage(lang);
            } catch (IOException e) {
                System.err.println("Failed to load language: " + lang);
                e.printStackTrace();
                // 실패해도 계속 진행 (fallback은 en 사용)
            }
        }
        System.out.println("✅ I18n initialized with " + cache.size() + " languages");
    }

    /**
     * JSON 파일에서 번역 데이터 로드
     */
    private void loadLanguage(String lang) throws IOException {
        String path = "i18n/" + lang + ".json";
        ClassPathResource resource = new ClassPathResource(path);

        try (InputStream is = resource.getInputStream()) {
            Map<String, String> translations = objectMapper.readValue(
                    is,
                    new TypeReference<Map<String, String>>() {}
            );
            cache.put(lang, translations);
        }
    }

    /**
     * 번역 데이터 조회 (Controller에서 호출)
     */
    public Map<String, String> getTranslations(String lng) {
        // 캐시에서 조회
        Map<String, String> translations = cache.get(lng);

        if (translations != null) {
            return translations;
        }

        // 없으면 영어 fallback
        System.out.println("⚠️ Language not found: " + lng + ", using fallback: en");
        return cache.getOrDefault("en", new HashMap<>());
    }

    /**
     * 특정 키의 번역 조회 (선택적으로 사용)
     */
    public String translate(String lng, String key) {
        Map<String, String> translations = getTranslations(lng);
        return translations.getOrDefault(key, key); // 없으면 키 그대로 반환
    }
}