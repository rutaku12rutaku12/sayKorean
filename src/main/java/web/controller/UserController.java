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

    // [US-03] 로그아웃 logOut()
    @GetMapping("/logout")
    public ResponseEntity<Integer> logOut(HttpServletRequest request){
        HttpSession session = request.getSession();
        // 이미 세션이 없거나 유저번호가 없으면 로그아웃 실패
        if( session == null || session.getAttribute("userNo")==null ){
            return ResponseEntity.status(400).body(0);
        }
        // 세션이 제거되면 로그아웃 성공
        session.removeAttribute("userNo");
        return ResponseEntity.status(200).body(1);
    }

    // [US-04] 내 정보 조회( 로그인 중인 사용자정보 조회 ) info()
    @GetMapping("/info")
    public ResponseEntity<UserDto> info( HttpServletRequest request ){
        // 로그인 된 세션 정보 가져오기
        HttpSession session = request.getSession();
        // 세션이 없거나 세션내 userNo 값이 없으면 null 반환
        if( session == null || session.getAttribute("userNo")==null){
            return ResponseEntity.status(400).body(null);}
        // 모든 자료를 저장하기 위해 Object 타입으로 세션 저장
        Object obj = session.getAttribute("userNo");
        if( obj == null ) ResponseEntity.status(400).body(null);
        int userNo = (int)obj;
        // 서비스에게 전달하고 응답 받기
        UserDto result = userService.info(userNo);
        return ResponseEntity.status(200).body(result);
    } // func end

    // [US-05] 이메일 중복검사 checkEmail()
    @GetMapping("/checkemail")
    public ResponseEntity<Integer> checkEmail(@RequestParam String email){
        int result = userService.checkEmail(email);
        if( result >0 ) {
            return ResponseEntity.status(200).body(result);
        }
        else return ResponseEntity.status(400).body(0);
    } // func end

    // [US-06] 연락처 중복검사 checkPhone()
    @GetMapping("/checkphone")
    public ResponseEntity<Integer> checkPhone(@RequestParam String phone){
        int result = userService.checkPhone(phone);
        if( result >0 ) {
            return ResponseEntity.status(200).body(result);
        }
        else return ResponseEntity.status(400).body(0);
    } // func end

    // [US-07] 이메일 찾기 findEmail()
    @GetMapping("/findemail")
    public ResponseEntity<String> findEmail(@RequestParam String name,@RequestParam String phone){
        String result = userService.findEmail(name,phone);
        if( result == null){return ResponseEntity.status(400).body("올바른 값을 입력해주세요.");}
        return ResponseEntity.status(200).body(result);
    } // func end

    // [US-08] 비밀번호 찾기 findPwrd()
    @GetMapping("/findpwrd")
    public ResponseEntity<String> findPwrd(@RequestParam String name, @RequestParam String phone, @RequestParam String email){
        String result = userService.findPwrd(name, phone, email);
        if( result == null){return ResponseEntity.status(400).body("올바른 값을 입력해주세요.");}
        return ResponseEntity.status(200).body(result);
    } // func end

    // US-09 회원정보 수정 updateUserInfo()
    @PutMapping("/updateuserinfo")
    public ResponseEntity<Integer> updateUserInfo(@RequestBody UserDto userDto , HttpServletRequest request ){
        // 세션 객체 꺼내기
        HttpSession session = request.getSession();
        // 만약 세션이 없거나 로그인이 안되어 있으면 null
        if( session == null || session.getAttribute("userNo")== null){
            return ResponseEntity.status(400).body(0);
        }
        // 로그인된 사용자번호 꺼내기 = 수정하는 사용자의 번호
        Object obj = session.getAttribute("userNo");
        if ( obj == null ){
            return ResponseEntity.status(400).body(0);
        }
        int userNo = (int)obj;
        // dto 담아주기
        userDto.setUserNo(userNo);
        int result = userService.updateUserInfo(userDto);
        return ResponseEntity.status(200).body(result);
    } // func end


} // class end
