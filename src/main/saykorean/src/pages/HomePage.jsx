import axios from "axios";
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { logOut } from "../store/userSlice";
import "../styles/HomePage.css"
export default function HomePage ( props ){
    console.log("HomePage.jsx open")
    // navigate, dispatch 함수 가져오기
    const navigate =useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state)=>state.user.isAuthenticated);
    
    // 1. 로그아웃 처리 함수 정의 
    const onLogout = async()=>{
        try{
            // CORS 옵션 허용
            const option = { withCredentials : true }
            const response = await axios.get("http://localhost:8080/saykorean/logout",option)
            const data = response.data;
            console.log("로그아웃 성공",data)
            dispatch(logOut());
        }catch(e){console.log("로그아웃 실패 : ", e)}
    }
    return (
        <div id="homePage" className="homePage">
            {/* ✅ 이 한 줄이 ‘이 페이지에서만’ 배경 역할을 함 */}
            <div className="homePage__bg" aria-hidden="true" />

            <h3 className="homePage__title">재밌는 한국어</h3>

            <div className="homePage__content">
                <img className="mainImg" src="/img/mainimage.svg" alt="메인" />
                <div className="homePage__actions">
                    {isAuthenticated ? (
                        <button onClick={onLogout}>로그아웃</button>
                    ) : (
                        <>
                            <button onClick={() => navigate("/signup")}>회원가입</button>
                            <button onClick={() => navigate("/login")}>로그인</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}