import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

axios.defaults.withCredentials = true;

export default function Test() {
  const { testNo } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();


  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);              // 현재 문제 인덱스
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const location = useLocation();


  const [submitting, setSubmitting] = useState(false);
  const [subjective, setSubjective] = useState(""); // 주관식 입력값
  const [feedback, setFeedback] = useState(null);   // {correct:boolean, score:number}

  const safeSrc = (s) => (typeof s === "string" && s.trim() !== "" ? s : null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setMsg("");
        const res = await axios.get("/saykorean/test/findtestitem", {
          params: { testNo },
        });
        const list = Array.isArray(res.data) ? res.data : [];
        setItems(list);
        setIdx(0);
        setSubjective("");
        setFeedback(null);
      } catch (e) {
        console.error(e);
        setMsg("불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [testNo]);

  const cur = items[idx];
  const isMultiple =
    cur?.question?.startsWith("그림:") || cur?.question?.startsWith("음성:");

  async function submitAnswer(selectedExamNo = null) {
  if (!cur) return;

  const body = {
    testRound: 1,
    selectedExamNo: selectedExamNo ?? 0,
    userAnswer: selectedExamNo ? "" : subjective,
    langHint: "ko",
  };

  const url = `/saykorean/test/${testNo}/items/${cur.testItemNo}/answer`;

  // 주관식이면 로딩페이지로 이동
  if (!selectedExamNo) {
    const backTo = location.pathname + location.search;
    navigate("/loading", {
      state: {
        action: "submitAnswer",
        payload: {
          testNo,    // 추가
          url,
          body
        }
      }
    });
      return;
  }

  // 객관식이면 바로 채점 요청 수행
  try {
    setSubmitting(true);
    const res = await axios.post(url, body);
    const { score, isCorrect } = res.data || {};
    setFeedback({ correct: isCorrect == 1, score: Number(score) || 0 });
  } catch (e) {
    console.error(e);
    alert("제출 실패");
  } finally {
    setSubmitting(false);
  }
}
  function goNext() {
    // 다음 문제로 이동. 마지막이면 결과 페이지로 이동
    if (idx < items.length - 1) {
      setIdx(idx + 1);
      setSubjective("");
      setFeedback(null);
    } else {
      navigate(`/testresult/${testNo}`);
    }
  }

return (
  <div className="test-page">
    <h3>{t("test.title")}</h3>

    {loading && <p>{t("common.loading")}</p>}
    {msg && <p className="error">{msg}</p>}
    {items.length === 0 && !loading && <p>{t("test.empty")}</p>}

    {cur && (
      <div className="question-card">
        <div className="q-head">
          <span className="q-number">
            {idx + 1} / {items.length}
          </span>
          <p className="q-text">{cur.question}</p>
        </div>

        {/* 이미지 */}
        {safeSrc(cur?.imagePath) && (
          <div className="q-media">
            <img
              src={safeSrc(cur.imagePath)}
              alt={cur.imageName || "question"}
              style={{ maxWidth: 320 }}
            />
          </div>
        )}

        {/* 오디오 */}
        {Array.isArray(cur?.audios) &&
          cur.audios.filter(a => safeSrc(a?.audioPath)).length > 0 && (
            <div className="q-audios">
              {cur.audios
                .filter(a => safeSrc(a?.audioPath))
                .map(a => (
                  <audio key={a.audioNo} controls src={safeSrc(a.audioPath)} />
                ))}
            </div>
          )}

        {/* 객관식 */}
        {isMultiple ? (
          <div className="q-actions">
            {cur.options && cur.options.length > 0 ? (
              cur.options.map((option, optIdx) => (
                <button
                  key={optIdx}
                  className="btn option-btn"
                  disabled={submitting || !!feedback}
                  onClick={() => submitAnswer(option.examNo)}
                  style={{
                    display: "block",
                    width: "100%",
                    maxWidth: "480px",
                    margin: "10px auto",
                    padding: "15px",
                    fontSize: "16px",
                    textAlign: "left",
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: feedback
                      ? option.isCorrect
                        ? "#d4edda"
                        : "#f8d7da"
                      : "#fff",
                    cursor: submitting || feedback ? "not-allowed" : "pointer",
                  }}
                >
                  {option.examKo}
                </button>
              ))
            ) : (
              <p style={{ color: "#999" }}>
                {t("test.options.loadError")}
              </p>
            )}
          </div>
        ) : (
          // 주관식
          <div className="q-actions">
            <textarea
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              placeholder={t("test.subjective.placeholder")}
              disabled={submitting || !!feedback}
              rows={4}
              style={{ width: "100%", maxWidth: 480 }}
            />
            <button
              className="btn primary"
              disabled={submitting || !!feedback || subjective.trim() === ""}
              onClick={() => submitAnswer(null)}
            >
              {t("test.submit")}
            </button>
          </div>
        )}

        {/* 피드백 */}
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
              {typeof feedback.score === "number" && !isMultiple && (
                <span style={{ marginLeft: 8 }}>{feedback.score}{t("test.score.unit")}</span>
              )}
            </div>
            <button
              className="btn next"
              onClick={goNext}
              style={{
                padding: "12px 30px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
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
