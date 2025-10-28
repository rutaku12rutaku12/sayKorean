import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../styles/Test.css";

axios.defaults.withCredentials = true;

export default function Test() {
  const { testNo } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subjective, setSubjective] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [langNo, setLangNo] = useState(1);

  // 로컬스토리지에서 언어 번호 가져오기
  function getLang() {
    const stored = localStorage.getItem("selectedLangNo");
    const n = Number(stored);
    setLangNo(Number.isFinite(n) && n > 0 ? n : 1);
  }

  // 안전한 문자열 체크
  const safeSrc = (s) => (typeof s === "string" && s.trim() !== "" ? s : null);

  // 컴포넌트 마운트 시 언어 설정
  useEffect(() => {
    getLang();
  }, []);

  // 시험 문항 로드
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
        console.log("📥 받은 문항 데이터:", list);
        setItems(list);
        setIdx(0);
        setSubjective("");
        setFeedback(null);
      } catch (e) {
        console.error("❌ 문항 로드 실패:", e);
        setMsg(t("test.options.loadError"));
      } finally {
        setLoading(false);
      }
    })();
  }, [testNo, langNo, t]);

  // 현재 문항
  const cur = items[idx];

  // 🎯 미디어 기반 타입 판별
  const hasImage = cur?.imagePath && safeSrc(cur.imagePath);
  const hasAudio = cur?.audios && Array.isArray(cur.audios) && cur.audios.length > 0;
  const isMultiple = hasImage || hasAudio;
  const isSubjective = !isMultiple;

  console.log("🔍 문항 타입:", {
    testItemNo: cur?.testItemNo,
    hasImage,
    hasAudio,
    isMultiple,
    isSubjective,
    optionsCount: cur?.options?.length
  });

  // 답안 제출
  async function submitAnswer(selectedExamNo = null) {
    if (!cur) return;

    const body = {
      testRound: 1,
      selectedExamNo: selectedExamNo ?? 0,
      userAnswer: selectedExamNo ? "" : subjective,
      langNo
    };

    const url = `/saykorean/test/${testNo}/items/${cur.testItemNo}/answer`;

    // 주관식이면 로딩 페이지로
    if (isSubjective && !selectedExamNo) {
      navigate("/loading", {
        state: {
          action: "submitAnswer",
          payload: { testNo, url, body },
        },
      });
      return;
    }

    // 객관식 바로 제출
    try {
      setSubmitting(true);
      const res = await axios.post(url, body);
      const { score, isCorrect } = res.data || {};
      setFeedback({ 
        correct: isCorrect == 1, 
        score: Number(score) || 0 
      });
    } catch (e) {
      console.error("❌ 답안 제출 실패:", e);
      alert(t("test.options.loadError"));
    } finally {
      setSubmitting(false);
    }
  }

  // 다음 문항 또는 결과 페이지로
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
      <h3>{t("test.title")}</h3>

      {loading && <p>{t("common.loading")}</p>}
      {msg && <p className="error">{msg}</p>}
      {items.length === 0 && !loading && <p>{t("test.empty")}</p>}

      {cur && (
        <div className="question-card">
          {/* 문항 번호 및 질문 */}
          <div className="q-head">
            <span className="q-number">
              {idx + 1} / {items.length}
            </span>
            <p className="q-text">{cur.questionSelected}</p>
          </div>

          {/* 🖼️ 이미지 */}
          {hasImage && (
            <div className="q-media">
              <img
                src={safeSrc(cur.imagePath)}
                alt={cur.imageName || "question"}
                style={{ maxWidth: 320, borderRadius: '8px' }}
              />
            </div>
          )}

          {/* 🎵 오디오 (개선된 UI) */}
          {hasAudio && (
            <div className="q-audios">
              {cur.audios
                .filter(a => safeSrc(a?.audioPath))
                .map(a => (
                  <div key={a.audioNo} className="audio-item">
                    <audio 
                      controls 
                      src={safeSrc(a.audioPath)}
                      style={{ width: '100%', maxWidth: '480px' }}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ))}
            </div>
          )}

          {/* 객관식 보기 */}
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
                    {/* 🎯 언어별 예문 표시 */}
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
            /* 주관식 입력 */
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
                disabled={subjective.trim() === "" || submitting}
                onClick={() => submitAnswer(null)}
              >
                {submitting ? t("common.loading") : t("test.submit")}
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