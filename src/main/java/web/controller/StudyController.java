package web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.model.dto.GenreDto;
import web.model.mapper.StudyMapper;
import web.service.StudyService;

import java.util.List;

@RestController
@RequestMapping("/saykorean/study")
@RequiredArgsConstructor
public class StudyController {

    private final StudyService studyService;


    // 사용자단 : 장르 목록 조회
    @GetMapping("/getGenre")
    public ResponseEntity< List< GenreDto > > getGenre() {
        return ResponseEntity.ok( studyService.getGenre() );
    }


}
