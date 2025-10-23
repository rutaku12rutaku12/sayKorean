package web.config;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class EnvInitializer {

    @PostConstruct
    public void init() {
        // 프로젝트 루트 or resources 둘 다 지원하도록 작성한 EnvLoader를 호출
        EnvLoader.loadJsonEnv("env.app.json"); // 파일명만 유지
        System.out.println("[BOOT] env.app.json loaded via @PostConstruct");
        System.out.println("[BOOT] user.dir = " + System.getProperty("user.dir"));
    }
}
