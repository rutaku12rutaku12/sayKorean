//package web.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.client.SimpleClientHttpRequestFactory;
//import org.springframework.web.client.RestTemplate;
//
//@Configuration
//public class RestTemplateConfig {
//
//    @Bean
//    public RestTemplate restTemplate() {
//        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
//
//        // 타임아웃 설정 (이미지 생성은 시간이 걸릴 수 있음)
//        factory.setConnectTimeout(30000); // 30초
//        factory.setReadTimeout(60000);    // 60초
//
//        return new RestTemplate(factory);
//    }
//}