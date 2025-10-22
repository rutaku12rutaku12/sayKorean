import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Test() {
  const { testNo } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(
            "/saykorean/test/findtestitem",
             { params: { testNo } }
            );
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch {
        setMsg("불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [testNo]);

  async function submitAnswer(testItemNo, selectedExamNo, userAnswer = "", langHint = "ko") {
    try {
      const body = {
        testRound: 1,
        selectedExamNo, // 객관식이면 examNo 전달
        userAnswer,     // 서술형이면 입력값 전달
        langHint
      };
      const res = await axios.post(`/saykorean/test/test/${testNo}/items/${testItemNo}/free`, body);
      navigate(`/result/${testNo}`);
    } catch (e) {
      console.error(e);
      alert("제출 실패");
    }
  }

  return (
    <div>
      <h3>시험 문항</h3>
      {loading && <p>불러오는 중...</p>}
      {msg && <p>{msg}</p>}

      {items.map((q) => (
        <div key={q.testItemNo} className="question-card">
          <p>{q.testItemNo}. {q.question}</p>

          {/* 객관식 예시 */}
          {q.options?.map((opt) => (
            <button key={opt.examNo} onClick={() => submitAnswer(q.testItemNo, opt.examNo)}>
              {opt.label}
            </button>
          ))}

          {/* 서술형 예시 */}
          {!q.options && (
            <textarea
              placeholder="답을 입력하세요"
              onBlur={(e) => submitAnswer(q.testItemNo, null, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}