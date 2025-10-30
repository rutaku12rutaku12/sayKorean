import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { 
  isAuthenticated: false, 
  userInfo: null 
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.isAuthenticated = true;
      state.userInfo = action.payload;
    },
    logOut: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null;
    },
    setUserInfo: (state, action) => { // ✅ 추가
      state.userInfo = action.payload;
    }
  }
});

export const { logIn, logOut, setUserInfo } = userSlice.actions;
export default userSlice.reducer;

// 자동 로그인용 thunk 함수 추가
export const info = () => async (dispatch) => {
  try {
    const res = await axios.get("http://localhost:8080/saykorean/user/info", {
      withCredentials: true,
    });
    if (res.data) {
      dispatch(logIn(res.data)); // 로그인 상태로 저장
    }
  } catch (e) {
    console.error("❌ 사용자 정보 불러오기 실패:", e);
  }
};
