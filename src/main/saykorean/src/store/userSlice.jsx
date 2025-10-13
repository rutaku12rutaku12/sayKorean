import {createSlice} from '@reduxjs/toolkit'
// [1] 상태의 초기값 정의 , 로그인 여부
const initialState = { isAuthenticated : false , userInfo : null }
// [2] 슬라이스 정의
const userSlice = createSlice({
    name: "user" , // 슬라이스 상태명
    initialState ,
    reducers: {
        logIn : (state, action) => {state.isAuthenticated=true;
            state.userInfo = action.payload;
        },
        logOut : (state) => {state.isAuthenticated=false;
            state.userInfo = null;
        }
    }
})

// [3] store에 저장할수 있게 export 해주기
export default userSlice.reducer // 리듀서를 store에 등록
// [4] 다른 컴포넌트에서 액션 (login,logout) 가능하게 export
export const{logIn,logOut} = userSlice.actions
