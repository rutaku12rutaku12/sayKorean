package web.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // 설정 관련 빈(객체) 등록
public class CorsConfig implements WebMvcConfigurer{
    // 스프링 웹 MVC 설정 '구현'
    // (1) CORS 관련 매핑 설정
    @Override
    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/허용할 컨트롤러 URL")          : /** 넣으면 전체 허용
//                .allowedOrigins("허용할 출처/도메인")        : * 모든출처
//                .allowedMethods("허용할 HTTP메소드");       : * 모든 메소드
//                .allowCredentials(true);                 : HTTP 인증(세션 유지) 허용
//                .allowedHeaders("*");                    : HTTP 헤더 정보 허용
        registry.addMapping("/axios/**")
                .allowedOrigins("http://localhost:5173" , "http://localhost:5174")
                .allowedMethods("GET","POST","PUT","DELETE")
                .allowCredentials(true)
                .allowedHeaders("*");
        // ...

    }
}
