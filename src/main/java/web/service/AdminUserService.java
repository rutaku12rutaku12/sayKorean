package web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.model.dto.AttendDto;
import web.model.dto.RankingDto;
import web.model.mapper.AdminUserMapper;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminUserService {

    // [*] DI
    private final AdminUserMapper adminUserMapper;

    // [1] AU-01	회원 통계	getStaticUser()
    // ranking의 모든 정보를 불러오고 userNo 별로 묶어서 출력한다.
    // 매개변수 x
    public List<Map<String, Object>> getStaticUser() {
        return adminUserMapper.getStaticUser();
    }

    // [2] AU-02	회원 통계 상세검색	searchStaticUser()
    // 랭킹 테이블 레코드의 userNo를 사용자 테이블의 userNo와 join하여 두 테이블의 정보를 조회한다.
    // 매개변수 userNo
    public Map<String , Object> searchStaticUser(int userNo) {
        Map<String , Object> userInfo = adminUserMapper.searchStaticUser(userNo);
        if (userInfo == null){
            throw new RuntimeException("회원 정보를 찾을 수 없습니다.");
        }
        return userInfo;
    }

    // [3] AU-03	회원 제재	updateRestrictUser()
    // users의 userState 상태를 (n)일간 -2로 변경한다. (제제된 상태) userState가 -2이면, 로그인 시 (n)일간 제제되었다고 출력시킨다.
    // 매개변수 userNo , int restrictDay
    // 반환 int(성공 1)
    public int updateRestrictUser(int userNo, int restrictDay) {
        int result = adminUserMapper.updateRestrictUser(userNo);
        if (result == 0){
            throw new RuntimeException("회원 제재에 실패했습니다.");
        }
        // TODO: restrictDay를 활용한 제재 기간 설정 로직 추가 가능
        // (예: 별도 테이블에 제재 이력 저장)
        return result;
    }

    // [4] AU-04	회원 권한 변경	updateRoleUser()
    // users의 urole를 "USER" 또는 "ADMIN"으로 변경한다.
    // 매개변수 userNo, urole
    // 반환 int(성공 1)
    public int updateRoleUser(int userNo, String urole) {
        // 권한 검증
        if (!urole.equals("USER") && !urole.equals("ADMIN")) {
            throw new IllegalArgumentException("유효하지 않은 권한입니다. USER 또는 ADMIN만 가능합니다.");
        }

        int result = adminUserMapper.updateRoleUser(userNo, urole);
        if (result == 0) {
            throw new RuntimeException("권한 변경에 실패했습니다.");
        }
        return result;
    }

    // [5] AU-05	회원 출석 로그 조회	getAttendUser()
    // attend에서 userNo를 조건절로 입력받아 모든 출석 정보를 출력한다.
    // 매개변수 userNo
    // 반환 List<AttendDto>
    public List<AttendDto> getAttendUser(int userNo) {
        return adminUserMapper.getAttendUser(userNo);
    }
    
    // [6] AU-06 회원 검색 및 필터링
    public List<Map<String, Object>> searchUsers(String keyword, Integer userState,
                                                 String startDate, String endDate,
                                                 String sortBy) {
        return adminUserMapper.searchUsers(keyword, userState, startDate, endDate, sortBy);
    }
    
    // [7] AU-07 회원 통계 대시보드
    public Map<String , Object> getDashboard(String period) {
        Map<String, Object> dashboard = adminUserMapper.getDashboard();

        // 평균 출석률 추가
        Double avgAttendance = adminUserMapper.getAvgAttendance();
        dashboard.put("avgAttendance" , avgAttendance != null ? avgAttendance : 0.0);

        // 평균 시험 점수 추가
        Double avgScore = adminUserMapper.getAvgScore();
        dashboard.put("avgScore" , avgScore != null ? avgScore : 0.0);

        return dashboard;
    }
    
    // [8] AU-08 회원 시험 기록 조회 (EXCEL 다운로드용)
    public List<Map<String , Object>> getUserTestRecords(int userNo) {
        return adminUserMapper.getUserTestRecords(userNo);
    }

    // [9] AU-09 회원 일괄 처리
    public int batchUpdate(List<Integer> userNos, String action, Object value) {
        if ( userNos == null || userNos.isEmpty() ){
            throw new IllegalArgumentException("회원 번호 목록이 비어있습니다.");
        }

        int result = 0;

        switch (action) {
            case "restrict":
                result = adminUserMapper.batchRestrict(userNos);
                break;
            case "role" :
                if (!(value instanceof String)){
                    throw new IllegalArgumentException("권한 값은 문자열이어야 합니다.");
                }
                String urole = (String) value;
                if (!urole.equals("USER") && !urole.equals("ADMIN")) {
                    throw new IllegalArgumentException("유효하지 않은 권한입니다.");
                }
                result = adminUserMapper.batchUpdateRole(userNos, urole);
                break;
            default:
                throw new IllegalArgumentException("유효하지 않은 작업입니다:" + action);
         }
         return result;
    }
    
    // [*] 특정 회원의 시험 결과 목록
    public List<RankingDto> getUserRankings(int userNo) {
        return adminUserMapper.getUserRankings(userNo);
    }
}
