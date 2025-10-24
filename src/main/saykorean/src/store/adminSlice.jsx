import { createSlice } from "@reduxjs/toolkit";

// [1] 상태 초기값 정의. 빈 배열로 배치
const initialState = {
    genres: [],
    studies: [],
    exams: [],
    audios: [],
    currentStudy: null,
    currentExam: null,
    loading: false,
    error: null,
    tests: [],
    testItems: [],
};

// [2] 관리자 슬라이스 정의
const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        // 상태 변경 리듀서들
        setGenres: (state, action) => { state.genres = action.payload; },
        setStudies: (state, action) => { state.studies = action.payload; },
        setExams: (state, action) => { state.exams = action.payload; },
        setAudios: (state, action) => { state.audios = action.payload; },
        setCurrentStudy: (state, action) => { state.currentStudy = action.payload; },
        setCurrentExam: (state, action) => { state.currentExam = action.payload; },
        setLoading: (state, action) => { state.loading = action.payload; },
        setError: (state, action) => { state.error = action.payload; },
        setTests: (state, action) => { state.tests = action.payload; },
        setTestItems: (state, action) => { state.testItems = action.payload; },
        // 추가, 수정, 삭제 리듀서들
        addGenre: (state, action) => { state.genres.push(action.payload); },
        addStudy: (state, action) => { state.studies.push(action.payload); },
        addExam: (state, action) => { state.exams.push(action.payload); },
        addAudio: (state, action) => { state.audios.push(action.payload); },
        addTest: (state, action) => { state.tests.push(action.payload) },
        addTestItem: (state, action) => { state.testItems.push(action.payload); },
        updateStudy: (state, action) => {
            const index = state.studies.findIndex(s => s.studyNo == action.payload.studyNo);
            if (index !== -1) { state.studies[index] = action.payload; }
        },
        updateTest: (state, action) => {
            const index = state.tests.findIndex(t => t.testNo == action.payload.testNo);
            if (index !== -1) { state.tests[index] = action.payload; }
        },
        updateTestItem: (state, action) => {
            const index = state.textItems.findIndex(i => i.testItemNo == action.payload.testItemNo);
            if (index !== -1) { state.testItems[index] = action.payload; }
        },
        deleteStudy: (state, action) => {
            state.studies = state.studies.filter(s => s.studyNo !== action.payload);
        },
        deleteExam: (state, action) => {
            state.exams = state.exams.filter(e => e.examNo !== action.payload);
        },
        deleteAudio: (state, action) => {
            state.audios = state.audios.filter(a => a.audioNo !== action.payload);
        },
        removeTest: (state, action) => {
            state.tests = state.tests.filter(t => t.testNo !== action.payload);
        },
        removeTestItem: (state, action) => {
            state.testItems = state.testItems.filter(i => i.testItemNo !== action.payload)
        }
    },
});

// [3] store에 저장할 수 있게 export
export const {
    setGenres,
    setStudies,
    setExams,
    setAudios,
    setCurrentStudy,
    setCurrentExam,
    setLoading,
    setError,
    setTests,
    setTestItems,
    addGenre,
    addStudy,
    addExam,
    addAudio,
    addTest,
    addTestItem,
    updateStudy,
    updateTest,
    updateTestItem,
    deleteStudy,
    removeTest,
    removeTestItem,
} = adminSlice.actions;

// [4] 다른 컴포넌트에서 불러올 수 있도록 export
export default adminSlice.reducer;