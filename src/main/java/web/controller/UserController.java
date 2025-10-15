package web.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import web.model.dto.*;
import web.service.UserService;

@RestController
@RequestMapping("/saykorean")
@RequiredArgsConstructor
@Validated // dto가 아닌 param 검증 활성화 어노테이션
public class UserController {

    private final UserService userService;

    // [US-01] 회원가입 signUp()
    @PostMapping("/signup")              // @Valid : dto에 @NotBlank, @Email 등등 어노테이션 활성화 어노테이션
    public ResponseEntity<Integer> signUp(@Valid @RequestBody UserDto userDto ){
        try {
            int result = userService.signUp(userDto);
            if (result >= 1) { // userNo 반환
                return ResponseEntity.status(200).body(userDto.getUserNo());
            } else {
                return ResponseEntity.status(400).body(0);
            }
        }catch (Exception e){ e.printStackTrace();
            return ResponseEntity.status(500).body(0);
        }
    } // func end

    // [US-02] 로그인 logIn()
    @PostMapping("/login")
    public ResponseEntity<Integer> logIn(@Valid @RequestBody LoginDto loginDto, HttpServletRequest request ){
        // 세션 정보 가져오기
        HttpSession session = request.getSession();
        // 로그인 성공한 회원번호 확인
        int result = userService.logIn(loginDto);
        if( result>0){
            session.setAttribute("userNo",result);
            return ResponseEntity.status(200).body(result);
        }else {return ResponseEntity.status(400).body(result);}
    } // func end

    // [US-03] 로그아웃 logOut()
    @GetMapping("/logout")
    public ResponseEntity<Integer> logOut(HttpServletRequest request){
        HttpSession session = request.getSession();
        System.out.println("세션 있음? " + (session != null));
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
        if( obj == null ) return ResponseEntity.status(400).body(null);
        int userNo = (int)obj;
        // 서비스에게 전달하고 응답 받기
        UserDto result = userService.info(userNo);
        return ResponseEntity.status(200).body(result);
    } // func end

