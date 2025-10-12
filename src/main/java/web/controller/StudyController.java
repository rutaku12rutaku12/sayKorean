package web.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.dto.ExamDto;
import web.model.dto.GenreDto;
import web.service.StudyService;
import web.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/saykorean/study")
@RequiredArgsConstructor
public class StudyController {

    private final StudyService studyService;
    private final UserService userService;


    // 장르 목록
    @GetMapping("/getGenre")
    public ResponseEntity< List< GenreDto > > getGenre(){
        return ResponseEntity.ok( studyService.getGenre() );
    }



    // 장르 선택( 세션 저장만 x, user테이블에 DB 저장도 함께 해야함 )
    @PutMapping("/users/me/genre")
    public ResponseEntity<Void> updatePreferredGenre(@RequestParam int genreNo, HttpSession session) {
        Integer userNo = (Integer) session.getAttribute("loginUserNo");
        if (userNo == null) return ResponseEntity.status(401).build();

//        userService.updateGenre(userNo, genreNo);  // DB 저장
        session.setAttribute("selectedGenreNo", genreNo);   // 세션
        return ResponseEntity.noContent().build();
    }


    // 주제와 해설 조회  + 선택한 주제 저장
    @GetMapping("/getDailyStudy")
    // required = false : 쿼리스트링에 themeNo가 안 와도 에러 없이 받아들이기 위해서
    // 기본값 true를 사용하는 경우 값이 들어오지 않으면 400 반환해버림
    // Integer로 변환해야 null 받을 수 있기 때문에 변환 필요
    public ResponseEntity<?> getDailyStudy( @RequestParam( required = false ) Integer studyNo, HttpSession session ) {

        // 파라미터 없으면 세션값 사용
        if (studyNo == null) {
            studyNo = (Integer) session.getAttribute( "selectedStudyNo" );
        }
        // 세션값도 없으면 에러
        if (studyNo == null) {
            return ResponseEntity.badRequest().body( "studyNo가 없습니다(파라미터 또는 세션)." );
        }

        // 세션 저장/갱신
        session.setAttribute( "selectedStudyNo", studyNo );
        var dto = studyService.getDailyStudy( studyNo );
        return ( dto == null ) ? ResponseEntity.notFound().build() : ResponseEntity.ok( dto );
    }


    // 주제에 맞는 예문 조회
    // 일단은 DB저장 없이 조회만 가능
    @GetMapping("/getDailyStudy2")
    public ResponseEntity< List<ExamDto> > getDailyStudy2( @RequestParam int studyNo ){
        return ResponseEntity.ok( studyService.getDailyStudy2( studyNo ) );
    }
}
