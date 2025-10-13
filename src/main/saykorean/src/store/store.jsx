import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

// 스토어 생성
const store = configureStore({
    reducer:{
        // 슬라이스 (상태) 등록
        user:userSlice
    }
})

export default store;