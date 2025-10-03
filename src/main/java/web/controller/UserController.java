package web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.model.dto.UserDto;
import web.service.UserService;

@RestController
@RequestMapping("/saykorean")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // [US-01] 회원가입 signUp()
    @PostMapping("/signup")
    public ResponseEntity<Integer> signUp(@RequestBody UserDto userDto ){
        try {
            int result = userService.signUp(userDto);
            if (result >= 1) { // userNo 반환
                return ResponseEntity.status(200).body(userDto.getUserNo());
            } else {
                return ResponseEntity.status(400).body(0);
            }
        }catch (Exception e){
            return ResponseEntity.status(500).body(0);
        }

    } // func end
} // class end
