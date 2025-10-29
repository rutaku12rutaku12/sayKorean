import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { adminUserApi } from "../api/adminUserApi";

export default function AdminUserIndi() {

    const navigate = useNavigate();
    const { userNo } = useParams();

    // [*] 상태 관리
    const [userInfo, setUserInfo] = useState(null);
    const [attendList, setAttendList] = useState([]);
    const [rankings, setRangkings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("info"); // info, attend, test

    // [*] 제재 및 권한 변경 모달 상태
    const [showRestrictModal, setShowRestrictModal] = useState(false);
    const [restrictDay, setRestrictDay] = useState(7);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState("USER");

    // [*] 마운트 시 데이터 로드
    useEffect(() => {
        fetchData();
    }, [userNo]);

    // [1] 데이터 조회
    const fetchData = async () => {
        try {
            setLoading(true);

            // 회원 상세 정보
            const userRes = await adminUserApi.searchStaticUser(userNo);
            setUserInfo(userRes.data);

            // 출석 로그
            const attendRes = await adminUserApi.getAttendUser(userNo);
            setAttendList(attendRes.data);

            // 시험 결과 (rankings 엔드포인트 추가 필요)
            // const rankingRes =

        } catch (e) {
            console.error("데이터 조회 실패:", e);
            alert("데이터를 불러오는 중 오류가 발생했습니다.")
        } finally {
            setLoading(false);
        }
    }

    // [2] 회원 제재
    const handleRestrict = async () => {
        if (!window.confirm(`이 회원을 ${restrictDay}일간 제재하시겠습니까?`)) return;

        try {
            await adminUserApi.updateRestrictUser(userNo, restrictDay);
            alert("회원이 제재되었습니다.")
            setShowRestrictModal(false);
            fetchData();
        } catch (e) {
            console.error("제재 실패:", e);
            alert("제재 처리 중 오류가 발생했습니다.");
        }
    }

    // [3] 권한 변경
    const handleRoleChange = async () => {
        if (!window.confirm(`이 회원의 권한을 ${selectedRole}로 변경하시겠습니까?`)) return;

        try {
            await adminUserApi.updateRoleUser(userNo, selectedRole);
            alert("권한이 변경되었습니다.");
            setShowRoleModal(false);
            fetchData();
        } catch (e) {
            console.error("권한 변경 실패:", e);
            alert("권한 변경 중 오류가 발생했습니다.");
        }
    }

    // [4] Excel 다운로드
    const handleDownloadExcel = async () => {
        try {
            const response = await adminUserApi.downloadExcel(userNo);

            // Blob 생성
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            // 다운로드 링크 생성
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `회원_${userNo}_시험기록.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            alert("Excel 파일이 다운로드 되었습니다.")
        } catch (e) {
            console.error("Excel 다운로드 실패:", e);
            alert("Excel 다운로드 중 오류가 발생했습니다.");
        }
    }

    // [5] 회원 상태 텍스트
    const getUserStateText = (state) => {
        switch (state) {
            case 1: return { text: "정상", color: "#4CAF50" };
            case 0: return { text: "휴면", color: "#d9d9d9" }
            case -1: return { text: "탈퇴예정", color: "#FF9800" };
            case -2: return { text: "제재", color: "#f44336" };
            default: return { text: "알 수 없음", color: "#999" };
        }
    }

    // [6] 로딩 중
    if (loading) {
        return <div className="admin-loading"> <img src="/img/loading.png" /> </div>;
    }

    if (!userInfo) {
        return <div className="admin-loading">회원 정보를 찾을 수 없습니다.</div>;
    }

    const stateInfo = getUserStateText(userInfo.userState);
    const correctRate = userInfo.totalQuestions > 0
        ? ((userInfo.correctCount / userInfo.totalQuestions) * 100).toFixed(1)
        : 0;

    return (<>
        <div className="admin-container">
            <div className="admin-header">
                <h2>회원 상세 정보</h2>
                <button
                    onClick={() => navigate('/admin/user')}
                    className="admin-btn admin-btn-secondary"
                >
                    목록으로
                </button>
            </div>

            {/* 회원 정보 카드 */}
            <div className="admin-section">
                <div className="admin-flex-between admin-mb-lg">
                    <h3>👤 기본 정보</h3>
                    <div className="admin-flex admin-flex-gap-md">
                        <button
                            onClick={() => setShowRestrictModal(true)}
                            className="admin-btn admin-btn-danger"
                            disabled={userInfo.userState === -2}
                        >
                            회원 제재
                        </button>
                        <button
                            onClick={() => {
                                setSelectedRole(userInfo.urole);
                                setShowRoleModal(true);
                            }}
                            className="admin-btn admin-btn-warning"
                        >
                            권한 변경
                        </button>
                        <button
                            onClick={handleDownloadExcel}
                            className="admin-btn admin-btn-success"
                        >
                            Excel 다운로드
                        </button>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
                    <div className="admin-detail-box">
                        <p><strong>회원 번호:</strong> {userInfo.userNo}</p>
                        <p><strong>이름:</strong> {userInfo.name}</p>
                        <p><strong>닉네임:</strong> {userInfo.nickName}</p>
                        <p><strong>이메일:</strong> {userInfo.email}</p>
                        <p><strong>연락처:</strong> {userInfo.phone || "-"}</p>
                    </div>
                    <div className="admin-detail-box">
                        <p>
                            <strong>상태:</strong>
                            <span style={{
                                color: stateInfo.color,
                                fontWeight: "bold",
                                marginLeft: "10px",
                                padding: "3px 10px",
                                backgroundColor: `${stateInfo.color}20`,
                                borderRadius: "4px"
                            }}>
                                {stateInfo.text}
                            </span>
                        </p>
                        <p>
                            <strong>권한:</strong>
                            <span style={{
                                marginLeft: "10px",
                                padding: "3px 10px",
                                backgroundColor: userInfo.urole === "ADMIN" ? "#FFC107" : "#2196F3",
                                color: "white",
                                borderRadius: "4px"
                            }}>
                                {userInfo.urole}
                            </span>
                        </p>
                        <p><strong>가입 방식:</strong> {userInfo.signupMethod === 1 ? "일반" : "소셜"}</p>
                        <p><strong>가입일:</strong> {new Date(userInfo.userDate).toLocaleString()}</p>
                        <p><strong>수정일:</strong> {new Date(userInfo.userUpdate).toLocaleString()}</p>
                    </div>
                </div>

                {/* 통계 요약 */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", marginTop: "20px" }}>
                    <div className="admin-card">
                        <div className="admin-card-body" style={{ textAlign: "center" }}>
                            <h4 style={{ color: "#FF9800", marginBottom: "5px" }}>총 출석일수</h4>
                            <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                                {userInfo.totalAttendance || 0}회
                            </p>
                        </div>
                    </div>
                    <div className="admin-card">
                        <div className="admin-card-body" style={{ textAlign: "center" }}>
                            <h4 style={{ color: "#2196F3", marginBottom: "5px" }}>시험 회차</h4>
                            <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                                {userInfo.totalTestRounds || 0}회
                            </p>
                        </div>
                    </div>
                    <div className="admin-card">
                        <div className="admin-card-body" style={{ textAlign: "center" }}>
                            <h4 style={{ color: "#4CAF50", marginBottom: "5px" }}>총 문제 수</h4>
                            <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                                {userInfo.totalQuestions || 0}문제
                            </p>
                        </div>
                    </div>
                    <div className="admin-card">
                        <div className="admin-card-body" style={{ textAlign: "center" }}>
                            <h4 style={{ color: "#E91E63", marginBottom: "5px" }}>정답률</h4>
                            <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                                {correctRate}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="admin-section">
                <div style={{ display: "flex", borderBottom: "2px solid #ddd", marginBottom: "20px" }}>
                    <button
                        onClick={() => setActiveTab("info")}
                        style={{
                            padding: "10px 20px",
                            border: "none",
                            borderBottom: activeTab === "info" ? "3px solid #2196F3" : "none",
                            backgroundColor: activeTab === "info" ? "#e3f2fd" : "transparent",
                            cursor: "pointer",
                            fontWeight: activeTab === "info" ? "bold" : "normal"
                        }}
                    >
                        📋 상세 정보
                    </button>
                    <button
                        onClick={() => setActiveTab("attend")}
                        style={{
                            padding: "10px 20px",
                            border: "none",
                            borderBottom: activeTab === "attend" ? "3px solid #2196F3" : "none",
                            backgroundColor: activeTab === "attend" ? "#e3f2fd" : "transparent",
                            cursor: "pointer",
                            fontWeight: activeTab === "attend" ? "bold" : "normal"
                        }}
                    >
                        📅 출석 기록 ({attendList.length}건)
                    </button>
                    <button
                        onClick={() => setActiveTab("test")}
                        style={{
                            padding: "10px 20px",
                            border: "none",
                            borderBottom: activeTab === "test" ? "3px solid #2196F3" : "none",
                            backgroundColor: activeTab === "test" ? "#e3f2fd" : "transparent",
                            cursor: "pointer",
                            fontWeight: activeTab === "test" ? "bold" : "normal"
                        }}
                    >
                        📝 시험 결과 ({rankings.length}건)
                    </button>
                </div>

                {/* 상세 정보 탭 */}
                {activeTab === "info" && (
                    <div>
                        <h4>회원 상세 정보</h4>
                        <div className="admin-detail-box">
                            <p><strong>UID:</strong> {userInfo.uid || "-"}</p>
                            <p><strong>가입 방식 코드:</strong> {userInfo.signupMethod}</p>
                            <p><strong>사용자 상태 코드:</strong> {userInfo.userState}</p>
                        </div>
                    </div>
                )}

                {/* 출석 기록 탭 */}
                {activeTab === "attend" && (
                    <div>
                        <h4>출석 기록 ({attendList.length}건)</h4>
                        {attendList.length === 0 ? (
                            <p className="admin-empty-message">출석 기록이 없습니다.</p>
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                                            <th style={{ padding: "12px", textAlign: "center" }}>번호</th>
                                            <th style={{ padding: "12px", textAlign: "center" }}>출석 일자</th>
                                            <th style={{ padding: "12px", textAlign: "center" }}>출석 일시</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendList.map((attend, idx) => (
                                            <tr key={attend.attenNo} style={{ borderBottom: "1px solid #eee" }}>
                                                <td style={{ padding: "12px", textAlign: "center" }}>{idx + 1}</td>
                                                <td style={{ padding: "12px", textAlign: "center" }}>
                                                    {attend.attendDay}
                                                </td>
                                                <td style={{ padding: "12px", textAlign: "center" }}>
                                                    {new Date(attend.attenDate).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* 시험 결과 탭 */}
                {activeTab === "test" && (
                    <div>
                        <h4>시험 결과 ({rankings.length}건)</h4>
                        {rankings.length === 0 ? (
                            <p className="admin-empty-message">시험 기록이 없습니다.</p>
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                                            <th style={{ padding: "12px", textAlign: "center", width: "80px" }}>회차</th>
                                            <th style={{ padding: "12px", textAlign: "left" }}>시험명</th>
                                            <th style={{ padding: "12px", textAlign: "left" }}>문제</th>
                                            <th style={{ padding: "12px", textAlign: "left" }}>사용자 답변</th>
                                            <th style={{ padding: "12px", textAlign: "center", width: "100px" }}>정답 여부</th>
                                            <th style={{ padding: "12px", textAlign: "center", width: "150px" }}>제출 일시</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rankings.map((rank) => (
                                            <tr key={rank.rankNo} style={{ borderBottom: "1px solid #eee" }}>
                                                <td style={{ padding: "12px", textAlign: "center" }}>
                                                    {rank.testRound}
                                                </td>
                                                <td style={{ padding: "12px" }}>
                                                    {rank.testTitle || "-"}
                                                </td>
                                                <td style={{ padding: "12px", fontSize: "13px" }}>
                                                    {rank.question ? rank.question.substring(0, 50) : "-"}
                                                    {rank.question && rank.question.length > 50 ? "..." : ""}
                                                </td>
                                                <td style={{ padding: "12px", fontSize: "13px" }}>
                                                    {rank.userAnswer ? rank.userAnswer.substring(0, 30) : "-"}
                                                    {rank.userAnswer && rank.userAnswer.length > 30 ? "..." : ""}
                                                </td>
                                                <td style={{ padding: "12px", textAlign: "center" }}>
                                                    <span style={{
                                                        padding: "3px 10px",
                                                        backgroundColor: rank.isCorrect === 1 ? "#4CAF50" : "#f44336",
                                                        color: "white",
                                                        borderRadius: "4px",
                                                        fontSize: "12px"
                                                    }}>
                                                        {rank.isCorrect === 1 ? "정답" : "오답"}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "12px", textAlign: "center", fontSize: "13px" }}>
                                                    {new Date(rank.resultDate).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 제재 모달 */}
            {showRestrictModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "30px",
                        borderRadius: "8px",
                        minWidth: "400px"
                    }}>
                        <h3 style={{ marginBottom: "20px" }}>회원 제재</h3>
                        <div className="admin-form-group">
                            <label className="admin-form-label">제재 일수</label>
                            <input
                                type="number"
                                value={restrictDay}
                                onChange={(e) => setRestrictDay(parseInt(e.target.value))}
                                className="admin-input"
                                min="1"
                            />
                        </div>
                        <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
                            * {restrictDay}일간 로그인이 제한됩니다.
                        </p>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
                            <button
                                onClick={() => setShowRestrictModal(false)}
                                className="admin-btn admin-btn-secondary"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleRestrict}
                                className="admin-btn admin-btn-danger"
                            >
                                제재하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 권한 변경 모달 */}
            {showRoleModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "30px",
                        borderRadius: "8px",
                        minWidth: "400px"
                    }}>
                        <h3 style={{ marginBottom: "20px" }}>권한 변경</h3>
                        <div className="admin-form-group">
                            <label className="admin-form-label">권한 선택</label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="admin-select"
                                style={{ width: "100%" }}
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                        <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
                            * 현재 권한: <strong>{userInfo.urole}</strong>
                        </p>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
                            <button
                                onClick={() => setShowRoleModal(false)}
                                className="admin-btn admin-btn-secondary"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleRoleChange}
                                className="admin-btn admin-btn-warning"
                            >
                                변경하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>)
}