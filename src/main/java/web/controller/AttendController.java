package web.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.AttendDto;
import web.service.AttendService;

import java.util.List;

@RestController
@RequestMapping("/saykorean")
@RequiredArgsConstructor
public class AttendController {

    private final AttendService attendService;

    // [AT-1] 출석하기 attend()
    @PostMapping("/attend")
    public ResponseEntity<Integer> attend(@RequestBody AttendDto attendDto, HttpServletRequest request){
        // 세션 정보 가져오기
        HttpSession session = request.getSession();
        // 로그인 성공한 사용자 번호 확인
        if ( session == null || session.getAttribute("userNo")==null){
            return ResponseEntity.status(400).body(null);
        }
        // 모든 자료를 저장하기 위해 Object 타입으로 세션 저장
        Object obj = session.getAttribute("userNo");
        if ( obj == null) return ResponseEntity.status(400).body(null);
        int userNo = (int)obj;

        attendDto.setUserNo(userNo);

        int result = attendService.attend(attendDto);
        return ResponseEntity.status(200).body(result);

    }


    // [AT-2] 출석 조회 getAttend()
    @GetMapping("/attend")
    public ResponseEntity<List<AttendDto>> getAttend(HttpServletRequest request){
        // 세션 정보 가져오기
        HttpSession session = request.getSession();
        // 로그인 성공한 사용자 번호 확인
        if ( session == null || session.getAttribute("userNo")==null){
            return ResponseEntity.status(400).body(null);
        }
        // 모든 자료를 저장하기 위해 Object 타입으로 세션 저장
        Object obj = session.getAttribute("userNo");
        if ( obj == null) return ResponseEntity.status(400).body(null);
        int userNo = (int)obj;
        List<AttendDto> result = attendService.getAttend(userNo);
        return ResponseEntity.status(200).body(result);
    }
}
