import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logIn } from "../store/userSlice";
import { useState } from "react";
export default function LogInPage(props) {
    console.log("LogInPage.jsx open") // dispatch 함수 가져오기
    const dispatch = useDispatch(); // 가상 URL 로 페이지 전환 navigate 함수 가져오기
    const navigate = useNavigate(); // 이메일,패스워드 상태관리
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // 찾기페이지로 이동 함수 FindPage.jsx
    const onFind = async () => { navigate("/find"); }; // 로그인 처리 함수 정의
    const onLogin = async () => {
        try {
            const obj = { email: email, password: password } // CORS 옵션 허용
            const option = { withCredentials: true }
            const response = await axios.post("http://localhost:8080/saykorean/login", obj, option)
            const data = response.data;
            console.log("현재 로그인한 userNo:", data);
            dispatch(logIn(obj));
            navigate("/");
            console.log("로그인 성공")
        } catch (e) {
            console.log("로그인 실패 : ", e)
            console.log("입력 이메일:", email, "입력 비번:", password);
            alert("로그인 정보가 잘못되거나 없는 계정입니다.")
        }
    }
    return (<>
        <h3>로그인 페이지 </h3>
        <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
        <button onClick={onLogin}>로그인</button> <br />
        <button onClick={onFind}>이메일찾기/비밀번호찾기</button>
    </>)
}