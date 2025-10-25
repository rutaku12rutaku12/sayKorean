import { useEffect, useState } from "react";
import axios from "axios";

export default function Ranking() {

    // [*] 상태 설정
    const [rankType, setRankType] = useState("accuracy"); // accuracy(정답왕) , challenge(도전왕) , persistence(끈기왕)
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userNo, setUserNo] = useState("");
    const [testItemNo, setTestItemNo] = useState("");
    const [results, setResults] = useState([]);


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
        {/* <div style={{ padding: "20px" }}>
            <h3>🔍 랭킹 검색</h3>

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <input
                    type="number"
                    placeholder="userNo"
                    value={userNo}
                    onChange={(e) => setUserNo(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="testItemNo"
                    value={testItemNo}
                    onChange={(e) => setTestItemNo(e.target.value)}
                />
                <button onClick={handleSearch}>검색</button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {results.length > 0 && (
                <table border="1" style={{ width: "100%", textAlign: "center" }}>
                    <thead>
                        <tr>
                            <th>RankNo</th>
                            <th>닉네임</th>
                            <th>문항</th>
                            <th>정답여부</th>
                            <th>회차</th>
                            <th>결과일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r, i) => (
                            <tr key={i}>
                                <td>{r.rankNo}</td>
                                <td>{r.nickName}</td>
                                <td>{r.question}</td>
                                <td>{r.isCorrect === 1 ? "O" : "X"}</td>
                                <td>{r.testRound}</td>
                                <td>{r.resultDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div> */}
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "30px" }}>🏅 한국어 학습 랭킹</h2>

            {/* 탭 버튼 */}
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px" }}>
                <button
                    onClick={() => setRankType("accuracy")}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: rankType === "accuracy" ? "#4CAF50" : "#ddd",
                        color: rankType === "accuracy" ? "white" : "black",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    🏆 정답왕
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
                    🔥 도전왕
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
                    💪 끈기왕
                </button>
            </div>

            {/* 랭킹 타이틀 */}
            <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
                {getRankTitle()}
            </h3>

            {/* 로딩 및 에러 */}
            {loading && <p style={{ textAlign: "center" }}>로딩 중...</p>}
            {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

            {/* 랭킹 목록 */}
            {!loading && !error && rankings.length === 0 && (
                <p style={{ textAlign: "center", color: "#999" }}>아직 랭킹 데이터가 없습니다.</p>
            )}

            {!loading && rankings.length > 0 && (
                <div style={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                                <th style={{ padding: "15px", textAlign: "center", width: "80px" }}>순위</th>
                                <th style={{ padding: "15px", textAlign: "left" }}>닉네임</th>
                                {rankType === "accuracy" && (
                                    <>
                                        <th style={{ padding: "15px", textAlign: "center" }}>정답률</th>
                                        <th style={{ padding: "15px", textAlign: "center" }}>정답 수</th>
                                        <th style={{ padding: "15px", textAlign: "center" }}>총 문제 수</th>
                                    </>
                                )}
                                {rankType === "challenge" && (
                                    <>
                                        <th style={{ padding: "15px", textAlign: "center" }}>총 풀이 수</th>
                                        <th style={{ padding: "15px", textAlign: "center" }}>정답 수</th>
                                    </>
                                )}
                                {rankType === "persistence" && (
                                    <>
                                        <th style={{ padding: "15px", textAlign: "center" }}>평균 재도전</th>
                                        <th style={{ padding: "15px", textAlign: "center" }}>시도한 문항 수</th>
                                        <th style={{ padding: "15px", textAlign: "center" }}>총 시도 수</th>
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
                                        {index > 2 && `${index + 1}위`}
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
                                                {parseFloat(rank.avgRound).toFixed(1)}회
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
                <h4>📊 랭킹 기준 설명</h4>
                <ul style={{ lineHeight: "1.8" }}>
                    <li>
                        <strong>정답왕:</strong> 정답률이 높은 순서로 순위를 매깁니다. (최소 10문제 이상 풀이 필요)
                    </li>
                    <li>
                        <strong>도전왕:</strong> 가장 많은 문제를 푼 사용자 순서로 순위를 매깁니다.
                    </li>
                    <li>
                        <strong>끈기왕:</strong> 같은 문제를 여러 번 재도전한 평균 횟수가 높은 순서로 순위를 매깁니다.
                    </li>
                </ul>
            </div>
        </div>


    </>)

}