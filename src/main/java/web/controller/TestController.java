package web.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.RankingDto;
import web.model.dto.TestDto;
import web.model.dto.TestItemDto;
import web.service.TestService;

import java.util.List;

@RestController
@RequestMapping("/saykorean/test")
@RequiredArgsConstructor
public class TestController { // class start

    private final TestService testService;

    @GetMapping("")
    public ResponseEntity<List<TestDto>> getListTest( @RequestParam int studyNo ){
        return ResponseEntity.ok( testService.getListTest( studyNo ) );
    }

    @GetMapping("/findtestitem")
    public ResponseEntity< List<TestItemDto>> findTestItem( @RequestParam int testNo  ){
        return ResponseEntity.ok( testService.findTestItem( testNo ) );
    }

    @PostMapping("")
    public ResponseEntity<Integer> upsertRanking( @RequestBody RankingDto dto ){
        return ResponseEntity.ok( testService.upsertRanking( dto ) );
    }

    @GetMapping("/getscore")
    public ResponseEntity<RankingDto> getScore( @RequestParam int userNo , @RequestParam int testNo , @RequestParam int testRound ){
        return ResponseEntity.ok( testService.getScore( userNo , testNo , testRound ) );
    }

}
