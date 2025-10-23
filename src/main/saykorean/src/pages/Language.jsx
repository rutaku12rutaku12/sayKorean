import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Language(props) {

    const navigate = useNavigate();
  // 목록은 배열, 선택값은 단일 값(번호)
  const [languages, setLanguages] = useState([]);
  const [selectedLangNo, setSelectedLangNo] = useState(() => {
    const saved = Number(localStorage.getItem("selectedLangNo"));
    return Number.isFinite(saved) && saved > 0 ? saved : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 선택값 저장 (단일)
  const saveLangNo = (langNo) => {
    const n = Number(langNo);
    if (!Number.isFinite(n) || n <= 0) {
      console.warn("Invalid langNo: ", langNo);
      return false;
    }
    localStorage.setItem("selectedLangNo", String(n));
    console.log( "selectedLangNo : " + selectedLangNo );
    alert( "언어가 변경되었습니다!" );

    return true;
  };

  const pickLangNo = (langNo) => {
    if (!saveLangNo(langNo)) return;
    setSelectedLangNo(Number(langNo));
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("/saykorean/study/getlang");
        const list = Array.isArray(res.data) ? res.data : [];
        setLanguages(list);

        // 저장된 값이 없고 서버가 1개만 주면 자동 선택
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
    // selectedLangNo는 목록 로딩 후 결정되므로 의존성에 넣지 않음
  }, []);

  return (
    <>
      <div id="Language">
        <div className="panel">
          <h3 className="panelTitle">언어 선택</h3>

          {loading && <div className="toast loading">불러오는 중...</div>}
          {error && <div className="toast error">{error}</div>}

          <div className="list">
            {languages.map((l) => {
              const isActive = selectedLangNo == l.langNo;
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

          {/* 선택 상태 확인용 */}
          {/* <pre>selectedLangNo: {String(selectedLangNo ?? "")}</pre> */}
        </div>
      </div>
    </>
  );
}