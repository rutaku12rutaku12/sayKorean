import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { useEffect } from "react"
import { logIn } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import "../styles/MyPage.css"

export default function MyPage( props ){
    console.log("MyPage.jsx open")
    
    
    // store 저장된 상태 가져오기 
    const {isAuthenticated, userInfo} = useSelector((state)=>state.user);

    // dispath , navigate 함수가져오기 
    const dispath = useDispatch();
    const navigate = useNavigate();

    // 수정페이지로 이동 함수 MyInfoUpdate.jsx
    const onUpdate = async() => {
    navigate("/update");
    };

    // 최초 1번 렌더링
    useEffect( () => { info() } , [] )
    // 내 정보 조회 함수
    const info = async () => {
        try{console.log("info.exe")
            const option = { withCredentials : true }
            const response = await axios.get("http://localhost:8080/saykorean/info",option)
            const data = response.data
            console.log(data);
            // 로그인된 데이터 정보를 userInfo에 담기
            dispath(logIn(data));
        }catch(e){console.log(e)}
    }

    // 출석 조회 함수 



    //--------------정유진-------------//
    const onGenre = async() => {
    navigate("/genre");
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
        </ul>

        <div className="btnGroup">
          <button className="pillBtn" onClick={onUpdate}>회원정보 수정</button>
          <button className="pillBtn" onClick={onGenre}>장르 설정</button>
        </div>
      </section>
    </div>
    </>)

    
    
    
}