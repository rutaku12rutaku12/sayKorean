import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { useEffect } from "react"
import { logIn } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

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
    return(<>
    { isAuthenticated==true ?
    <ul>
        <li>NickName : {userInfo.nickName}</li>
        <li>가입일자 : {userInfo.userDate}</li>
        <li ><button onClick={onUpdate}>설정</button></li>
        <li>뭘?넣을</li>
    </ul>
    :
    <h3>잘못된 접근입니다. 로그인 후 다시 시도해주세요.</h3>
    }
    </>)
    
}