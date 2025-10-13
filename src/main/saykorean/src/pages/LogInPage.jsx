import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logIn } from "../store/userSlice";
import { useState } from "react";

console.log("로그인 페이지 렌더링")

export default function LogInPage(props){
    
    // dispatch 함수 가져오기
    const dispatch = useDispatch();
    // 가상 URL 로 페이지 전환 navigate 함수 가져오기
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 1.로그인 처리 함수 정의 
    const onLogin = async()=>{
        try{
            const obj = { email: "user04@example.com",password:"pass#04!"}
            // CORS 옵션 허용
            const option = { withCredentials : true }
            const response = await axios.post("http://localhost:8080/saykorean/login",obj,option)
            const data = response.data;
            console.log("현재 로그인한 userNo:",data);
            dispatch(logIn(obj));
            navigate("/");
            console.log("로그인 성공")
        }catch(e){console.log("로그인 실패 : ", e)}

    }
    return(<><h3>로그인 페이지 </h3>
    <input type="email" placeholder="이메일" value={email} onChange={(e)=> setEmail(e.target.value)} />
    <br/>
    <input type="password" placeholder="비밀번호" value={password} onChange={(e)=>setPassword(e.target.value)} />
    <br/>
    <button onClick={onLogin}>로그인</button>     
    </>)
}