import axios from "axios";

// 기본 주소값 설정
const BASE_URL = "http://localhost:8080/saykorean/admin/user";

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// [1] 회원 관리 API
export const adminUserApi = {
    // AU-01 : 회원 통계 (전체 회원 목록 + 시험 통계)
    getStaticUser: () => api.get(""),

    // AU-02 : 회원 통계 상세검색 (특정 회원 상세 정보)
    searchStaticUser: (userNo) => api.get(`/search?userNo=${userNo}`),

    // AU-03 : 회원 제재 (userState를 -2로 변경)
    updateRestrictUser: (userNo, restrictDay) =>
        api.put("/restrict", null, {
            params: { userNo, restrictDay }
        }),

    // AU-04 : 회원 권한 변경 (urole 변경)
    updateRoleUser: (userNo, urole) =>
        api.put("/role", null, {
            params: { userNo, urole }
        }),

    // AU-05 : 회원 출석 로그 조회
    getAttendUser: (userNo) => api.get(`/attend?userNo=${userNo}`),

    // AU-06 : 회원 검색 및 필터링
    searchUsers: (params) => api.get("/search/filter", { params }),

    // AU-07 : 회원 통계 대시보드
    getDashboard: (period = 'month') => api.get(`/dashboard?period=${period}`),

    // AU-08 : 회원 시험 기록 Excel 다운로드
    downloadExcel: (userNo) =>
        api.get(`/excel?userNo=${userNo}`, {
            responseType: 'blob'
        }),

    // AU-09 : 회원 일괄 처리
    batchUpdate: (userNos, action, value) =>
        api.post("/batch", {
            userNos,
            action,     // 'restrict' or 'role'
            value       // restrictDay or urole
        }),

};



export default api;