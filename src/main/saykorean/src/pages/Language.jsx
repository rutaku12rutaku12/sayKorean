import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import "../styles/Language.css";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

export default function Language() {

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [languages, setLanguages] = useState([]);
  const [selectedLangNo, setSelectedLangNo] = useState(() => {
    const saved = Number(localStorage.getItem("selectedLangNo"));
    return Number.isFinite(saved) && saved > 0 ? saved : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const LANG_DISPLAY = {
    1: "한국어",
    2: "日本語",
    3: "中文",
    4: "English",
    5: "Español"
  };

  const pickLangNo = (langNo) => {
    const n = Number(langNo);
    if (!Number.isFinite(n) || n <= 0) return;

    localStorage.setItem("selectedLangNo", String(n));
    console.log( "설정 언어 : " + selectedLangNo );

    const langMap = { 1: "ko", 2: "ja", 3: "zh-CN", 4: "en", 5: "es" };
    const lng = langMap[n] || "ko";
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);

    alert(t("language.changeLang"));
    navigate("/mypage");
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get("/saykorean/study/getlang");
        setLanguages(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setError("언어 목록을 받지 못했어요.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div id="Language" className="homePage">
      <h3 className="pageTitle">{t("language.title")}</h3>

      {loading && <div className="toast loading">{t("common.loading")}</div>}
      {error && <div className="toast error">{error}</div>}

      <ul className="languageListWrap">
        {languages.map((l) => {
          const isActive = Number(selectedLangNo) === Number(l.langNo);
          return (
            <li key={l.langNo} className="languageItem">
              <button
                className={`pillBtn ${isActive ? "active" : ""}`}
                onClick={() => pickLangNo(l.langNo)}
              >
                {LANG_DISPLAY[l.langNo] || l.langName}
              </button>
            </li>
          );
        })}
      </ul>

      {!loading && !error && languages.length === 0 && (
        <div className="empty">{t("language.empty")}</div>
      )}
    </div>
  );
}
