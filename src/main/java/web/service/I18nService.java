package web.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct; // Spring Boot 3.x/Jakarta 환경이면 jakarta.annotation.PostConstruct 로 변경 검토
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/*
 * I18nService
 * ------------------------------------------------------------
 * 역할:
 *  - 애플리케이션 시작 시(빈 초기화 시점) 언어별 i18n JSON을 모두 로드하여 메모리 캐시에 적재
 *  - 컨트롤러/서비스에서 언어코드(lng)로 번역 맵 전체 또는 특정 키를 조회
 *
 * 기대 JSON 위치:
 *  - classpath:i18n/<lang>.json (예: i18n/ko.json, i18n/en.json ...)
 *
 * JSON 예시(ko.json):
 *  {
 *    "language.title": "언어 선택",
 *    "mypage.title": "마이페이지"
 *  }
 *
 * 설계 포인트:
 *  - 캐시는 ConcurrentHashMap 으로 스레드 세이프
 *  - ObjectMapper 는 재사용(스레드 세이프)하여 성능/GC 효율 확보
 *  - 미존재 언어 요청 시 en(영어)로 폴백
 */
@Service
public class I18nService {

    // [캐시] 언어코드 -> (key -> value) 번역맵
    //  - ConcurrentHashMap: 다중 스레드 환경에서 안전한 읽기/쓰기
    private final Map<String, Map<String, String>> cache = new ConcurrentHashMap<>();

    // JSON 직렬화/역직렬화 담당
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 지원 언어 목록(파일명 규칙과 일치해야 함)
    //  - "zh-CN" 같이 하이픈 포함되는 코드도 허용
    private static final String[] SUPPORTED_LANGUAGES = {"ko", "en", "ja", "zh-CN", "es"};

    /*
     * 빈 초기화 직후 호출(@PostConstruct)
     * - 지원하는 모든 언어 JSON을 캐시에 미리 로드(워밍업)
     * - 일부 언어 로드 실패 시 전체 중단 X, 계속 진행하며 폴백(en) 사용
     */
    @PostConstruct
    public void init() {
        for (String lang : SUPPORTED_LANGUAGES) {
            try {
                loadLanguage(lang);
            } catch (IOException e) {
                System.err.println("Failed to load language: " + lang);
                e.printStackTrace();
                // 실패해도 계속 진행 (런타임 시 getTranslations()에서 en으로 폴백)
            }
        }
        System.out.println(" I18n initialized with " + cache.size() + " languages");
    }

    /*
     * 단일 언어 JSON 파일을 읽어 캐시에 적재
     *
     * 경로 규칙:
     *  - classpath:i18n/<lang>.json
     *    예) ko -> i18n/ko.json, en -> i18n/en.json
     *
     * @param lang 언어코드 (SUPPORTED_LANGUAGES 내 값)
     * @throws IOException 리소스 미존재/파싱 실패 등
     */
    private void loadLanguage(String lang) throws IOException {
        String path = "i18n/" + lang + ".json";
        ClassPathResource resource = new ClassPathResource(path);

        // try-with-resources: InputStream 자동 close
        try (InputStream is = resource.getInputStream()) {
            // JSON -> Map<String, String> 역직렬화
            Map<String, String> translations = objectMapper.readValue(
                    is,
                    new TypeReference<Map<String, String>>() {}
            );
            // 캐시에 반영(동일 키 존재 시 교체)
            cache.put(lang, translations);
        }
    }

    /*
     * 언어 전체 번역 맵 조회
     * - 요청한 언어가 캐시에 없으면 en(영어)로 폴백
     *
     * @param lng 요청 언어코드 (예: "ko", "en", "ja", "zh-CN", "es")
     * @return 번역 맵 (key -> value)
     */
    public Map<String, String> getTranslations(String lng) {
        // 1차: 그대로 조회
        Map<String, String> translations = cache.get(lng);
        if (translations != null) {
            return translations;
        }

        // 미등록 언어인 경우 경고 로그 + en 폴백
        System.out.println(" Language not found: " + lng + ", using fallback: en");
        // en도 없을 수 있으므로 new HashMap<>() 으로 최종 방어
        return cache.getOrDefault("en", new HashMap<>());
    }

    /*
     * 특정 키의 번역 조회
     * - 요청 키가 없을 경우 키 문자열 자체를 반환(개발/디버깅 중 누락 식별에 유용)
     *
     * @param lng 언어코드
     * @param key 번역 키 (예: "language.title")
     * @return 번역 문자열 or key 그대로
     */
    public String translate(String lng, String key) {
        Map<String, String> translations = getTranslations(lng);
        return translations.getOrDefault(key, key);
    }
}
