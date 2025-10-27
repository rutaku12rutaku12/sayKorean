package web.model.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import web.model.dto.AttendDto;
import web.model.dto.RankingDto;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminUserMapper {

    // [1] AU-01	회원 통계	getStaticUser()
    // ranking의 모든 정보를 불러오고 userNo 별로 묶어서 출력한다.
    // 매개변수 x
    // 반환 List<Map<String , Object>
    @Select("""
            select
                u.userNo, u.nickName, u.email, u.userState, u.userDate, u.urole,
                count(distinct a.attenNo) as totalAttendance,
                count(distinct r.rankNo) as totalTests,
                sum(case when r.isCorrect = 1 then 1 else 0 end) as correctCount,
                count(r.rankNo) as totalQuestions
            from users u
            left join attendance a on u.userNo = a.userNo
            left join ranking r on u.userNo = r.userNo
            group by u.userNo , u.nickName, u.email, u.userState, u.userDate, u.urole
            order by u.userDate desc
            """)
    List<Map<String , Object>> getStaticUser();

    // [2] AU-02	회원 통계 상세검색	searchStaticUser()
    // 랭킹 테이블 레코드의 userNo를 사용자 테이블의 userNo와 join하여 두 테이블의 정보를 조회한다.
    // 매개변수 userNo
    // 반환 Map<String, Object>
    @Select("""
            select
                u.userNo, u.name, u.nickName, u.email, u.phone, u.signupMethod,
                u.userState, u.userDate, u.userUpdate, u.urole,
                count(distinct a.attenNo) as totalAttendance,
                count(distinct r.testRound) as totalTestRounds,
                sum(case when r.isCorrect = 1 then 1 else 0 end) as correctCount,
                count(r.rankNo) as totalQuestions
            from users u
            left join attendance a on u.userNo = a.userNo
            left join ranking r on u.userNo = r.userNo
            where u.userNo = #{userNo}
            group by u.userNo, u.name, u.nickName, u.email, u.phone, u.signupMethod,
                     u.userState, u.userDate, u.userUpdate, u.urole
            """)
    Map<String, Object> searchStaticUser(int userNo);

    // [3] AU-03	회원 제재	updateRestrictUser()
    // users의 userState 상태를 (n)일간 -2로 변경한다. (제제된 상태) userState가 -2이면, 로그인 시 (n)일간 제제되었다고 출력시킨다.
    // 매개변수 userNo
    // 반환 int(성공 1)
    @Update("""
            update users
            set userState = -2
            where userNo = #{userNo}
            """)
    int updateRestrictUser(@Param("userNo") int userNo);

    // [4] AU-04	회원 권한 변경	updateRoleUser()
    // users의 urole를 "USER" 또는 "ADMIN"으로 변경한다.
    // 매개변수 userNo, urole
    // 반환 int(성공 1)
    @Update("""
            update users
            set urole = #{urole}
            where userNo = #{userNo}
            """)
    int updateRoleUser(@Param("userNo") int userNo , @Param("urole") String urole);

    // [5] AU-05	회원 출석 로그 조회	getAttendUser()
    // attend에서 userNo를 조건절로 입력받아 모든 출석 정보를 출력한다.
    // 매개변수 userNo
    // 반환 List<AttendDto>
    @Select("""
            select attenNo, attenDate, attendDay, userNo
            from attendance
            where userNo = #{userNo}
            order by attenDate desc
            """)
    List<AttendDto> getAttendUser(int userNo);
    
    // [6] [AU-06] 회원 검색 및 필터링
    @Select("""
            <script>
            select
                u.userNo, u.nickName, u.email, u.userState, u.userDate, u.urole,
                count(distinct a.attenNo) as totalAttendance
            from users u
            left join attendance a on u.userNo = a.userNo
            <where>
                <if test="keyword != null and keyword != ''">
                    and (u.nickName like concat('%', #{keyword}, '%')
                        or u.email like concat('%', #{keyword}, '%'))
                </if>
                <if test="userState != null">
                    and u.userState = #{userState}
                </if>
                <if test='startDate != null and startDate != "" and endDate != null and endDate != ""'>
                    AND u.userDate BETWEEN #{startDate} AND #{endDate}
                </if>
            </where>
            group by u.userNo, u.nickName, u.email, u.userState, u.userDate, u.urole
            <choose>
                <when test="sortBy == 'attendance'">
                    order by totalAttendance desc
                </when>
                <when test="sortBy == 'userData'">
                    order by u.userDate desc
                </when>
                <otherwise>
                    order by u.userNo desc
                </otherwise>
            </choose>
            </script>
            """)
    List<Map<String, Object>> searchUsers(@Param("keyword") String keyword,
                                          @Param("userState") Integer userState,
                                          @Param("startDate") String startDate,
                                          @Param("endDate") String endDate,
                                          @Param("sortBy") String sortBy);
    
    // [7-1] [AU-07] 회원 통계 대시보드
    @Select("""
            select
                count(*) as totalUsers,
                sum(case when userState = 1 then 1 else 0 end) as activeUsers,
                sum(case when userState = -2 then 1 else 0 end) as restrictedUsers,
                sum(case when date(userDate) = curdate() then 1 else 0 end) as todayJoins,
                sum(case when date(userDate) >= date_sub(curdate(), interval 7 day) then 1 else 0 end) as weekJoins,
                sum(case when date(userDate) >= date_sub(curdate(), interval 30 day) then 1 else 0 end) as monthJoins
            from users
            """)
    Map<String , Object> getDashboard();
    
    // [7-2] [AU-07-2] 평균 출석률 계산
    @Select("""
            select avg(attendCount) as avgAttendance
            from (
                select count(*) as attendCount
                from attendance
                group by userNo
            ) as userAttendance
            """)
    Double getAvgAttendance();

    // [7-3] [AU-07-3] 평균 시험 점수 계산
    @Select("""
            select
                avg(case when totalQuestions > 0
                    then(correctCount * 100.0 / totalQuestions)
                    else 0 end) as avgScore
            from (
                select
                    userNo,
                    sum(case when isCorrect = 1 then 1 else 0 end) as correctCount,
                    count(*) as totalQuestions
                from ranking
                group by userNo
            ) as userScores
            """)
    Double getAvgScore();

    // [8] [AU-08] 특정 회원의 시험 기록 조회 (Excel)
    @Select("""
            select
                r.rankNo, r.testRound, r.userAnswer, r.isCorrect, r.resultDate,
                ti.question, t.testTitle, e.examKo
            from ranking r
            join testItem ti on r.testItemNo = ti.testItemNo
            join test t on ti.testNo = t.testNo
            join exam e on ti.examNo = e.examNo
            where r.userNo = #{userNo}
            order by r.resultDate desc
            """)
    List<Map<String, Object>> getUserTestRecords(int userNo);

    // [9-1] [AU-09-1] 회원 일괄 제재
    @Update("""
            <script>
            update users
            set userState = -2
            where userNo in
            <foreach collection="userNos" item="id" open="(" separator="," close=")">
                #{id}
            </foreach>
            </script>
            """)
    int batchRestrict(@Param("userNos") List<Integer> userNos);

    // [9-2] [AU-9-2] 회원 일괄 권한 변경
    @Update("""
            <script>
            update users
            set urole = #{urole}
            where userNo in
            <foreach collection="userNos" item="id" open="(" separator="," close=")">
                #{id}
            </foreach>
            </script>
            """)
    int batchUpdateRole(@Param("userNos") List<Integer> userNos,
                        @Param("urole") String urole);

    // [*] 특정 회원의 시험 결과 목록
    @Select("""
            select
                r.rankNo, r.testRound, r.selectedExamNo, r.userAnswer,
                r.isCorrect, r.resultDate, r.testItemNo, r.userNo,
                ti.question, t.testTitle, e.examNo, e.examKo
            from ranking r
            join testItem ti on r.testItemNo = ti.testItemNo
            join test t on ti.testNo = t.testNo
            join exam e on ti.examNo = e.examNo
            where r.userNo = #{userNo}
            order by r.resultDate desc
            """)
    List<RankingDto> getUserRankings(int userNo);

}
