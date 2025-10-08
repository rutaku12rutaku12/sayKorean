package web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.AttendDto;
import web.service.AttendService;

@RestController
@RequestMapping("/saykorean")
@RequiredArgsConstructor
public class AttendController {

    private final AttendService attendService;

    // [AT-1] 출석하기 attend()
    @PostMapping("/attend")
    public ResponseEntity<Integer> attend(@RequestBody AttendDto attendDto){
        int result = attendService.attend(attendDto);
        return ResponseEntity.status(200).body(result);
    }


    // [AT-2] 출석 조회 getAttend()
    @GetMapping("/attend")
    public ResponseEntity<Integer> getAttend(@RequestParam AttendDto attendDto){
        int result = attendService.getAttend(attendDto);
        return ResponseEntity.status(200).body(result);
    }
}
