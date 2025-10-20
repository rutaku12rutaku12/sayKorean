import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { useEffect } from "react"
import { logIn } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import "../styles/MyPage.css"
import { getAttend } from "../store/attendSlice";

export default function MyPage( props ){
    console.log("MyPage.jsx open")
    
    
    // store 저장된 상태 가져오기 
    const {isAuthenticated, userInfo } = useSelector((state)=>state.user);
    const {attendInfo } = useSelector((state)=>state.attend);

    // dispatch , navigate 함수가져오기 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 수정페이지로 이동 함수 MyInfoUpdate.jsx
    const onUpdate = async() => {
    navigate("/update");
    };

    // 최초 1번 렌더링
    useEffect( () => { info(); onAttend(); } , [] )
    // 내 정보 조회 함수
    const info = async () => {
        try{console.log("info.exe")
            const option = { withCredentials : true }
            const response = await axios.get("http://localhost:8080/saykorean/info",option)
            const data = response.data
            console.log(data);
            // 로그인된 데이터 정보를 userInfo에 담기
            dispatch(logIn(data));
        }catch(e){console.log(e)}
    }

    // 출석 조회 함수 
    const onAttend = async () =>{
      try{console.log("getAttend.exe");
          const option = { withCredentials : true }
          const response = await axios.get("http://localhost:8080/saykorean/attend",option)
          const data = response.data
          console.log(data);
          // 로그인된 데이터 정보를 attendInfo에 담기
          dispatch(getAttend(data));
      }catch(e){console.log(e)}
    }


    //--------------정유진-------------//
    const onGenre = async() => {
    navigate("/genre");
    };

        // 최대 연속 출석일 계산 함수
    const getMaxStreak = (attendList) => {
      if (!attendList || attendList.length === 0) return 0;

      // attendDay 기준으로 날짜만 추출해서 Date 객체로 변환 후 정렬
      const dates = attendList
        .map(item => new Date(item.attendDay))
        .sort((a, b) => a - b);

      let maxStreak = 1;      // 최대 연속일
      let currentStreak = 1;  // 현재 연속일

      for (let i = 1; i < dates.length; i++) {
        // 하루(24시간) 차이 계산
        const diffDays = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          // 하루 차이 → 연속 출석
          currentStreak += 1;
        } else {
          // 연속 끊김 → 초기화
          currentStreak = 1;
        }

        // 최대값 갱신
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      }

      return maxStreak;
    };


    return(<>
    <div id="MyPage">
      <section className="panel">
        <h3 className="panelTitle">마이페이지</h3>

        <ul className="infoList">
          <li className="infoRow">
            <span className="infoKey">닉네임</span>
            <span className="infoValue">{userInfo?.nickName}</span>
          </li>
          <li className="infoRow">
            <span className="infoKey">가입일자</span>
            <span className="infoValue">{userInfo?.userDate}</span>
          </li>
          <li className="infoRow">
            <span className="infoKey">총 출석일수</span>
            <span className="infoValue">{attendInfo ? attendInfo.length : 0}일</span>
          </li>
          <li className="infoRow">
            <span className="infoKey">현재 연속 출석일수</span>
            <span className="infoValue">
              {attendInfo ? getMaxStreak(attendInfo) : 0}일
            </span>
          </li>
        </ul>

        <div className="btnGroup">
          <button className="pillBtn" onClick={onUpdate}>회원정보 수정</button>
          <button className="pillBtn" onClick={onGenre}>장르 설정</button>
        </div>
      </section>
    </div>
    </>)

    
    
    
}