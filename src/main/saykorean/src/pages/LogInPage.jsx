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

    // 찾기페이지로 이동 함수 FindPage.jsx
    const onFind = async() => {
    navigate("/find");
    };

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
        }catch(e){console.log("로그인 실패 : ", e)
            console.log("입력 이메일:", email, "입력 비번:", password);
            alert("로그인 정보가 잘못되거나 없는 계정입니다.")
        }

    }
      return (
    <div id="SignUp">
      <h3 className="panelTitle">회원가입</h3>

      <div className="form">
        <div className="label">이름 (name)</div>
        <input
          className="input"
          type="text"
          placeholder="이름을 입력해주세요."
          value={name}
          onChange={(e)=> setName(e.target.value)}
          autoComplete="name"
        />

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
          <button type="button" className="sideBtn" onClick={CheckEmail}>
            중복 확인
          </button>
        </div>

        <div className="label">비밀번호 (password)</div>
        <input
          className="input"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <div className="label">닉네임 (nickName)</div>
        <input
          className="input"
          type="text"
          placeholder="닉네임을 입력해주세요."
          value={nickName}
          onChange={(e)=> setNickName(e.target.value)}
          autoComplete="nickname"
        />

        <div className="label">연락처 (phone)</div>
        <div className="row">
          <PhoneInput
            country={'kr'}
            preferredCountries={['us', 'cn', 'jp', 'kr']}
            enableSearch={true}
            value={phone}
            onChange={setPhone}
            inputProps={{ name: 'phone', required: true, autoComplete: 'tel' }}
            containerClass="phone"     // CSS와 연결
            inputClass="phoneInput"    // CSS와 연결
            buttonClass="phoneBtn"     // (옵션) 필요 시 커스텀
          />
          <button type="button" className="sideBtn" onClick={CheckPhone}>
            중복 확인
          </button>
        </div>

        <button type="button" className="pillBtn" onClick={onSignup}>
          회원가입 (Sign Up)
        </button>
      </div>
    </div>
  );
}