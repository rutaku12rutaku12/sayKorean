  import { useDispatch, useSelector } from "react-redux"
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import { logIn } from "../store/userSlice";
  import { useEffect, useState } from "react";
  import { useTranslation } from "react-i18next";
  import "../styles/LogIn.css";

  export default function LogInPage(props){
      console.log("LogInPage.jsx open")
      const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
      console.log(isAuthenticated);
      // dispatch 함수 가져오기
      const dispatch = useDispatch();
      // 가상 URL 로 페이지 전환 navigate 함수 가져오기
      const navigate = useNavigate();
      const { t } = useTranslation();

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
              dispatch(logIn(data));
              setUserInfo(data);
              return data;
          }catch(e){console.log(e)}
      }

      // 출석하기 함수
      const onAttend = async() =>{
          try{
              const data = await info();
              const obj = {userNo:data.userNo}
              const option = {withCredentials : true}
              const response = await axios.post("http://localhost:8080/saykorean/attend",obj,option)
              console.log(response);
              if(response.status==200){
              alert("출석체크가 되었습니다.")}
              else if(response.status==222)
                  {alert(response.data)}
              else{console.log("오류 발생")} }
          catch(e)            
              {alert("출석체크 오류가 발생했습니다.");
                  console.log(e);
              }
      }
      

      // 로그인 처리 함수 정의 
      const onLogin = async()=>{
          try{
              const obj = { email: email, password: password }
              // CORS 옵션 허용
              const option = { withCredentials : true }
              const response = await axios.post("http://localhost:8080/saykorean/login",obj,option)
              const data = response.data;
              if (data.userState == -2) {
                alert("제재된 계정입니다.")
                return;
              }
              console.log("현재 로그인한 userNo:",data);
              dispatch(logIn(data));
              navigate("/home");
              console.log("로그인 성공")
              await onAttend();
          }catch(e){console.log("로그인 실패 : ", e)
              console.log("입력 이메일:", email, "입력 비번:", password);
              alert("로그인 정보가 잘못되거나 없는 계정입니다.")
          }
      }

  useEffect(() => {
    if (!isAuthenticated){ // 이미 로그인 되있으면 호출x
    const checkLogin = async () => {
      try {
        const option = { withCredentials: true };
        const response = await axios.get("http://localhost:8080/saykorean/info", option);
        if(response.data) {
          dispatch(logIn(response.data));
          navigate("/home");
        }
      } catch (e) {
        console.log("로그인 안됨:", e);
      }
    }
    checkLogin();
  }}, []);

      
    return (
        <>
         <div id="login-page">
          <h3>{t("login.title")}</h3>
          <div className="info">
            <input
              className="input"
              type="email"
              placeholder={t("account.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="info">
            <input
              type="password"
              placeholder={t("account.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <br />
          <div className="homePage__actions">
            <button onClick={onLogin}>{t("login.button")}</button>
            <br />
            <button onClick={onFind}>{t("login.find")}</button>
            <br />
            <button onClick={() => navigate("/signup")}>{t("signup.button")}</button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <a href="http://localhost:8080/oauth2/authorization/google">
              <img src="/img\loginLogo_img\web_light_sq_SI@1x.png" />
            </a>
            <a href="http://localhost:8080/oauth2/authorization/kakao">
              <img src="/img\loginLogo_img\kakao_login_medium_narrow.png" style={{ height: 40 }} />
            </a>
          </div>
        </div>
      </>

    );
  }