import "../styles/TestResult.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

export default function TestResult() {
  const navigate = useNavigate();
  const { testNo } = useParams();
  const { t } = useTranslation();
  
  // 🎯 초기값을 null 대신 객체로 설정
  const [score, setScore] = useState({ score: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        
        // 🎯 userNo를 세션에서 가져오는 것이 이상적
        // 임시로 1 사용 (실제로는 세션 정보 필요)
        const res = await axios.get("/saykorean/test/getscore", {
          params: { userNo: 1, testNo, testRound: 1 }
        });
        
        console.log("📊 점수 데이터:", res.data);
        
        // 🎯 null 체크 및 기본값 설정
        const data = res.data || { score: 0, total: 0 };
        setScore({
          score: data.score ?? 0,
          total: data.total ?? 0
        });
      } catch (e) {
        console.error("❌ 점수 조회 실패:", e);
        setError(t("test.result.loadError") || "점수를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [testNo, t]);

  const returnTest = () => {
    navigate("/testlist");
  };

  // 🎯 만점 여부 확인
  const isPerfect = score.score === score.total && score.total > 0;

  return (
    <div id="TestResult" className="homePage">
      <h3 className="panelTitle">{t("test.result.title") || "시험 결과"}</h3>
      
      {loading && (
        <div className="panel">
          <p>{t("common.loading") || "불러오는 중..."}</p>
        </div>
      )}

      {error && (
        <div className="panel">
          <p className="error">{error}</p>
          <button className="returnBtn" onClick={returnTest}>
            {t("test.result.return") || "테스트 화면으로 돌아가기"}
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="panel">
          {/* 🎯 조건부 이미지 렌더링 수정 */}
          {isPerfect ? (
            <img 
              className="testResultImg" 
              src="/img/test100.png" 
              alt="Perfect Score"
            />
          ) : (
            <img 
              className="testResultImg" 
              src="/img/testResultImg.png" 
              alt="Test Result"
            />
          )}
          
          <p className="scoreText">
            {t("test.result.score") || "정답"} {score.score} / {t("test.result.total") || "총"} {score.total}
          </p>
          
          {/* 🎯 합격/불합격 메시지 추가 */}
          <p className="resultMessage" style={{
            fontSize: '1.2em',
            fontWeight: 'bold',
            color: isPerfect ? '#28a745' : score.score >= score.total * 0.6 ? '#17a2b8' : '#dc3545',
            marginTop: '20px'
          }}>
            {isPerfect 
              ? t("test.result.perfect") || "🎉 완벽합니다!"
              : score.score >= score.total * 0.6
              ? t("test.result.pass") || "✅ 합격!"
              : t("test.result.fail") || "❌ 불합격"}
          </p>
          
          <button className="returnBtn" onClick={returnTest}>
            {t("test.result.return") || "테스트 화면으로 돌아가기"}
          </button>
        </div>
      )}
    </div>
  );
}