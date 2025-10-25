package web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.RankingDto;
import web.model.mapper.RankingMapper;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class RankingService {
    // [*] DI
    private final RankingMapper rankingMapper;

    // [RK-01]	랭킹 생성	createRank()
    // 랭킹 테이블 레코드를 추가한다.
    // 매개변수 RankingDto
    // 반환 int (PK)
    // * 사용자가 시험을 본 후 로직을 받아 처리한다.
    // * 추가 : 제미나이 정확도 채점 로직 API 활용하여 isCorrect 측정
    // 유진님이 함 패스 ㅅㄱ

    // [RK-02]	랭킹 삭제	deleteRank()
    // 랭킹 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int
    // * 사용자가 탈퇴했을 경우에 사용하는 로직
    public int deleteRankByUser(int userNo) {
        return rankingMapper.deleteRankByUser(userNo);
    }

    // [RK-03] 랭킹 분야별조회 	getRank()
    // 랭킹 테이블 레코드를 조회한다.
    // 사용자닉네임(userNo FK)과 시험명(examNo FK), 시험문항명(examNo FK)도 함께 조회.
    // 랭킹 로직
    // 매개변수 int
    // 반환 List<RankingDto>
    // 1) 정답왕 : 정답률이 높은 순
    // (isCorrect의 인트값 합산이 가장 높은 사람)
    // 2) 도전왕 : 가장 많이 문제를 푼 순서
    // (isCorrect의 레코드 합산이 가장 높은 사람)
    // 3) 끈기왕 : 같은 문제에 여러번 도전한 순
    // (testRound의 평균값이 가장 높은 사람)
    public List<Map<String, Object>> getRank(String type) {
        return switch (type.toLowerCase()) {
            case "accuracy" -> rankingMapper.getAccuracyRank();         // 정답왕
            case "challenge" -> rankingMapper.getChallengeRank();      // 도전왕
            case "persistence" -> rankingMapper.getPersistenceRank();   // 끈기왕
            default -> throw new IllegalArgumentException("잘못된 랭킹 분야가 입력되었습니다: " + type);
        };
    }

    // [RK-04]	랭킹 검색조회	searchRank() (안할거)
    // 랭킹 테이블 레코드를 검색조회한다.
    // 사용자닉네임(userNo FK)과 시험명(examNo FK), 시험문항명(examNo FK)도 함께 조회.
    // 서브쿼리 활용
    // 매개변수 int
    // 반환 RankingDto
    // 1) 사용자(userNo 조인)
    // 2) 시험문항별(testItemNo 조인)
    // 3) 사용자, 시험문항 복합 검색
    public List<RankingDto> searchRank(Integer userNo, Integer testItemNo) {
        if (userNo != null && testItemNo != null) {
            // 사용자 + 문항 복합 검색
            return rankingMapper.searchRankByUserAndItem(userNo , testItemNo);
        } else if (userNo != null) {
            // 사용자별 검색
            return rankingMapper.searchRankByUser(userNo);
        } else if (testItemNo != null) {
            // 문항별 검색
            return rankingMapper.searchRankByTestItem(testItemNo);
        } else {
            throw new IllegalArgumentException("userNo 또는 testItemNo 중 하나는 필수로 입력되어야 합니다.");
        }
    }

}
