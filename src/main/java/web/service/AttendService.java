package web.service;

import lombok.RequiredArgsConstructor;
import org.apache.ibatis.jdbc.SQL;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.AttendDto;
import web.model.mapper.AttendMapper;

import java.sql.SQLIntegrityConstraintViolationException;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendService {

    private final AttendMapper attendMapper;

    // [AT-1] 출석하기 attend()
    public int attend(AttendDto attendDto) throws DuplicateKeyException {

            int result = attendMapper.attend(attendDto);
            return result;
    }


    // [AT-2] 출석 조회 getAttend()
    public List<AttendDto> getAttend(int userNo){
        List<AttendDto> result = attendMapper.getAttend(userNo);
        return result;
    }
    //

}
