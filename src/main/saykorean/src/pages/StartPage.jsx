import { useNavigate } from "react-router-dom";
import "../styles/StartPage.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function StartPage(props) {
  console.log("StartPage.jsx open");

  const isAuthenticated = useSelector((state)=>state.user.isAuthenticated);
  const navigate =useNavigate();

  // 로그인이 되어 있으면 home으로 자동 이동
  useEffect(()=>{
    if (isAuthenticated){
        navigate("/home");
    }
  }, [isAuthenticated, navigate] );

  return(<>
    <div id="start-frame">
        <div id="startPage" className="stargPage">
            {/* 배경 */}
            <div className="startPage__bg" aria-hidden="true" />
            <div className="startPage__content">
                {/* 재미있는 한국어 글씨 */}
                <img className="logoImg" src="/img/logo.png" />
                {/* 토끼와호랑이 캐릭터*/}
                <img className="mainImg" src="/img/mainimage.svg" alt="메인" />
                    {/* 버튼*/}
                <div className="startPage__actions">
                    <button onClick={() => navigate("/login")}>로그인</button>
                    <button onClick={() => navigate("/signup")}>회원가입</button>
                </div>
            </div>
        </div>
    </div>
    </>)
}