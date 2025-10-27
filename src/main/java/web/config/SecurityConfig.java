package web.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.Cookie;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import static org.apache.tomcat.util.net.openssl.OpenSSLStatus.setName;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final Oauth2SuccessHandler oauth2SuccessHandler;

    // 시큐리티 필터 커스텀
    @Bean
    public SecurityFilterChain filterChain( HttpSecurity http ) throws Exception{

        // HTTP 요청에 따른 권한 커스텀 , 모든 권한 허용
        http.authorizeHttpRequests(auth -> auth
                // 만약 권한 설정 한다면 로그인,회원가입,이메일/비밀번호 찾기 경로에만 모든 궝한 주기!
//                .requestMatchers("/saykorean/**").hasAnyRole("USER","ADMIN")
//                .requestMatchers("/saykorean/admin/**").hasAnyRole("ADMIN")
                .requestMatchers("/**").permitAll() );

        // HTTP 요청에 csrf(요청간의 해킹 공격) POST,PUT 자동 차단 커스텀
        http.csrf( csrf-> csrf.disable() );

        // Oauth2 로그인 필터 사용 설정
        http.oauth2Login(o->o
                .loginPage("/login")
                .successHandler(oauth2SuccessHandler) // 타 로그인 페이지에서 로그인 성공시 반환되는 클래스
        );

        // 시큐리티의 CORS 정책을 기본 설정하기
        http.cors(Customizer.withDefaults() );

        return http.build(); // 커스텀 완료된 객체 반환

    } // m end

} // c end
