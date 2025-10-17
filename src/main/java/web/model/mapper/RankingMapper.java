package web.model.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RankingMapper {

    // [RK-01]	랭킹 생성	createRank()
    // 랭킹 테이블 레코드를 추가한다.
    // 매개변수 RankingDto
    // 반환 int (PK)
    // * 사용자가 시험을 본 후 로직을 받아 처리한다.
    // * 추가 : 제미나이 정확도 채점 로직 API 활용하여 isCorrect 측정

    // [RK-02]	랭킹 삭제	deleteRank()
    // 랭킹 테이블 레코드를 삭제한다.
    // 매개변수 int
    // 반환 int
    // * 사용자가 탈퇴했을 경우에 사용하는 로직

    // [RK-03] 랭킹 분야별조회 	getRank()
    // 랭킹 테이블 레코드를 조회한다.
    // 사용자닉네임(userNo FK)과 시험명(examNo FK), 시험문항명(examNo FK)도 함께 조회.
    // 랭킹 로직
    // 1) 정답왕 : 정답률이 높은 순
    // (isCorrect의 인트값 합산이 가장 높은 사람)
    // 2) 도전왕 : 가장 많이 문제를 푼 순서
    // (isCorrect의 레코드 합산이 가장 높은 사람)
    // 3) 끈기왕 : 같은 문제에 여러번 도전한 순
    // (testRound의 평균값이 가장 높은 사람)
    // 매개변수 int
    // 반환 List<RankingDto>

    // [RK-04]	랭킹 검색조회	searchRank()
    // 랭킹 테이블 레코드를 검색조회한다.
    // 사용자닉네임(userNo FK)과 시험명(examNo FK), 시험문항명(examNo FK)도 함께 조회.
    // 서브쿼리 활용
    // 1) 사용자(userNo 조인)
    // 2) 시험문항별(testItemNo 조인)
    // 매개변수 int
    // 반환 RankingDto


}
