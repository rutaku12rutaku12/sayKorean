import { useEffect, useState } from "react";
import axios from "axios";    
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/SuccessExamList.css"

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8080";

export default function SuccessExamList( props ){

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  // ✅ 언어를 '처음 렌더 전에' 바로 결정 (즉시 렌더 위해 lazy init)
  const [langNo, setLangNo] = useState(() => {
    const stored = Number(localStorage.getItem("selectedLangNo"));
    return Number.isFinite(stored) && stored > 0 ? stored : 1; // ko=1
  });

  // ✅ 로컬에서 ID를 즉시 읽어 '바로' 그릴 수 있도록 초기값 구성
  //    -> placeholder로 먼저 그렸다가, 아래 useEffect에서 상세를 하이드레이트
  const [studies, setStudies] = useState(() => {
    try {
      const raw = localStorage.getItem("studies");
      const ids = raw ? JSON.parse(raw) : [];
      const idArr = Array.isArray(ids)
        ? ids.map(Number).filter(n => Number.isFinite(n) && n > 0)
        : [];
      return idArr.map(id => ({ studyNo: id })); // themeSelected는 나중에 채움
    } catch {
      return [];
    }
  });

  function getStudiesFromLocal() {
    try {
      const studies = localStorage.getItem("studies");
      const arr = studies ? JSON.parse(studies) : [];
      return Array.isArray(arr)
        ? arr.map(Number).filter(n => Number.isFinite(n) && n > 0)
        : [];
    } catch {
      return [];
    }
  }

  // 언어 설정 가져오기 (selectedLangNo 사용) — 필요 시 수동 재동기화용
  function getLang() {
    const stored = localStorage.getItem("selectedLangNo");
    const n = Number(stored);
    setLangNo(Number.isFinite(n) && n > 0 ? n : 1);
  }

  // 주제 상세 (백엔드에서 themeSelected/commenSelected 내려줌)
  async function fetchStudyDetail(studyNoValue, langNoValue) {
    const res = await axios.get("/saykorean/study/getDailyStudy", {
      params: { studyNo: studyNoValue, langNo: langNoValue }
    });
    console.log(res.data); // ← 오타(console) 수정
    return res.data;
  }

  // ✅ 마운트 시 언어 동기화(옵션) — 이미 lazy init 했으므로 필수는 아님
  useEffect(() => {
    getLang(); // 필요 없으면 지워도 OK
  }, []);

  // ✅ 하이드레이트: 언어가 확정되면 로컬 ID들로 상세를 병렬 조회해 치환
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const ids = getStudiesFromLocal();
        if (ids.length === 0) {
          setStudies([]);
          return;
        }

        const details = await Promise.all(
          ids.map(id => fetchStudyDetail(id, langNo).catch(() => null))
        );
        setStudies(details.filter(Boolean)); // themeSelected 포함된 실제 데이터
      } catch (e) {
        console.error(e);
        setError("완수한 주제 목록을 불러오는 중 문제가 발생했어요.");
      } finally {
        setLoading(false);
      }
    })();
  }, [langNo]);

  return (
    <>
      <div className="homePage">
        <h3>{t("successList.title")}</h3>

        {loading && <div className="toast loading">{t("common.loading")}</div>}
        {error && <div className="toast error">{error}</div>}

        <ul className="successExamListWrap">
          {(Array.isArray(studies) ? studies : []).map((s) => (
            <li key={s.studyNo} className="successExamList">
              <div className="study">
                {/* 즉시 렌더: themeSelected 없으면 fallback으로 '주제 #번호' */}
                {s.themeSelected ?? s.themeKo ?? t("successList.fallbackTitle", { num: s.studyNo })}
                <button onClick={() => navigate(`/study/${s.studyNo}`)}>
                  {t("successList.go")}
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div>
          {!loading && !error && studies.length === 0 && (
            <div className="empty">{t("successList.empty")}</div>
          )}
        </div>
      </div>
    </>
  );
}
