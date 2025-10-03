package web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.GenreDto;
import web.model.mapper.StudyMapper;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class StudyService { // class start

    private final StudyMapper studyMapper;


    // 사용자단 : 장르 목록 조회
    public List<GenreDto> getGenre(){
        List<GenreDto> result = studyMapper.getGenre();
        return result;
    }
} // class end
