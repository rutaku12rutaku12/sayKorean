import axios from "axios";

const BASE_URL = "http://localhost:8080/saykorean/admin";

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// FormData 인스턴스
const apiFormData = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

// [1] 장르 API
export const genreApi = {
    // 1) 장르 목록 조회
    getAll: () => api.get("/study/genre"),
    // 2) 장르 생성
    create: (genreDto) => api.post("/study/genre", genreDto),
    // 3) 장르 삭제
    delete: (genreNo) => api.delete(`/study/genre?genreNo=${genreNo}`),
};

// [2] 교육(주제/해설) API
export const studyApi = {
    // 1) 교육 목록 조회
    getAll: () => api.get("/study"),
    // 2) 교육 상세 조회
    getIndi: (studyNo) => api.get(`/study/indi?studyNo=${studyNo}`),
    // 3) 교육 생성
    create: (studyDto) => api.post("/study", studyDto),
    // 4) 교육 수정
    update: (studyDto) => api.put("/study", studyDto),
    // 5) 교육 삭제
    delete: (studyNo) => api.delete(`/study?studyNo=${studyNo}`),
};

// [3] 예문 API
export const examApi = {
    // 1) 예문 목록 조회
    getAll: () => api.get("/study/exam"),
    // 2) 예문 상세 조회
    getIndi: (examNo) => api.get(`/study/exam/indi?examNo=${examNo}`),
    // 3) 예문 생성
    create: (examDto) => {
        // 그림 파일 전송 위한 폼데이터
        const formData = new FormData();

        // 3-1) 텍스트 데이터 추가
        Object.keys(examDto).forEach(key => {
            if (key !== "imageFile" && examDto[key] != null && examDto[key] !== undefined) {
                formData.append(key, examDto[key]);
            }
        });

        // 3-2) 이미지 파일 추가
        if (examDto.imageFile) {
            formData.append("imageFile", examDto.imageFile);
        }
        return apiFormData.post("/study/exam", formData);
    },
    // 4) 예문 수정
    update: (examDto) => {
        // 그림 파일 전송 위한 폼데이터
        const formData = new FormData();
        
        // 4-1) 텍스트 데이터 변경


}

// [4] 음성 API

