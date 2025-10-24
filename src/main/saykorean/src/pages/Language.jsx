import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n, { setAppLanguage } from "../i18n";
axios.defaults.baseURL = "http://localhost:8080";


axios.defaults.withCredentials = true;
export default function Language(props) {

  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [selectedLangNo, setSelectedLangNo] = useState(() => {
    const saved = Number(localStorage.getItem("selectedLangNo"));
    return Number.isFinite(saved) && saved > 0 ? saved : null; // navigate 제거
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


      const pickLangNo = (langNo) => {
        const n = Number(langNo);
        if (!Number.isFinite(n) || n <= 0) return;

        localStorage.setItem("selectedLangNo", String(n));

        // 언어 코드 매핑
        const LANG_MAP = { 1: "ko", 2: "ja", 3: "zh-CN", 4: "en", 5: "es" };
        const lang = LANG_MAP[n] || "ko";

        // i18n 변경 적용
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);

        alert("언어가 변경되었습니다!");
        navigate("/mypage");
    };

  const saveLangNo = (langNo) => {
    const n = Number(langNo);
    if (!Number.isFinite(n) || n <= 0) return false;
    localStorage.setItem("selectedLangNo", String(n));
    return true;
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("/saykorean/study/getlang");
        const list = Array.isArray(res.data) ? res.data : [];
        setLanguages(list);

        // 저장값이 없고 서버가 1개만 주면 자동 선택
        if ((!selectedLangNo || selectedLangNo <= 0) && list.length === 1) {
          pickLangNo(list[0].langNo); // 여기서 navigate 실행됨 (OK: 이펙트 내부)
        }
      } catch (e) {
        console.error(e);
        setError("언어 목록을 받지 못했어요.");
      } finally {
        setLoading(false);
      }
    })();
  }, []); // selectedLangNo 의존성 불필요

  return (
    <div id="Language">
      <div className="panel">
        <h3 className="panelTitle">언어 선택</h3>
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