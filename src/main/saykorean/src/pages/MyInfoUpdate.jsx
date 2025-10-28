import "../styles/Test.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useTranslation } from "react-i18next";

export default function Test() {
  const { t } = useTranslation();
  const { testNo } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [curIndex, setCurIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedExamNo, setSelectedExamNo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("TEXT");
  const [langNo, setLangNo] = useState(1);

  const cur = items[curIndex] ?? {};

  // 언어 설정 로드
  useEffect(() => {
    const stored = localStorage.getItem("selectedLangNo");
    const n = Number(stored);
    setLangNo(Number.isFinite(n) ? n : 1);
  }, []);

  // 타입 판단
  function detectType(item) {
    if (!item) return "TEXT";
    if (item.imagePath) return "IMG";
    if (item.audios && item.audios.length > 0) return "AUDIO";
    return "TEXT";
  }

  // 문제 로드
  useEffect(() => {
    if (!langNo) return;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get("/saykorean/test/findtestitem", {
          params: { testNo, langNo }
        });
        const list = Array.isArray(res.data) ? res.data : [];
        setItems(list);
        if (list.length > 0) {
          setType(detectType(list[0]));
        }
      } catch (e) {
        console.error(e);
        alert(t("test.options.loadError"));
      } finally {
        setLoading(false);
      }
    })();
  }, [langNo, testNo, t]);

  // 타입 업데이트
  useEffect(() => {
    if (cur) setType(detectType(cur));
  }, [cur]);

  const onSelect = (examNo) => {
    setSelectedExamNo(examNo);
  };

  const onSubmit = async () => {
    try {
      const body = {
        testRound: 1,
        selectedExamNo,
        userAnswer,
        langHint: ["ko", "en", "ja", "zh", "es"][langNo - 1] ?? "ko"
      };

      const res = await axios.post(
        `/saykorean/test/${testNo}/items/${cur.testItemNo}/answer`,
        body,
        { withCredentials: true }
      );

      const { score, isCorrect } = res.data;
      alert(isCorrect ? t("test.feedback.correct") : t("test.feedback.wrong"));

      if (curIndex + 1 < items.length) {
        setCurIndex(curIndex + 1);
        setUserAnswer("");
        setSelectedExamNo(null);
      } else {
        navigate(`/testresult/${testNo}`);
      }
    } catch (e) {
      console.error(e);
      alert("제출 중 오류가 발생했습니다.");
    }
  };

  if (loading || !items.length) return <div>{t("common.loading")}</div>;

  return (
    <div id="Test" className="homePage">
      <div className="panel">
        <h3 className="panelTitle">{t("test.title")}</h3>

        {/* ====== 문제 표시 (유형 자동 분기) ====== */}
        {type === "IMG" && (
          <>
            {cur.imagePath && (
              <div className="q-media">
                <img
                  src={cur.imagePath}
                  alt={cur.imageName || "img"}
                  style={{ maxWidth: 320 }}
                />
              </div>
            )}

            <div className="options">
              {cur.options?.map((opt) => (
                <button
                  key={opt.examNo}
                  className={`pillBtn ${
                    selectedExamNo === opt.examNo ? "selected" : ""
                  }`}
                  onClick={() => onSelect(opt.examNo)}
                >
                  {opt.examText ?? opt.examNo}
                </button>
              ))}
            </div>

            <button className="pillBtn" onClick={onSubmit}>
              {t("test.submit")}
            </button>
          </>
        )}

        {type === "AUDIO" && (
          <>
            {cur.audios?.[0]?.audioPath && (
              <audio controls src={cur.audios[0].audioPath} />
            )}

            <div className="options">
              {cur.options?.map((opt) => (
                <button
                  key={opt.examNo}
                  className={`pillBtn ${
                    selectedExamNo === opt.examNo ? "selected" : ""
                  }`}
                  onClick={() => onSelect(opt.examNo)}
                >
                  {opt.examText ?? opt.examNo}
                </button>
              ))}
            </div>

            <button className="pillBtn" onClick={onSubmit}>
              {t("test.submit")}
            </button>
          </>
        )}

        {type === "TEXT" && (
          <>
            <p className="question-text">{cur.questionSelected}</p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={t("test.subjective.placeholder")}
              className="textbox"
            />
            <button className="pillBtn" onClick={onSubmit}>
              {t("test.submit")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
