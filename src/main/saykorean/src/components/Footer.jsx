import { useEffect } from "react";
import "../styles/Footer.css"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logIn, logOut } from "../store/userSlice";

export default function Footer(props) {

    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    const dispatch =useDispatch();
    const navigate =useNavigate();

         // 이미 로그인 되있으면 호출x
    const checkLogin = async () => {
      try {
        const option = { withCredentials: true };
        const response = await axios.get("http://localhost:8080/saykorean/info", option);
        console.log(response.data);
        if(response.data) {
          dispatch(logIn(response.data));
          navigate("/home");
        }else{
            dispatch(logOut());
        }
      } catch (e) {
        console.log("로그인 안됨:", e);
        dispatch(logOut());
    }
    }
  useEffect(() => {
    checkLogin();
  }, []);
    return (<>
        {/* <h3> 푸터 </h3> */}
        <ul id="footer">
            <ul className="list">
                <li> <Link to="/home"> <img src="/img/home.svg"/></Link> <div>홈</div></li>
                <li> <Link to="/mypage"><img src="/img/myPage.svg"/></Link> <div>내정보</div> </li>
                <li> <Link to="/beforestudy"><img src="/img/study.svg"/></Link> <div>학습</div> </li>
                <li> <Link to="/testlist"><img src="/img/test.svg"/></Link> <div>시험</div> </li>
                <li> <Link to="/rank"><img src="/img/test.svg"/></Link> <div>순위</div> </li>
                {/* <li> <Link to="/rank"><img src="/img/rank.svg"/></Link><div>홈</div></li> */}
            </ul>
        </ul>
    </>)
}