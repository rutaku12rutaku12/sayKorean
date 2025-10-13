// DevAuthController.java
package web.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/saykorean/dev")
@RequiredArgsConstructor
@Profile("dev") // dev 프로필에서만 활성화 (application.properties에 spring.profiles.active=dev)
public class DevAuthController {

    @PostMapping("/loginAs")
    public ResponseEntity<?> loginAs(@RequestParam int userNo, @RequestParam int genreNo, HttpSession session) {
        session.setAttribute("userNo", userNo);
        session.setAttribute("selectedGenreNo", genreNo);
        return ResponseEntity.ok(Map.of(
                "SID", session.getId(),
                "userNo", userNo,
                "selectedGenreNo", genreNo
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity< Void > logout( HttpSession session ) {

        session.invalidate();
        return ResponseEntity.noContent().build();
    }
}
