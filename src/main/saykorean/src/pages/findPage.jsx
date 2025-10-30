import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../styles/FindPage.css";

export default function FindPage() {
  console.log("FindPage.jsx open");
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name2, setName2] = useState("");
  const [phone2, setPhone2] = useState("");

  // 전화번호 포맷 통일
  const handlePhoneChange = (value) => {
    let phoneWithPlus = (value || "").replace(/\s+/g, "");
    if (!phoneWithPlus.startsWith("+")) {
      phoneWithPlus = "+" + phoneWithPlus;
    }
    setPhone(phoneWithPlus);
  };

  const handlePhoneChange2 = (value) => {
    let phoneWithPlus = (value || "").replace(/\s+/g, "");
    if (!phoneWithPlus.startsWith("+")) {
      phoneWithPlus = "+" + phoneWithPlus;
    }
    setPhone2(phoneWithPlus);
  };

  // 이메일 찾기
  const findEmail = async () => {
    if (!name && phone) {
      return alert(t("findpage.inputValue"));
    }
    try {
      const option = { withCredentials: true, params: { name, phone } };
      const response = await axios.get("http://localhost:8080/saykorean/findemail", option);
      const data = response.data;
      alert(`${t("findpage.checkEmail")} : ${data}`);
    } catch (e) {
      console.log("이메일 찾기 실패", e);
      alert(t("findpage.dismissed"));
    }
  };

  // 비밀번호 찾기
  const findPwrd = async () => {
    if (!name2 && phone2 && email) {
      return alert(t("findpage.inputValue"))
    }
    try {
      const option = { withCredentials: true, params: { name: name2, phone: phone2, email } };
      const response = await axios.get("http://localhost:8080/saykorean/findpwrd", option);
      const data = response.data;
      alert(`${t("findpage.password")} : ${data}`);
    } catch (e) {
      console.log("비밀번호 찾기 실패", e);
      alert(t("findpage.dismissed"));
    }
  };

  return (
    <div id="findWrapper" className="findPage">
      <h3>{t("account.findEmailTitle")}</h3>

      <div className="info">
        <input
          type="text"
          placeholder={t("account.namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
        <PhoneInput
          country={"kr"}
          preferredCountries={["us", "cn", "jp", "kr"]}
          enableSearch={true}
          value={phone}
          onChange={handlePhoneChange}
          placeholder={t("account.phonePlaceholder")}
          inputClass="input phoneInput"
        />
        <button className="pillBtn" onClick={findEmail}>
          {t("common.confirm")}
        </button>
      </div>

      <h3>{t("account.findPasswordTitle")}</h3>
      <div className="info">
        <input
          type="text"
          placeholder={t("account.namePlaceholder")}
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          className="input"
        />
        <PhoneInput
          country={"kr"}
          preferredCountries={["us", "cn", "jp", "kr"]}
          enableSearch={true}
          value={phone2}
          onChange={handlePhoneChange2}
          placeholder={t("account.phonePlaceholder")}
          inputClass="input phoneInput"
        />
        <input
          type="email"
          placeholder={t("account.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <button className="pillBtn" onClick={findPwrd}>
          {t("common.confirm")}
        </button>
      </div>
    </div>
  );
}
