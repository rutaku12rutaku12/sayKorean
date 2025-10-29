import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../styles/Ranking.css";

export default function Ranking() {

  const [rankType, setRankType] = useState("accuracy");
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userNo, setUserNo] = useState("");
  const [testItemNo, setTestItemNo] = useState("");
  const [results, setResults] = useState([]);
  // [*] UI 번역
  const { t } = useTranslation();

  useEffect(() => {
    fetchRankings();
  }, [rankType]);

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
  };

  const getRankTitle = () => {
    switch (rankType) {
      case "accuracy": return `🏆 ${t("ranking.accyracyKing")}`;
      case "challenge": return `🔥 ${t("ranking.challengeKing")}`;
      case "persistence": return `💪 ${t("ranking.persistenceKing")}`;
      default: return `${t("ranking.ranking")}`;
    }
  };

  const handleSearch = async () => {
    try {
      setError("");
      let url = "";
      if (userNo && testItemNo)
        url = `/saykorean/rank/search?userNo=${userNo}&testItemNo=${testItemNo}`;
      else if (userNo)
        url = `/saykorean/rank/search/user/${userNo}`;
      else if (testItemNo)
        url = `/saykorean/rank/search/item/${testItemNo}`;
      else {
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

  return (
    <div id="Ranking" className="homePage">
      <div className="panel">
        <h3 className="panelTitle">{t("ranking.title")}</h3>

        <div className="tabGroup">
          <button
            className={`tabBtn ${rankType === "accuracy" ? "active" : ""}`}
            onClick={() => setRankType("accuracy")}
          >
            🏆 {t("ranking.tab.accuracy")}
          </button>

          <button
            className={`tabBtn ${rankType === "challenge" ? "active" : ""}`}
            onClick={() => setRankType("challenge")}
          >
            🔥 {t("ranking.tab.challenge")}
          </button>

          <button
            className={`tabBtn ${rankType === "persistence" ? "active" : ""}`}
            onClick={() => setRankType("persistence")}
          >
            💪 {t("ranking.tab.persistence")}
          </button>
        </div>

        <h4 className="rankTitle">{getRankTitle()}</h4>

        {loading && <div className="toast">{t("common.loading")}</div>}
        {error && <div className="toast error">{error}</div>}

        {!loading && !error && rankings.length === 0 && (
          <p className="empty">{t("ranking.empty")}</p>
        )}

        {!loading && rankings.length > 0 && (
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>{t("ranking.th.place")}</th>
                  <th>{t("ranking.th.nickname")}</th>

                  {rankType === "accuracy" && (
                    <>
                      <th>{t("ranking.th.accuracy")}</th>
                      <th>{t("ranking.th.correct")}</th>
                      <th>{t("ranking.th.total")}</th>
                    </>
                  )}

                  {rankType === "challenge" && (
                    <>
                      <th>{t("ranking.th.totalSolved")}</th>
                      <th>{t("ranking.th.correct")}</th>
                    </>
                  )}

                  {rankType === "persistence" && (
                    <>
                      <th>{t("ranking.th.avgRetry")}</th>
                      <th>{t("ranking.th.uniqueItems")}</th>
                      <th>{t("ranking.th.totalAttempts")}</th>
                    </>
                  )}
                </tr>
              </thead>

              <tbody>
                {rankings.map((rank, index) => (
                  <tr key={index} className={index < 3 ? "top3" : ""}>
                    <td>
                      {index === 0 && "🥇"}
                      {index === 1 && "🥈"}
                      {index === 2 && "🥉"}
                      {index > 2 && t("ranking.placeN", { n: index + 1 })}
                    </td>
                    <td>{rank.nickName}</td>

                    {rankType === "accuracy" && (
                      <>
                        <td className="accent">{rank.accuracy}%</td>
                        <td>{rank.score}</td>
                        <td>{rank.total}</td>
                      </>
                    )}

                    {rankType === "challenge" && (
                      <>
                        <td className="accent">{rank.total}</td>
                        <td>{rank.score}</td>
                      </>
                    )}

                    {rankType === "persistence" && (
                      <>
                        <td className="accent">{parseFloat(rank.avgRound).toFixed(1)}{t("ranking.unit.times")}</td>
                        <td>{rank.uniqueItems}</td>
                        <td>{rank.totalAttempts}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="infoBox">
          <h4>📊 {t("ranking.info.title")}</h4>
          <ul>
            <li><strong>{t("ranking.tab.accuracy")}:</strong> {t("ranking.info.accuracy")}</li>
            <li><strong>{t("ranking.tab.challenge")}:</strong> {t("ranking.info.challenge")}</li>
            <li><strong>{t("ranking.tab.persistence")}:</strong> {t("ranking.info.persistence")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
