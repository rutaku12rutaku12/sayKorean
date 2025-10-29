import axios from "axios";
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { logOut } from "../store/userSlice";
import "../styles/HomePage.css"
import { useEffect } from "react";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
export default function HomePage ( props ){
    console.log("HomePage.jsx open")
    // navigate, dispatch 함수 가져오기
    const navigate =useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state)=>state.user.isAuthenticated);

      const { t } = useTranslation();
    
    // 1. 로그아웃 처리 함수 정의 
    const onLogout = async()=>{
        try{
            // CORS 옵션 허용
            const option = { withCredentials : true }
            const response = await axios.get("http://localhost:8080/saykorean/logout",option)
            const data = response.data;
            console.log("로그아웃 성공",data)
            dispatch(logOut());
            // 400 (Bad Request)이면 강제 로그아웃
            if(response.status == 400){ dispatch(logOut()); }
        }catch(e){console.log("로그아웃 실패 : ", e)}
    }
    // 비로그인시 error 페이지로 이동
        useEffect( () => {
          if (!isAuthenticated) {
            navigate("/login"); // 로그인 안 되어 있으면 바로 이동
          }
        }, [isAuthenticated, navigate]);
    
        // 이동 전에 화면 깜빡임 방지
        if (!isAuthenticated) return null;


  return (
    <div className="homePage">
      <div className="homePage__bg" aria-hidden="true" />

      <img className="logoImg" src="/img/logo.png" />

      <div className="homePage__content">
        <img className="mainImg" src="/img/mainimage.svg" alt="메인" />

        <div className="homePage__actions2">
          {isAuthenticated ? (
            <button onClick={onLogout}>{t("home.logout")}</button>
          ) : (
            <>
              <button onClick={() => navigate("/signup")}>{t("home.signup")}</button>
              <button onClick={() => navigate("/login")}>{t("home.login")}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );

}