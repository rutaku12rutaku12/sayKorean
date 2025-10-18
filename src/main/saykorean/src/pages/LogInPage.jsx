import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logIn } from "../store/userSlice";
import { useState } from "react";
import "../styles/LogIn.css";

export default function LogInPage(props){
    console.log("LogInPage.jsx open")
    // dispatch 함수 가져오기
    const dispatch = useDispatch();
    // 가상 URL 로 페이지 전환 navigate 함수 가져오기
    const navigate = useNavigate();

    // 이메일,패스워드 상태관리
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ userInfo , setUserInfo ] = useState(null)
    const [name, setName] = useState("");
    const [nickName, setNickName] = useState("");
    const [phone, setPhone] = useState("");

    // 찾기페이지로 이동 함수 FindPage.jsx
    const onFind = async() => {
    navigate("/find");
    };
    
    // 내 정보 조회 함수
    const info = async () => {
        try{console.log("info.exe")
            const option = { withCredentials : true }
            const response = await axios.get("http://localhost:8080/saykorean/info",option)
            const data = response.data
            setName(data.name);
            setNickName(data.nickName);
            setPhone(data.phone);
            setUserInfo(data);
            console.log(data);
            // 로그인된 데이터 정보를 userInfo에 담기
            dispath(logIn(data));
            setUserInfo(data);
        }catch(e){console.log(e)}
    }

    // 출석하기 함수
    const onAttend = async() =>{
        const obj = {userNo:userInfo.userNo}
        const option = {withCredentials : true}
        const response = await axios.post("http://localhost:8080/saykorean/attend",obj,option)
        const data = response.data;
        console.log(data);
        alert("출석체크가 되었습니다.")
    }
    

    // 로그인 처리 함수 정의 
    const onLogin = async()=>{
        try{
            const obj = { email: email, password: password }
            // CORS 옵션 허용
            const option = { withCredentials : true }
            const response = await axios.post("http://localhost:8080/saykorean/login",obj,option)
            const data = response.data;
            console.log("현재 로그인한 userNo:",data);
            dispatch(logIn(obj));
            navigate("/");
            console.log("로그인 성공")
            onAttend();
        }catch(e){console.log("로그인 실패 : ", e)
            console.log("입력 이메일:", email, "입력 비번:", password);
            alert("로그인 정보가 잘못되거나 없는 계정입니다.")
        }

    }
         return(<><h3>로그인 페이지 </h3>
    <div className="label">이메일 (email)</div>
        <div className="row">
          <input
            className="input"
            type="email"
            placeholder="이메일을 입력해주세요."
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>
        <input type="password" placeholder="비밀번호" value={password} onChange={(e)=>setPassword(e.target.value)} />
    <br/>
    <button onClick={onLogin}>로그인</button>
    <br/>
    <button onClick={onFind}>이메일찾기/비밀번호찾기</button>  
    </>)
}