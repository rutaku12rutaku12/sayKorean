import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "../i18n";
import { useTranslation } from "react-i18next"; // 추가

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

export default function Language(props) {

  const navigate = useNavigate();
  const { t } = useTranslation(); // 추가

  const [languages, setLanguages] = useState([]);
  const [selectedLangNo, setSelectedLangNo] = useState(() => {
    const saved = Number(localStorage.getItem("selectedLangNo"));
    return Number.isFinite(saved) && saved > 0 ? saved : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Language.jsx - 언어 매핑 추가
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

    const langMap = {
      1: "ko",
      2: "ja",
      3: "zh-CN",
      4: "en",
      5: "es"
    };

    const savedLangNo = Number(localStorage.getItem("selectedLangNo"));
    const lng = langMap[savedLangNo] || "ko";

    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);

    alert(t("언어가 변경되었습니다!")); // 하드코딩 제거
    console.log("현재 언어:", i18n.language);
    navigate("/mypage");
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get("/saykorean/study/getlang");
        const list = Array.isArray(res.data) ? res.data : [];
        setLanguages(list);

        if ((!selectedLangNo || selectedLangNo <= 0) && list.length === 1) {
          pickLangNo(list[0].langNo);
        }
      } catch (e) {
        console.error(e);
        setError("언어 목록을 받지 못했어요.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div id="Language" className="homePage">
      <div className="panel">
        <h3 className="panelTitle">{t("language.title")}</h3>
        {loading && <div className="toast loading">불러오는 중...</div>}
        {error && <div className="toast error">{error}</div>}
        <div className="list">
          {languages.map((l) => {
            const isActive = Number(selectedLangNo) === Number(l.langNo);
            return (
              <button
                key={l.langNo}
                className={`pillBtn ${isActive ? "active" : ""}`}
                aria-pressed={isActive}
                onClick={() => pickLangNo(l.langNo)}
              >
                <span className="label">{l.langName}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
