import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Test() {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testItems, setTestItems] = useState([]);
  const [langNo, setLangNo] = useState(0);
  const [loading, setLoading] = useState(false);

  // 언어 설정 가져오기
  useEffect(() => {
    const stored = localStorage.getItem("selectedLangNo");
    const n = Number(stored);
    setLangNo(Number.isFinite(n) ? n : 0);
  }, []);

  // 시험 목록 조회
  useEffect(() => {
    if (langNo !== null) {
      fetchTests();
    }
  }, [langNo]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/saykorean/test", {
        params: { langNo }
      });
      setTests(res.data);
    } catch (e) {
      console.error("시험 목록 조회 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  // 시험 선택 시 문항 조회
  const handleSelectTest = async (testNo) => {
    try {
      setLoading(true);
      const res = await axios.get(`/saykorean/test/${testNo}/items`, {
        params: { langNo }
      });
      setTestItems(res.data);
      setSelectedTest(testNo);
    } catch (e) {
      console.error("시험 문항 조회 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  // 오답 예문 가져오기
  const fetchWrongAnswers = async (correctExamNo) => {
    try {
      const res = await axios.get("/saykorean/test/exam/random", {
        params: {
          excludedExamNo: correctExamNo,
          limit: 3,
          langNo
        }
      });
      return res.data;
    } catch (e) {
      console.error("오답 예문 조회 실패:", e);
      return [];
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>한국어 시험</h1>

      {!selectedTest && (
        <div>
          <h2>시험 목록</h2>
          <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
            {tests.map((test) => (
              <div
                key={test.testNo}
                onClick={() => handleSelectTest(test.testNo)}
                style={{
                  padding: "20px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#4CAF50";
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#ddd";
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {test.testTitleSelected || test.testTitle}
                </h3>
                <p style={{ margin: "10px 0 0 0", color: "#666" }}>
                  클릭하여 시험 시작
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTest && testItems.length > 0 && (
        <div>
          <button
            onClick={() => {
              setSelectedTest(null);
              setTestItems([]);
            }}
            style={{
              padding: "10px 20px",
              marginBottom: "20px",
              backgroundColor: "#9E9E9E",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            ← 시험 목록으로
          </button>

          <h2>시험 문항</h2>
          <div style={{ display: "grid", gap: "30px", marginTop: "20px" }}>
            {testItems.map((item, index) => (
              <div
                key={item.testItemNo}
                style={{
                  padding: "25px",
                  border: "2px solid #eee",
                  borderRadius: "8px",
                  backgroundColor: "#fafafa"
                }}
              >
                <div style={{ marginBottom: "15px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 15px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: "bold"
                    }}
                  >
                    문항 {index + 1}
                  </span>
                </div>

                <h3 style={{ margin: "15px 0" }}>
                  {item.questionSelected || item.question}
                </h3>

                {/* 이미지가 있는 경우 */}
                {item.imagePath && (
                  <div style={{ marginBottom: "20px" }}>
                    <img
                      src={item.imagePath}
                      alt={`exam-${item.examNo}`}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "8px"
                      }}
                    />
                  </div>
                )}

                {/* 예문 텍스트 */}
                <div
                  style={{
                    padding: "15px",
                    backgroundColor: "#e8f5e9",
                    borderRadius: "4px",
                    marginBottom: "15px"
                  }}
                >
                  <strong>정답:</strong> {item.examSelected || item.examKo}
                </div>

                {/* 오디오가 있는 경우 */}
                {item.audios && item.audios.length > 0 && (
                  <div style={{ marginTop: "15px" }}>
                    <strong>음성 듣기:</strong>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "10px"
                      }}
                    >
                      {item.audios.map((audio, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const audioElement = new Audio(audio.audioPath);
                            audioElement.play();
                          }}
                          style={{
                            padding: "8px 15px",
                            backgroundColor: "#2196F3",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          🔊 재생 {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}