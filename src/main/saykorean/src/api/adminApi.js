import axios from "axios";

// 기본 주소값 설정
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
    // 6) 자동 번역
    translate: (translationRequestDto) => api.post("/study/translate",
        translationRequestDto),
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

        // 3-3) 텍스트 & 이미지 반환
        return apiFormData.post("/study/exam", formData);
    },
    // 4) 예문 수정
    update: (examDto) => {
        // 그림 파일 전송 위한 폼데이터
        const formData = new FormData();

        // 4-1) 텍스트 데이터 변경
        Object.keys(examDto).forEach(key => {
            if (key !== "newImageFile" && examDto[key] != null && examDto[key] !== undefined) {
                formData.append(key, examDto[key]);
            }
        });

        // 4-2) 이미지 파일 변경 & 새로 추가
        if (examDto.newImageFile) {
            formData.append('newImageFile', examDto.newImageFile);

        }

        // 4-3) 텍스트 & 이미지 반환
        return apiFormData.put('/study/exam', formData);
    },
    // 5) 예문 삭제
    delete: (examNo) => api.delete(`/study/exam?examNo=${examNo}`),
    // 6) 예문 자동번역
    translate: (translationRequestDto) => api.post("/study/translate",
        translationRequestDto),
    // 7) 예문 발음기호 자동 생성성성
    romanize: (text) => api.get(`/study/romanize?text=${text}`),
};

// [4] 음성 API

export const audioApi = {
    // 1) 음성 목록 조회
    getAll: () => api.get('/audio'),
    // 2) 음성 상세 조회
    getIndi: (audioNo) => api.get(`/audio/indi?audioNo=${audioNo}`),
    // 3-1) 음성 생성(파일 업로드)
    create: (audioDto) => {
        // 음성 파일 전송 위한 폼데이터
        const formData = new FormData();

        // 3-1) 텍스트 데이터 추가
        Object.keys(audioDto).forEach(key => {
            if (key !== "audioFile" && audioDto[key] !== null && audioDto[key] !== undefined) {
                formData.append(key, audioDto[key]);
            }
        });

        // 3-2) 음성 파일 추가
        if (audioDto.audioFile) {
            formData.append('audioFile', audioDto.audioFile);
        }

        // 3-3) 텍스트, 음성 파일 반환
        return apiFormData.post('/audio', formData);
    },
    // 3-2) 음성 생성(TTS)
    createFromTTS: (ttsData) => {
        return api.post('/audio/tts', {
            text: ttsData.text,
            languageCode: ttsData.languageCode, // ko-KR, en-US
            examNo: ttsData.examNo,
            lang: ttsData.lang // 1 : 한국어 , 2 : 영어
        });
    },
    // 4) 음성 수정
    update: (audioDto) => {
        // 음성 파일 전송 위한 폼데이터
        const formData = new FormData();

        // 4-1) 텍스트 데이터 추가
        Object.keys(audioDto).forEach(key => {
            if (key !== 'newAudioFile' && audioDto[key] !== null && audioDto[key] !== undefined) {
                formData.append(key, audioDto[key]);
            }
        });

        // 4-2) 음성 파일 변경 & 새 음성 추가
        if (audioDto.newAudioFile) {
            formData.append('newAudioFile', audioDto.newAudioFile);
        }

        // 4-3) 텍스트, 음성 파일 반환
        return apiFormData.put('/audio', formData);
    },
    // 5) 음성 삭제
    delete: (audioNo) => api.delete(`/audio?audioNo=${audioNo}`),
};

// export
export default api;