//package web.config;
//
//import io.swagger.v3.oas.models.OpenAPI;
//import io.swagger.v3.oas.models.info.Info;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class SwaggerConfig {
//
//    // 스웨거 입장 http://localhost:8080/swagger-ui/index.html
//    // * 시큐리티 사용할 경우, 시큐리티Config에 아래 코드 추가해야함!!!
//    /*
//        @Override
//        protected void configure(HttpSecurity http) throws Exception {
//            http
//                .authorizeHttpRequests()
//                    .requestMatchers(
//                        "/v3/api-docs/**",
//                        "/swagger-ui/**",
//                        "/swagger-ui.html"
//                    ).permitAll()
//                    .anyRequest().authenticated();
//        }
//     */
//
//    @Bean
//    public OpenAPI openAPI() {
//        return new OpenAPI()
//                .info(new Info()
//                        .title("재밌는한국어(SayKorean)")
//                        .description("재밌는한국어 API 명세서")
//                        .version("1.0.0"));
//
//
//    }
//}
