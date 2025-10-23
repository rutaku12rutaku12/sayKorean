import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import adminSlice from "./adminSlice";
import attendSlice from "./attendSlice";

import storageSession from 'redux-persist/lib/storage/session';

// 세션스토리지에 'user'라는 이름으로 상태 저장
const persistConfig = {key:'user', storage: storageSession}

// 리듀서에 persist 설정
import { persistStore , persistReducer } from 'redux-persist';

// persistReducer( 옵션 , 설정리듀서 )
const persistedReducer = persistReducer( persistConfig , userSlice );

// 스토어 생성
const store = configureStore({
    reducer:{
        // 슬라이스 (상태) 등록
        user:persistedReducer,
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

export const persistor = persistStore( store );