package web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.AttendDto;
import web.model.mapper.AttendMapper;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendService {

    private final AttendMapper attendMapper;

    // [AT-1] 출석하기 attend()
    public int attend(AttendDto attendDto){
        int result = attendMapper.attend(attendDto);
        return result;
    }


    // [AT-2] 출석 조회 getAttend()
    public int getAttend(AttendDto attendDto){
        int result = attendMapper.getAttend(attendDto);
        return result;
    }

}
