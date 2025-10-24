import "../styles/TestResult.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

export default function TestResult() {

  const navigate = useNavigate();


  const { testNo } = useParams();
  const [score, setScore] = useState(null);
  const [, setGenreName] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/saykorean/test/getscore", {
          params: { userNo: 1, testNo, testRound: 1 }
        });
        setScore(res.data);
        console.log( res.data );
      } catch (e) {
        console.error(e);
      }
    })();
  }, [testNo]);

  const returnTest = async() => {
    navigate("/testlist");
  }

  return (
    <div id="TestResult">
      <h3 className="panelTitle">시험 결과</h3>
      <div className="panel">
        <img className="testResultImg" src="/img/testResultImg.png" alt="시험 채점" />
        {score && (
          <p className="scoreText">
            정답 {score.score} / 총 {score.total}
          </p>
        )}
        <button className="returnBtn" onClick={returnTest}>테스트 화면으로 돌아가기</button>
      </div>
    </div>
  );
}
