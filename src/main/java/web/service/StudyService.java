package web.service;

import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.ExamDto;
import web.model.dto.GenreDto;
import web.model.dto.StudyDto;
import web.model.mapper.StudyMapper;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class StudyService { // class start

    private final StudyMapper studyMapper;


    // 장르 목록
    public List<GenreDto> getGenre(){
        List<GenreDto> result = studyMapper.getGenre();
        return result;
    }

    // 특정 장르의 주제 목록
    public List<StudyDto> getSubject( int genreNo ){
        List< StudyDto > result = studyMapper.getSubject( genreNo );
        return result;
    }

    // 주제와 주제에 대한 해설 조회
    public StudyDto getDailyStudy( int studyNo ){
        StudyDto result = studyMapper.getDailyStudy( studyNo );
        return result;

    }

    // 주제에 맞는 예문 조회
    // 일단은 DB저장 없이 조회만 가능
    public List<ExamDto> getDailyStudy2( int studyNo ){
        List<ExamDto> result = studyMapper.getDailyStudy2( studyNo );
        return result;
    }

} // class end

















