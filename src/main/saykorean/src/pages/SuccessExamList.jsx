import { useEffect, useState } from "react";
import axios from "axios";    
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/SuccessExamList.css"

axios.defaults.withCredentials = true;

export default function SuccessExamList( props ){

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [studies, setStudies] = useState([]);
    const { t } = useTranslation();


    function getStudiesFromLocal() {
    try {
      const studies = localStorage.getItem("studies");
      const arr = studies ? JSON.parse(studies) : [];
      console.log( arr );
      return Array.isArray(arr)
        ? arr.map(Number).filter(n => Number.isFinite(n) && n > 0)
        : [];
    } catch {
      return [];
    }

    }

    // study 상세 API
    async function fetchStudyDetail(studyNo) {
        const { data } = await axios.get("/saykorean/study/getDailyStudy", {
            params: { studyNo }
        });
        return data;
    }




    useEffect(() => {
        (async () => {
            try {
                // 1) 로컬에서 ID 목록 복구
                const studies = getStudiesFromLocal();
                if (studies.length == 0) {
                    setStudies([]); // 비어있으면 그대로 빈 배열
                    return;
                }
                // 2) 상세 병렬 조회
                const details = await Promise.all(
                    studies.map(studyNo =>
                        fetchStudyDetail(studyNo).catch(() => null) // 실패한 건 null
                    )
                );

                // 3) 유효한 것만 반영
                setStudies(details.filter(Boolean));
            } catch (e) {
                console.error(e);
                setError("완수한 주제 목록을 불러오는 중 문제가 발생했어요.");
            } finally {
                setLoading(false);
            }
        })(); // ← 반드시 호출!
    }, []); // 한 번만 실행


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
            {s.themeKo ?? t("successList.fallbackTitle", { num: s.studyNo })}
            <button onClick={() => navigate(`/exampleList/${s.studyNo}`)}>
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