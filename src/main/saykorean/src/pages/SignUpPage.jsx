import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import "../styles/SignUpPage.css"
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";

export default function SignUpPage(props) {
    console.log("SignUpPage.jsx open")

    // disptach , navigate 함수 가져오기
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // 인풋 상태 관리 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickName, setNickName] = useState("");
    const [phone, setPhone] = useState("");
    // const [genreNo, setGenreNo] = useState(""); 기본값1

    // 중복 여부 상태 관리 
    const [emailCheck, setEmailCheck] = useState(true);
    const [phoneCheck, setPhoneCheck] = useState(true);

    // [*] UI 번역
    const { t } = useTranslation();

    // 이메일 중복검사
    const CheckEmail = async () => {
        try {
            // CORS 옵션 허용
            const option = {
                withCredentials: true,
                // params:{키1:값1 , 키2:값2} 을 넣으면 자동으로 URL뒤에 ?키1=값1&키2=값2 으로 매핑됨. 
                params: { email: email }
            };
            // axios.get(url, config) 
            const response = await axios.get("http://localhost:8080/saykorean/checkemail", option)
            console.log(response);
            const data = response.data;
            console.log("중복이면 1 , 사용가능 0 반환:", data)
            if (data == 0) {
                setEmailCheck(false);
                { alert(t("signuppage.ableEmail")) }
            }
            else if (data == 1) {
                setEmailCheck(true);
                alert(t("signuppage.usedEmail"))
            }
            else if (data == -1) {
                setEmailCheck(true);
            }
            else { alert(t("signuppage.formEmail")) }
        } catch (e) {
            alert(t("signuppage.formEmailError"))
            console.log("예외 : ", e)
        }
    }
    // 연락처 중복검사
    const CheckPhone = async () => {
        try {
            // CORS 옵션 허용
            const option = {
                withCredentials: true,
                params: { phone: phone }
            }; console.log("검사할 번호 : ", phone);
            const response = await axios.get("http://localhost:8080/saykorean/checkphone", option)
            console.log(response);
            const data = response.data;
            console.log("중복이면 1 , 사용가능 0 반환:", data)
            if (data == 0) {
                setPhoneCheck(false);
                { alert(t("signuppage.ablePhone")) }
            }
            else if (data == 1) {
                setPhoneCheck(true);
                alert(t("signuppage.usedPhone"))
            }
            else if (data == -1) {
                setPhoneCheck(true);
            }
            else { alert(t("signuppage.formPhone")) }
        } catch (e) {
            alert(t("signuppage.formPhoneError"))
            console.log("예외 : ", e)
        }
    }


    // 회원가입 함수 
    const onSignup = async () => {
        try {
            const obj = { name: name, email: email, password: password, nickName: nickName, phone: phone, recaptcha: captchaValue }
            console.log(obj);
            if (emailCheck || phoneCheck) return alert(t("signuppage.dupCheck"))
            // CORS 옵션 허용
            const option = { withCredentials: true }
            const response = await axios.post("http://localhost:8080/saykorean/signup", obj, option)
            console.log("보내는값확인", obj);
            const data = response.data;
            console.log("userNo", data, "으로 가입");
            alert(t("signuppage.welcome"))
            navigate("/login");
            console.log("회원가입 성공");
        } catch (e) {
            alert(t("signuppage.fail"));
            console.log("회원가입 실패", e)
        }
    }

    // 전화번호에 +값이 빠지는걸 추가 시키는 함수
    const handlePhoneChange = (value, country, event, formattedValue) => {
        // 공백 제거
        let phoneWithPlus = (value || "").replace(/\s+/g, "");

        // + 없으면 붙이기
        if (!phoneWithPlus.startsWith("+")) {
            phoneWithPlus = "+" + phoneWithPlus;
        }

        setPhone(phoneWithPlus);
        console.log("저장될 phone:", phoneWithPlus);
    };

    // reCaptcha 상태 관리
    const [captchaValue, setCaptchaValue] = useState("");
    // siteKey=
    const API_KEY = "6Le0NfUrAAAAAMx1CWGt6TkO8q_Fl3Ep_2UsiODu";

    const handleCaptchaChange = (value) => {
        console.log("캡챠 값:", value);
        setCaptchaValue(value || "");
    };



    return (<> <div id="signUpWrapper" className="homePage">
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <div style={{ paddingRight: 20 }} >
                <a href="http://localhost:8080/oauth2/authorization/google">
                    <img src="/img\loginLogo_img\web_light_sq_ctn@1x.png" />
                </a>
            </div>
            <div>
                <a href="http://localhost:8080/oauth2/authorization/kakao">
                    <img src="/img\loginLogo_img\kakao_eng_login_medium_narrow.png" style={{ height: 40 }} />
                </a>
            </div>
        </div>
        <h3>{t("signup.signup")}</h3>

        <div className="info">
            <input type="text" placeholder={t("signup.inputName")} value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="info row">
            <input
                type="email"
                placeholder={t("signup.inputEmail")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={emailCheck ? "input error" : "input success"}
            />
            <button className={`sideBtn ${emailCheck ? "errorBtn" : "successBtn"}`} onClick={CheckEmail}>{t("signup.duplCheck")}</button>
        </div>

        <div className="info">
            <input type="password" placeholder={t("signup.inputPassword")} value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <div className="info">
            <input type="text" placeholder={t("signup.inputNick")} value={nickName} onChange={e => setNickName(e.target.value)} />
        </div>

        <div className="info row">
            <PhoneInput
                country={"kr"}
                preferredCountries={['us', 'cn', 'jp', 'kr']} // 많이 사용하는 국가 위로 올리기
                enableSearch={true}
                value={phone}
                onChange={handlePhoneChange}

                inputClass={phoneCheck ? "input error" : "input success"}
                placeholder={t("signup.inputPhone")}
            />
            <button
                className={`sideBtn ${phoneCheck ? "errorBtn" : "successBtn"}`}
                onClick={CheckPhone}
            >
                {t("signup.duplCheck")}
            </button>
        </div>
        <br />

        <div className="info recaptchaWrapper">
            <ReCAPTCHA sitekey={API_KEY} onChange={handleCaptchaChange} />
        </div>


        <div className="homePage__actions">
            <button className="pillBtn" onClick={onSignup}>{t("signup.signup")}</button>
        </div>
    </div>
    </>)
}