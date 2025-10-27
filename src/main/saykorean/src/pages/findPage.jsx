import axios from "axios";
import { useState } from "react";import { useTranslation } from "react-i18next";





export default function FindPage(props){
    console.log("FindPage.jsx open")

    // ** REF로 바꾸기 !!! TODO
        // 인풋 상태 관리 

        const { t } = useTranslation();
        const [name, setName] = useState("");
        const [phone, setPhone] = useState("");
        const [email, setEmail] = useState("");
        const [name2, setName2] = useState("");
        const [phone2, setPhone2] = useState("");

        // 이메일 찾기 함수
        const findEmail = async()=>{
            try{
                // CORS 옵션 허용
                const option = { withCredentials : true ,
                    params:{name,phone}
                }
                const response = await axios.get("http://localhost:8080/saykorean/findemail",option)
                const data = response.data;
                console.log("조회 결과:", data);
                alert("이메일 : "+data);
                
            }catch(e){console.log(" 이메일찾기 실패 ", e)
                alert("서버와 연결이 끊어졌습니다.")
            }
        }

        // 비밀번호 찾기 함수
        const findPwrd = async()=>{
            try{
                // CORS 옵션 허용
                const option = { withCredentials : true ,
                    params:{name:name2,phone:phone2,email}
                }
                const response = await axios.get("http://localhost:8080/saykorean/findpwrd",option)
                const data = response.data;
                alert("비밀번호 : "+data);
            }catch(e){console.log(" : ", e)
                alert("서버와 연결이 끊어졌습니다")
            }
        }

    return (
  <>
    <h3>{t("account.findEmailTitle")}</h3><br/>
    {t("account.name")} (name) <br/>
    <input
      type="text"
      placeholder={t("account.namePlaceholder")}
      value={name}
      onChange={(e) => setName(e.target.value)}
    /> <br/>
    {t("account.phone")} (phone) <br/>
    <input
      type="tel"
      placeholder={t("account.phonePlaceholder")}
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    /> <br/> <br/>
    <button onClick={findEmail}>{t("common.confirm")}</button>

    <h3>{t("account.findPasswordTitle")}</h3><br/>
    {t("account.name")} (name) <br/>
    <input
      type="text"
      placeholder={t("account.namePlaceholder")}
      value={name2}
      onChange={(e) => setName2(e.target.value)}
    /> <br/>
    {t("account.phone")} (phone) <br/>
    <input
      type="tel"
      placeholder={t("account.phonePlaceholder")}
      value={phone2}
      onChange={(e) => setPhone2(e.target.value)}
    /> <br/>
    {t("account.email")} (email) <br/>
    <input
      type="email"
      placeholder={t("account.emailPlaceholder")}
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    /> <br/> <br/>
    <button onClick={findPwrd}>{t("common.confirm")}</button>
  </>
);
}