import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Test() {
  const { testNo } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);              // 현재 문제 인덱스
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  

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

  /* 정답 제출 (객관식/주관식 공통) */
  async function submitAnswer(selectedExamNo = null) {
    if (!cur) return;
    try {
      setSubmitting(true);
      const body = {
        testRound: 1,
        selectedExamNo : selectedExamNo ?? 0,                  // 객관식이면 examNo
        userAnswer: selectedExamNo ? "" : subjective, // 주관식이면 입력값
        langHint: "ko",
      };

      const res = await axios.post(
        `/saykorean/test/${testNo}/items/${cur.testItemNo}/answer`,
        body
      );

      const { score, isCorrect } = res.data || {};
      setFeedback({ correct: isCorrect == 1, score: Number(score) || 0 });

      // 피드백 보여주고 “다음 문제” 버튼 활성화
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
      <h3>시험 문항</h3>
      {loading && <p>불러오는 중...</p>}
      {msg && <p className="error">{msg}</p>}
      {items.length === 0 && !loading && <p>문항이 없습니다.</p>}

      {cur && (
        <div className="question-card">
          <div className="q-head">
            <span className="q-number">{idx + 1} / {items.length}</span>
            <p className="q-text">{cur.question}</p>
          </div>

          
                  {/* 이미지는 src가 유효할 때만 렌더 */}
                  {safeSrc(cur?.imagePath) && (
                      <div className="q-media">
                          <img
                              src={safeSrc(cur.imagePath)}
                              alt={cur.imageName || "question"}
                              style={{ maxWidth: 320 }}
                          />
                      </div>
                  )}

                  {/* 오디오는 유효한 src만 필터링해서 렌더 */}
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

          {/* 객관식: examKo 한 보기(또는 옵션 테이블 쓰면 options.map으로 변경) */}
          {isMultiple ? (
            <div className="q-actions">
              <button
                className="btn"
                disabled={submitting || !!feedback}
                onClick={() => submitAnswer(cur.examNo)}
              >
                {cur.examKo}
              </button>
            </div>
          ) : (
            // 주관식
            <div className="q-actions">
              <textarea
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                placeholder="답을 입력하세요"
                disabled={submitting || !!feedback}
                rows={4}
                style={{width: "100%", maxWidth: 480}}
              />
              <button
                className="btn primary"
                disabled={submitting || !!feedback || subjective.trim() === ""}
                onClick={() => submitAnswer(null)}
              >
                제출
              </button>
            </div>
          )}

          {/* 피드백 뱃지 + 다음 문제 버튼 */}
          {feedback && (
            <div className="feedback">
              <div className={`toast ${feedback.correct ? "ok" : "no"}`}>
                {feedback.correct ? "정답!" : "오답!"}
                {typeof feedback.score === "number" && !isMultiple }
              </div>
              <button className="btn next" onClick={goNext}>
                {idx < items.length - 1 ? "다음 문제" : "결과 보기"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
