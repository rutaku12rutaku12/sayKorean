import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function Ranking() {

    // [*] 상태 설정
    const [rankType, setRankType] = useState("accuracy"); // accuracy(정답왕) , challenge(도전왕) , persistence(끈기왕)
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userNo, setUserNo] = useState("");
    const [testItemNo, setTestItemNo] = useState("");
    const [results, setResults] = useState([]);
    const { t } = useTranslation();


    // [*] 렌더링 시 화면 초기화
    useEffect(() => {
        fetchRankings();
    }, [rankType]);

    // [1] 랭킹 통신
    const fetchRankings = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axios.get(`/saykorean/rank?type=${rankType}`);
            setRankings(res.data || []);
        } catch (e) {
            console.error(e);
            setError("랭킹을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    // [2] 선택한 랭킹 분야 가져오기
    const getRankTitle = () => {
        switch (rankType) {
            case "accuracy":
                return "🏆 정답왕 (정답률 높은 순)";
            case "challenge":
                return "🔥 도전왕 (문제 많이 푼 순)";
            case "persistence":
                return "💪 끈기왕 (재도전 많이 한 순)";
            default:
                return "랭킹";
        }
    };

    // [3] 랭킹 검색
    const handleSearch = async () => {
        try {
            setError("");
            let url = "";
            if (userNo && testItemNo) {
                url = `/saykorean/rank/search?userNo=${userNo}&testItemNo=${testItemNo}`;
            } else if (userNo) {
                url = `/saykorean/rank/search/user/${userNo}`;
            } else if (testItemNo) {
                url = `/saykorean/rank/search/item/${testItemNo}`;
            } else {
                setError("검색 조건을 입력해주세요.");
                return;
            }

            const res = await axios.get(url);
            setResults(res.data);
        } catch (e) {
            console.error(e);
            setError("조회 중 오류가 발생했습니다.");
        }
    };



    return (<>
  <div className="homePage">
    {/* ...생략(주석 블록 그대로 둠)... */}
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        🏅 {t("ranking.title")}
      </h2>

      {/* 탭 버튼 */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px" }}>
        <button
          onClick={() => setRankType("accuracy")}
        >
          🏆 {t("ranking.tab.accuracy")}
        </button>
        <button
          onClick={() => setRankType("challenge")}
          style={{
            padding: "10px 20px",
            backgroundColor: rankType === "challenge" ? "#FF9800" : "#ddd",
            color: rankType === "challenge" ? "white" : "black",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🔥 {t("ranking.tab.challenge")}
        </button>
        <button
          onClick={() => setRankType("persistence")}
          style={{
            padding: "10px 20px",
            backgroundColor: rankType === "persistence" ? "#2196F3" : "#ddd",
            color: rankType === "persistence" ? "white" : "black",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          💪 {t("ranking.tab.persistence")}
        </button>
      </div>

      {/* 랭킹 타이틀 */}
      <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        {getRankTitle()}
      </h3>

      {/* 로딩 및 에러 */}
      {loading && <p style={{ textAlign: "center" }}>{t("common.loading")}</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

      {/* 랭킹 목록 */}
      {!loading && !error && rankings.length === 0 && (
        <p style={{ textAlign: "center", color: "#999" }}>{t("ranking.empty")}</p>
      )}

      {!loading && rankings.length > 0 && (
        <div style={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "15px", textAlign: "center", width: "80px" }}>{t("ranking.th.place")}</th>
                <th style={{ padding: "15px", textAlign: "left" }}>{t("ranking.th.nickname")}</th>
                {rankType === "accuracy" && (
                  <>
                    <th style={{ padding: "15px", textAlign: "center" }}>{t("ranking.th.accuracy")}</th>
                    <th style={{ padding: "15px", textAlign: "center" }}>{t("ranking.th.correct")}</th>
                    <th style={{ padding: "15px", textAlign: "center" }}>{t("ranking.th.total")}</th>
                  </>
                )}
                {rankType === "challenge" && (
                  <>
                    <th style={{ padding: "15px", textAlign: "center" }}>{t("ranking.th.totalSolved")}</th>
                    <th style={{ padding: "15px", textAlign: "center" }}>{t("ranking.th.correct")}</th>
                  </>
                )}
                {rankType === "persistence" && (
                  <>
                    <th style={{ padding: "15px", textAlign: "center" }}>{t("ranking.th.avgRetry")}</th>
                    <th style={{ padding: "15px", textAlign: "center" }}>{t("ranking.th.uniqueItems")}</th>
                    <th style={{ padding: "15px", textAlign: "center" }}>{t("ranking.th.totalAttempts")}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {rankings.map((rank, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #eee",
                    backgroundColor: index < 3 ? "#fffbf0" : "white",
                  }}
                >
                  <td style={{ padding: "15px", textAlign: "center", fontWeight: "bold", fontSize: "18px" }}>
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && t("ranking.placeN", { n: index + 1 })}
                  </td>
                  <td style={{ padding: "15px", fontWeight: index < 3 ? "bold" : "normal" }}>
                    {rank.nickName}
                  </td>
                  {rankType === "accuracy" && (
                    <>
                      <td style={{ padding: "15px", textAlign: "center", color: "#4CAF50", fontWeight: "bold" }}>
                        {rank.accuracy}%
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>{rank.score}</td>
                      <td style={{ padding: "15px", textAlign: "center" }}>{rank.total}</td>
                    </>
                  )}
                  {rankType === "challenge" && (
                    <>
                      <td style={{ padding: "15px", textAlign: "center", color: "#FF9800", fontWeight: "bold" }}>
                        {rank.total}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>{rank.score}</td>
                    </>
                  )}
                  {rankType === "persistence" && (
                    <>
                      <td style={{ padding: "15px", textAlign: "center", color: "#2196F3", fontWeight: "bold" }}>
                        {parseFloat(rank.avgRound).toFixed(1)}{t("ranking.unit.times")}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>{rank.uniqueItems}</td>
                      <td style={{ padding: "15px", textAlign: "center" }}>{rank.totalAttempts}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 설명 */}
      <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
        <h4>📊 {t("ranking.info.title")}</h4>
        <ul style={{ lineHeight: "1.8" }}>
          <li>
            <strong>{t("ranking.tab.accuracy")}:</strong> {t("ranking.info.accuracy")}
          </li>
          <li>
            <strong>{t("ranking.tab.challenge")}:</strong> {t("ranking.info.challenge")}
          </li>
          <li>
            <strong>{t("ranking.tab.persistence")}:</strong> {t("ranking.info.persistence")}
          </li>
        </ul>
      </div>
    </div>
  </div>
</>)

}