import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { useEffect } from "react"
import { logIn } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

console.log("MyPage.jsx open")
export default function MyPage( props ){
    
    
    // store 저장된 상태 가져오기 
    const {isAuthenticated, userInfo} = useSelector((state)=>state.user);

    // dispath 함수가져오기 
    const dispath = useDispatch();
    const navigate = useNavigate();

    // MyInfoUpdate 페이지로 이동 함수
    const onUpdate = async() => {
    navigate("/update");
    };

    // 내 정보 조회 함수
    useEffect( () => {info() })
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
        <li onClick={onUpdate}>설정</li>
        <li></li>
    </ul>
    :
    <h3>잘못된 접근입니다. 로그인 후 다시 시도해주세요.</h3>
    }
    </>)
    
}