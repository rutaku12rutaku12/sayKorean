package web.controller;


import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.ExamDto;
import web.model.dto.GenreDto;
import web.model.dto.LanguageDto;
import web.model.dto.StudyDto;
import web.service.StudyService;
import web.service.UserService;

import java.util.List;
@RestController
@RequestMapping("/saykorean/study")
@RequiredArgsConstructor
public class StudyController {

    private final StudyService studyService;


    // [1] 장르 목록
    @GetMapping("/getGenre")
    public ResponseEntity<List<GenreDto>> getGenre() {
        return ResponseEntity.ok(studyService.getGenre());
    }


    //[2] 주제 목록 조회 (장르 + 언어 선택)
    @GetMapping("/getSubject")
    public ResponseEntity<List<StudyDto>> getSubject(
            @RequestParam @Positive int genreNo,
            @RequestParam(defaultValue = "1") int langNo // localStorage 언어번호
    ) {
        return ResponseEntity.ok(studyService.getSubject(genreNo, langNo));
    }


    //[3] 언어 목록 조회
    @GetMapping("/getlang")
    public ResponseEntity<List<LanguageDto>> getLang() {
        return ResponseEntity.ok(studyService.getLang());
    }


    // [4] 특정 주제 상세(주제 + 해설) 조회
    @GetMapping("/getDailyStudy")
    public ResponseEntity<?> getDailyStudy(
            @RequestParam @Positive int studyNo,
            @RequestParam(defaultValue = "1") int langNo
    ) {
        var dto = studyService.getDailyStudy(studyNo, langNo);
        return (dto == null)
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(dto);
    }


    // [5] 주제에 맞는 예문 조회
    @GetMapping("/getDailyStudy2")
    public ResponseEntity<List<ExamDto>> getDailyStudy2(
            @RequestParam @Positive int studyNo,
            @RequestParam(defaultValue = "1") int langNo
    ) {
        return ResponseEntity.ok(studyService.getDailyStudy2(studyNo, langNo));
    }
}
