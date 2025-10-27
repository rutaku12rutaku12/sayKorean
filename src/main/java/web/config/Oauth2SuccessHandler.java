package web.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import web.model.dto.UserDto;
import web.service.UserService;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class Oauth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        System.out.println("request = " + request + ", response = " + response + ", authentication = " + authentication);

        // 로그인 성공한 회원의 타사 발급한 토큰 확인
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        System.out.println("authToken = " + authToken);

        // 로그인 성공한 회원 동의항목 정보
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        System.out.println("oAuth2User = " + oAuth2User);

        // 타사 로그인 인지 식별 , 서로 다른 회사별 동의항목
        String provider = authToken.getAuthorizedClientRegistrationId();
        System.out.println("provider = " + provider);

        String uid = null ; String name = null ;
        if( provider.equals("google")){
            uid = oAuth2User.getAttribute("email");
            name = oAuth2User.getAttribute("name");
        }
        else if( provider.equals("kakao")){
            Map<String, Object> kakaoAccount = oAuth2User.getAttribute("kakao_account");
            // 카카오 계정이 없거나 카카오계정에 이메일이 없을 경우
            if(kakaoAccount == null || kakaoAccount.get("email") == null){
                response.sendRedirect("http://localhost:5173/login");
            }
            uid = (String)kakaoAccount.get("email");
            System.out.println("uid = " + uid);
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
            name = (String)profile.get("nickname");
        }
        // oauth2 정보를 데이터베이스 저장
        UserDto userDto = userService.oauth2UserSignup( uid, name);


        HttpSession session = request.getSession(true);
        session.setAttribute("userNo", userDto.getUserNo());

        // 로그인 성공시 어딛로 이동할지 (프론트엔드 루트)
        response.sendRedirect("http://localhost:5173/home");
    }
}
