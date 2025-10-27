package web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.service.I18nService;

import java.util.Map;

@RestController
@RequestMapping("/saykorean/i18n")
@RequiredArgsConstructor
public class I18nController {

    private final I18nService i18nService;

    // (네임스페이스 미사용 단일 JSON) /saykorean/i18n/en
    @GetMapping("/{lng}")
    public ResponseEntity<Map<String, String>> getTranslations(@PathVariable String lng) {
        Map<String, String> map = i18nService.getTranslations(lng);
        // 캐싱 헤더(선택)
        return ResponseEntity.ok()
                .header("Cache-Control", "public, max-age=300")
                .body(map);
    }
}