import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import adminSlice from "./adminSlice";
import attendSlice from "./attendSlice";

// 스토어 생성
const store = configureStore({
    reducer:{
        // 슬라이스 (상태) 등록
        user:userSlice,
        attend:attendSlice,
        admin:adminSlice
    } ,
    // 파일 업로드 처리를 위한 미들웨어 설정
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // 직렬화 불가능한 데이터 경고 비활성화
        })
})

export default store;