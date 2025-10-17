package web.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import web.model.dto.RankingDto;
import web.model.dto.TestDto;
import web.model.dto.TestItemDto;
import web.model.mapper.TestMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestService { // class start

    private final TestMapper testMapper;
    
    public List< TestDto > getListTest( int studyNo ){
        List< TestDto > result = testMapper.getListTest( studyNo );
        return result;
    }
    
    public List< TestItemDto > findTestItem( int testNo ){
        List< TestItemDto > result = testMapper.findTestItem( testNo );
        return result;
    }
    
    public int upsertRanking( RankingDto dto ){
        int result = testMapper.upsertRanking( dto );
        return result;
    }
    
    public RankingDto getScore( int userNo , int testNo , int testRound ){
        RankingDto result = testMapper.getScore( userNo , testNo , testRound );
        return result;
    }
    

} // class end
