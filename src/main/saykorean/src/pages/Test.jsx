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
  const [langNo, setLangNo] = useState(null); // null로 초기화! 그래야 한국어 렌더링되는 사태 방지
  const [testRound, setTestRound] = useState(null);
  const [ userNo, setUserNo ] = useState("");

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

  // 시험 문항 로드 (langNo가 설정된 후에만 실행)
  useEffect(() => {
    if (langNo == null) return; // null일때는 로드 안되게 체크

    (async () => {
      try {
        setLoading(true);
        setMsg("");

        // 🎯 testRound 계산: 기존 최대값 + 1
        // 시험 시작 시 다음 회차 번호 조회
        const roundRes = await axios.get("/saykorean/test/getnextround" , {
          params : {testNo} 
        });
        const nextRound = roundRes.data || 1; 
        setTestRound(nextRound);
        console.log("이번 시험 회차:" , nextRound);

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
  // const hasImage = cur?.imagePath && safeSrc(cur.imagePath);
  // const hasAudio = cur?.audios && Array.isArray(cur.audios) && cur.audios.length > 0;
  // const isMultiple = hasImage || hasAudio;
  // const isSubjective = !isMultiple;

  // 🎯 핵심 수정: 문항 순서로 타입 판별
  // 1번째(idx=0) = 그림 + 객관식
  // 2번째(idx=1) = 음성 + 객관식
  // 3번째(idx=2) = 주관식
  // 이후 반복: 3n+1 = 그림, 3n+2 = 음성, 3n = 주관식
  const questionType = idx % 3; // 0=그림, 1=음성, 2=주관식
  const isImageQuestion = questionType === 0;
  const isAudioQuestion = questionType === 1;
  const isSubjective = questionType === 2;
  const isMultiple = !isSubjective;

  // 실제 미디어 존재 여부 (표시용)
  const hasImage = cur?.imagePath && safeSrc(cur.imagePath);
  const hasAudio = cur?.audios && Array.isArray(cur.audios) && cur.audios.length > 0;

  console.log("🔍 문항 타입:", {
    testItemNo: cur?.testItemNo,
    idx,            // 추가
    questionType,   // 추가
    isImageQuestion,  // 추가
    isAudioQuestion,  // 추가
    isSubjective,
    hasImage,
    hasAudio,
    // isMultiple,
    examSelected: cur?.examSelected,  // 추가 (예문 표시하는 로직 추가용)
    optionsCount: cur?.options?.length
  });

  // 답안 제출
  async function submitAnswer(selectedExamNo = null) {
    if (!cur) return;
    if (testRound === null) return; // 🎯 testRound 체크

    const body = {
      testRound: testRound, // testRound의 고정값 삭제
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
      {/* <h3>{t("test.title")}</h3> */}

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
          {/* {hasImage && (
            <div className="q-media">
              <img
                src={safeSrc(cur.imagePath)}
                alt={cur.imageName || "question"}
                style={{ maxWidth: 320, borderRadius: '8px' }}
              />
            </div>
          )} */}

          {/* 🖼️ 이미지 (1번째 문항에서만 표시) */}
          {isImageQuestion && hasImage && (
            <div className="q-media">
              <img
                src={safeSrc(cur.imagePath)}
                alt={cur.imageName || "question"}
                style={{ maxWidth: 320, borderRadius: '8px' }}
              />
            </div>
          )}

          {/* 🎵 오디오 (개선된 UI) */}
          {/* {hasAudio && (
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
          )} */}

          {/* 🎵 오디오 (2번째 문항에서만 표시) */}
          {isAudioQuestion && hasAudio && (
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

          {/* 📝 주관식 예문 표시 (3번째 문항) */}
{isSubjective && cur.examSelected && (
  <div className="q-example">
    {/* <p className="title">
    </p> */}
    <p className="content">
      {cur.examSelected}
    </p>
  </div>
)}

          {/* 객관식 보기 (1, 2번째 문항) */}
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
                placeholder={t("test.subjective.placeholder") || "한국어로 답변을 작성하세요"}
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