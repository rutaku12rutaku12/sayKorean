import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TestResult() {
  const { testNo } = useParams();
  const [score, setScore] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/saykorean/test/getscore", {
          params: { userNo: 1, testNo, testRound: 1 }
        });
        setScore(res.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [testNo]);

  return (
    <div>
      <h3>시험 결과</h3>
      {score && (
        <p>
          정답 {score.score} / 총 {score.total}
        </p>
      )}
    </div>
  );
}
