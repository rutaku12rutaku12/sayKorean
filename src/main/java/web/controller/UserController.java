package web.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    // [US-02] 로그인 logIn()
    @PostMapping("/login")
    public ResponseEntity<Integer> logIn(@RequestBody UserDto userDto, HttpServletRequest request){
        // 세션 정보 가져오기
        HttpSession session = request.getSession();
        // 로그인 성공한 회원번호 확인
        int result = userService.logIn(userDto);
        if( result>0){
            session.setAttribute("userNo",result);
            return ResponseEntity.status(200).body(result);
        }else {return ResponseEntity.status(400).body(result);}
    } // func end

    // [US-03] 로그아웃
    @GetMapping("/logout")
    public ResponseEntity<Integer> logOut(HttpServletRequest request){
        HttpSession session = request.getSession();
        if( session == null || session.getAttribute("userNo")==null ){
            return ResponseEntity.status(400).body(0);
        }
        session.removeAttribute("userNo");
        return ResponseEntity.status(200).body(1);
    }

} // class end