    // [US-05] 이메일 중복검사 checkEmail()
    @GetMapping("/checkemail")                 // @Email 형식 유효성검사 어노테이션
    public ResponseEntity<Integer> checkEmail(@Email(message = "올바른 이메일 형식이 아닙니다.")
                                                // @NotBlack null 값 빈칸 입력 차단 어노테이션
                                                  @NotBlank @RequestParam String email){
        // 이메일이 null이거나, 공백 또는 빈 문자열일 때 -1 반환
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.status(400).body(-1);
        }
        int result = userService.checkEmail(email);
            return ResponseEntity.status(200).body(result);
    } // func end

    // [US-06] 연락처 중복검사 checkPhone()
    @GetMapping("/checkphone")                  // @Pattern 정규식 유효성 어노테이션
    public ResponseEntity<Integer> checkPhone(@Pattern(regexp = "^\\+?[1-9]\\d{7,14}$", message = "올바른 휴대폰 번호를 입력해주세요.")
                                                  @NotBlank @RequestParam String phone){
        if (phone == null || phone.trim().isEmpty()) {
            return ResponseEntity.status(400).body(-1);
        }
        int result = userService.checkPhone(phone);
            return ResponseEntity.status(200).body(result);
    } // func end

    // [US-07] 이메일 찾기 findEmail()
    @GetMapping("/findemail")
    public ResponseEntity<String> findEmail(@NotBlank @RequestParam String name, @Pattern(regexp = "(^\\+?[1-9]\\d{1,14}$)", message = "올바른 휴대폰 번호를 입력해주세요.")
    @NotBlank @RequestParam String phone){
        String result = userService.findEmail(name,phone);
        if( result == null){return ResponseEntity.status(400).body("올바른 값을 입력해주세요.");}
        return ResponseEntity.status(200).body(result);
    } // func end

    // [US-08] 비밀번호 찾기 findPwrd()
    @GetMapping("/findpwrd")
    public ResponseEntity<String> findPwrd(@NotBlank @RequestParam String name, @Pattern(regexp = "(^\\+?[1-9]\\d{1,14}$)", message = "올바른 휴대폰 번호를 입력해주세요.")
    @NotBlank @RequestParam String phone, @NotBlank @RequestParam String email){
        String result = userService.findPwrd(name, phone, email);
        if( result == null){return ResponseEntity.status(400).body("올바른 값을 입력해주세요.");}
        return ResponseEntity.status(200).body(result);
    } // func end

    // [US-09] 회원정보 수정 updateUserInfo()
    @PutMapping("/updateuserinfo")
    public ResponseEntity<Integer> updateUserInfo(@Valid @RequestBody UpdateUserInfoDto updateUserInfoDto , HttpServletRequest request ){
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
        updateUserInfoDto.setUserNo(userNo);
        int result = userService.updateUserInfo(updateUserInfoDto);
        return ResponseEntity.status(200).body(result);
    } // func end

    // [US-10] 비밀번호 수정 updatePwrd()
    @PutMapping("/updatepwrd")
    public ResponseEntity<Integer> updatePwrd(@Valid @RequestBody UpdatePwrdDto updatePwrdDto , HttpServletRequest request){
        // 세션 객체 꺼내기
        HttpSession session = request.getSession();
        // 만약 세션이 없거나 로그인이 안되어 있으면 null
        if( session == null || session.getAttribute("userNo") ==null ){
            return ResponseEntity.status(400).body(0);
        }
        // 로그인된 사용자번호 꺼내기 = 수정하는 사용자의 번호
        Object obj = session.getAttribute("userNo");
        if ( obj == null ){
            return ResponseEntity.status(400).body(0);
        }
        int userNo = (int)obj;
        // dto 담아주기
        updatePwrdDto.setUserNo(userNo);
        int result = userService.updatePwrd(updatePwrdDto);
        return ResponseEntity.status(200).body(result);
    } // func end

    // [US-11] 회원상태 수정(삭제) deleteUserStatus()
    @PutMapping("/deleteuser")
    public ResponseEntity<Integer> deleteUserStatus(@Valid @RequestBody DeleteUserStatusDto deleteUserStatusDto, HttpServletRequest request){
        HttpSession session = request.getSession();
        if(session==null || session.getAttribute("userNo")==null){
            return ResponseEntity.status(400).body(0);
        }
        Object obj = session.getAttribute("userNo");
        if(obj == null){
            return ResponseEntity.status(400).body(0);
        }
        int userNo = (int)obj;
        deleteUserStatusDto.setUserNo(userNo);
        int result = userService.deleteUserStatus(deleteUserStatusDto);
        if( result > 0){
        // 회원상태 수정(삭제) 후 세션 제거 : 로그아웃 상태로
        session.removeAttribute("userNo");
        return ResponseEntity.status(200).body(result);
        }
        else return ResponseEntity.status(400).body(0);
    }

//    // getGenreNo
//    @GetMapping("/me/genre")
//    public ResponseEntity<?> getGenreNo(HttpSession session) {
//        Integer userNo = (Integer) session.getAttribute("userNo");
//        if (userNo == null) return ResponseEntity.status(401).build();
//
//        Integer genreNo = userService.getGenreNo(userNo); // DB에서 읽음
//        if (genreNo == null) return ResponseEntity.notFound().build();
//
//        return ResponseEntity.ok(genreNo);
//    }
//
//    // 선호 장르 변경
//    @PutMapping("/me/genre")
//    public ResponseEntity<Void> updateGenre(@RequestParam int genreNo, HttpSession session) {
//        Integer userNo = (Integer) session.getAttribute("userNo");
//        if (userNo == null) return ResponseEntity.status(401).build();
//
//        userService.updateGenre(userNo, genreNo); // DB 업데이트
//
//        return ResponseEntity.noContent().build(); // 204
//    }



} // class end
