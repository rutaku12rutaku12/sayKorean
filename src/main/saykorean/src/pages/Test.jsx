import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Test.css";

axios.defaults.withCredentials = true;

export default function Test() {
  const { testNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subjective, setSubjective] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [langNo, setLangNo] = useState(1);

  function getLang() {
    const stored = localStorage.getItem("selectedLangNo");
    const n = Number(stored);
    setLangNo(Number.isFinite(n) ? n : 1);
  }

  const safeSrc = (s) => (typeof s === "string" && s.trim() !== "" ? s : null);

  useEffect(() => {
    getLang();
  }, []);

  useEffect(() => {
    if (!langNo) return;

    (async () => {
      try {
        setLoading(true);
        setMsg("");
        const res = await axios.get("/saykorean/test/findtestitem", {
          params: { testNo, langNo },
        });
        const list = Array.isArray(res.data) ? res.data : [];
        setItems(list);
        setIdx(0);
        setSubjective("");
        setFeedback(null);
      } catch (e) {
        console.error(e);
        setMsg(t("test.options.loadError"));
      } finally {
        setLoading(false);
      }
    })();
  }, [testNo, langNo, t]);

  const cur = items[idx];
  const norm = (cur?.questionSelected || "").trim().replace(/\s+/g, "");
  const isImageMC = norm.startsWith("그림:");
  const isAudioMC = norm.startsWith("음성:");
  const isSubjective = norm.startsWith("주관식:");
  const isMultiple = isImageMC || isAudioMC;


  async function submitAnswer(selectedExamNo = null) {
    if (!cur) return;

    const body = {
      testRound: 1,
      selectedExamNo: selectedExamNo ?? 0,
      userAnswer: selectedExamNo ? "" : subjective,
      langNo
    };

    const url = `/saykorean/test/${testNo}/items/${cur.testItemNo}/answer`;

    if (isSubjective && !selectedExamNo) {
      navigate("/loading", {
        state: {
          action: "submitAnswer",
          payload: { testNo, url, body },
        },
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post(url, body);
      const { score, isCorrect } = res.data || {};
      setFeedback({ correct: isCorrect == 1, score: Number(score) || 0 });
    } catch (e) {
      console.error(e);
      alert(t("test.options.loadError"));
    } finally {
      setSubmitting(false);
    }
  }

  function goNext() {
    if (idx < items.length - 1) {
      setIdx(idx + 1);
      setSubjective("");
      setFeedback(null);
    } else {
      navigate(`/testresult/${testNo}`);
    }
  }


  return (
    <div id="test-page" className="homePage">
      {/* <h3>{t("test.title")}</h3> */}

      {loading && <p>{t("common.loading")}</p>}
      {msg && <p className="error">{msg}</p>}
      {items.length === 0 && !loading && <p>{t("test.empty")}</p>}

      {cur && (
        <div className="question-card">
          <div className="q-head">
            <span className="q-number">
              {idx + 1} / {items.length}
            </span>
            <p className="q-text">{cur.questionSelected}</p>
          </div>

          {isImageMC && safeSrc(cur?.imagePath) && (
            <div className="q-media">
              <img
                src={safeSrc(cur.imagePath)}
                alt={cur.imageName || "question"}
                style={{ maxWidth: 320 }}
              />
            </div>
          )}

          {isAudioMC && Array.isArray(cur?.audios) && (
            <div className="q-audios">
              {cur.audios
                .filter(a => safeSrc(a?.audioPath))
                .map(a => (
                  <audio key={a.audioNo} controls src={safeSrc(a.audioPath)} />
                ))}
            </div>
          )}

          {isMultiple ? (
            <div className="q-actions">
              {cur.options?.length > 0 ? (
                cur.options.map((option, i) => (
                  <button
                    key={i}
                    className="btn option-btn"
                    disabled={!!feedback}
                    onClick={() => submitAnswer(option.examNo)}
                  >
                    {option.examSelected || option.examKo || t("test.options.loadError")}
                  </button>
                ))
              ) : (
                <p style={{ color: "#999" }}>
                  {t("test.options.loadError")}
                </p>
              )}
            </div>
          ) : (
            <div className="q-actions">
              <textarea
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                placeholder={t("test.subjective.placeholder")}
                disabled={!!feedback}
                rows={4}
                style={{ width: "100%", maxWidth: 480 }}
              />
              <button
                className="btn primary"
                disabled={subjective.trim() === ""}
                onClick={() => submitAnswer(null)}
              >
                {t("test.submit")}
              </button>
            </div>
          )}

          {feedback && (
            <div className="feedback" style={{ marginTop: "20px" }}>
              <div
                className={`toast ${feedback.correct ? "ok" : "no"}`}
                style={{
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  backgroundColor: feedback.correct ? "#d4edda" : "#f8d7da",
                  color: feedback.correct ? "#155724" : "#721c24",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {feedback.correct
                  ? t("test.feedback.correct")
                  : t("test.feedback.wrong")}
                {typeof feedback.score === "number" && isSubjective && (
                  <span style={{ marginLeft: 8 }}>
                    {feedback.score}{t("test.score.unit")}
                  </span>
                )}
              </div>
              <button className="btn next" onClick={goNext}>
                {idx < items.length - 1
                  ? t("test.next")
                  : t("test.result.view")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

