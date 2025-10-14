package web.controller;


import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.ExamDto;
import web.model.dto.GenreDto;
import web.model.dto.StudyDto;
import web.service.StudyService;
import web.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/saykorean/study")
@RequiredArgsConstructor
public class StudyController {
    // 로그인 확인 : { "email" : "user01@example.com" , "password" : "pass#01!" }

    private final StudyService studyService;
    private final UserService userService;


    // 장르 목록
    @GetMapping("/getGenre")
    public ResponseEntity< List< GenreDto > > getGenre(){
        return ResponseEntity.ok( studyService.getGenre() );
    }



    // 장르 선택( 세션 저장만 x, user테이블에 DB 저장도 함께 해야함 )
    // 왜 talend 테스트 204가 뜰까? 값만 저장하고(세션/DB) 바디는 안 돌려주는 PUT이기 때문
    @GetMapping("/getSubject")
    public ResponseEntity<List<StudyDto>> getSubject( @RequestParam @Positive int genreNo) {
        return ResponseEntity.ok(studyService.getSubject(genreNo));
    }


    // 3) 특정 주제 상세(주제/해설) 조회
    @GetMapping("/getDailyStudy")
    // @Positive : 양수 보장
    public ResponseEntity<?> getDailyStudy( @RequestParam @Positive int studyNo ) {
        var dto = studyService.getDailyStudy(studyNo);
        return (dto == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(dto);
    }


    // 주제에 맞는 예문 조회
    // 일단은 DB저장 없이 조회만 가능
    @GetMapping("/getDailyStudy2")
    public ResponseEntity< List<ExamDto> > getDailyStudy2( @RequestParam @Positive int studyNo ){
        return ResponseEntity.ok( studyService.getDailyStudy2( studyNo ) );
    }
}
