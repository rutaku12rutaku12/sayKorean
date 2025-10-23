import axios from "axios";

const BASE_URL = "http://localhost:8080/saykorean/admin";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

// [1] 시험 API
export const testApi = {
    // 1) 시험 목록 조회
    getAll: () => api.get("/test"),
    // 2) 시험 상세 조회
    getIndi: (testNo) => api.get(`/test/indi?testNo=${testNo}`),
    // 3) 시험 생성 (기본)
    create: (testDto) => api.post("/test", testDto),
    // 4) 시험 생성 (자동 문항 생성 포함)
    createWithItems: (testDto, autoGenerate) =>
        api.post("/test/withitems", testDto, {
            params: { autoGenerate }
        }),
    // 5) 시험 수정
    update: (testDto) => api.put("/test", testDto),
    // 6) 시험 삭제
    delete: (testNo) => api.delete(`/test?testNo=${testNo}`),
    // 7) 특정 시험 문항 목록 조회
    getItemsByTestNo: (testNo) => api.get(`/test/${testNo}/items`),
};

// [2] 시험문항 API
export const testItemApi = {
    // 1) 문항 목록 조회
    getAll: () => api.get("/test/item"),
    // 2) 문항 상세 조회
    getIndi: (testItemNo) => api.get(`/test/item/indi?testItemNo=${testItemNo}`),
    // 3) 문항 생성
    create: (testItemDto) => api.post("/test/item" , testItemDto),
    // 4) 문항 수정
    update: (testItemDto) => api.put("/test/item" , testItemDto),
    // 5) 문항 삭제
    delete: (testItemNo) => api.delete(`/test/item?testItemNo=${testItemNo}`),
    // 6) 커스텀 문항 일괄 생성
    createBatch: (testNo, items) => 
        api.post(`/test/${testNo}/items/custom` , items),
};

// [3] 예문조회 API
export const testHelperApi = {
    // studyNo로 예문 목록 조회하기
    getExamsByStudy: (studyNo) => 
        api.get(`/study/exam?studyNo=${studyNo}`),
};

export default api;