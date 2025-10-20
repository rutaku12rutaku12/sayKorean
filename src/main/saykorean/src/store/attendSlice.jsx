import {createSlice} from '@reduxjs/toolkit'
// [1] 상태의 초기값 정의 , 출석 조회 여부
const initialState = { attendInfo : null }
// [2] 슬라이스 정의
const attendSlice = createSlice({
    name: "attend" , // 슬라이스 상태명
    initialState ,
    reducers: {
        getAttend : (state, action) => {state.attendInfo = action.payload;
        },
        removeAttend : (state) => { state.attendInfo = null;
        }
    }
})

// [3] store에 저장할수 있게 export 해주기
export default attendSlice.reducer // 리듀서를 store에 등록
// [4] 다른 컴포넌트에서 액션 (getAttend,removeAttend) 가능하게 export
export const{getAttend,removeAttend} = attendSlice.actions
