package web.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // application.properties에서 파일 업로드 경로 주입
    @Value("${upload.path}")
    private String uploadPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // URL 경로가 '/upload/**' 패턴으로 시작하는 모든 요청에 대해
        registry.addResourceHandler("/upload/**")
                // 실제 파일 시스템의 'uploadPath' 경로에서 파일을 찾아 제공함
                // 'file:///' 프리픽스는 Windows 절대 경로를 위해 슬래시 3개 사용
                .addResourceLocations("file:///" + uploadPath.replace("\\", "/"));

        // 디버깅을 위한 로그 출력 (개발 단계에서만 사용)
        System.out.println("=== WebConfig 설정 ===");
        System.out.println("Upload Path: " + uploadPath);
        System.out.println("Resource Location: file:///" + uploadPath.replace("\\", "/"));
    }
}
