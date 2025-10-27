import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { adminUserApi } from "../api/adminUserApi";

export default function AdminUserList() {

    // [*]  가상 돔
    const navigate = useNavigate();

    // [*] 상태 관리
    const [users, setUsers] = useState([]);
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    // [*] 검색 필터 상태
    const [filters, setFilters] = useState({
        keyword: "",
        userState: "",
        startDate: "",
        endDate: "",
        sortBy: "userDate"
    });

    // [*] 마운트 시 데이터 로드
    useEffect(() => {
        fetchData();
    }, []);

    // [1] 전체 데이터 조회
    const fetchData = async () => {
        try {
            setLoading(true);

            // 회원 목록 조회
            const usersRes = await adminUserApi.getStaticUser();
            setUsers(usersRes.data);

            // 대시보드 통계 조회
            const dashboardRes = await adminUserApi.getDashboard();
            setDashboard(dashboardRes.data);

        } catch (e) {
            console.error("데이터 조회 실패:", e)
            alert("데이터를 불러오는 중 오류가 발생했습니다.")
        } finally {
            setLoading(false);
        }
    }

    // [2] 검색 필터 적용
    const handleSearch = async () => {
        try {
            setLoading(true);

            // [*] 빈 문자열("")을 null로 변환하여 전송
            const searchParams = {
                keyword: filters.keyword || null,
                userState: filters.userState || null,
                startDate: filters.startDate || null,
                endDate: filters.endDate || null,
                sortBy: filters.sortBy
            };

            const res = await adminUserApi.searchUsers(searchParams);
            setUsers(res.data);
        } catch (e) {
            console.error("검색 실패:", e);
            alert("검색 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    // [3] 필터 초기화
    const handleResetFilters = () => {
        setFilters({
            keyword: "",
            userState: "",
            startDate: "",
            endDate: "",
            sortBy: "userDate"
        });
        fetchData();
    }

    // [4] 체크박스 선택
    const handleCheckBox = (userNo) => {
        setSelectedUsers(p =>
            p.includes(userNo)
                ? p.filter(id => id != userNo)
                : [...p, userNo]
        );
    };

    // [5] 전체 선택/해제
    const handleSelectAll = () => {
        if (selectedUsers.length == users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(u => u.userNo));
        }
    };

    // [6] 일괄 제재
    const handleBatchRestrict = async () => {
        if (selectedUsers.length == 0) {
            alert("제재할 회원을 선택해주세요.");
            return;
        }

        if (!window.confirm(`선택한 ${selectedUsers.length}명의 회원을 제재하시겠습니까?`)) {
            return;
        }

        try {
            await adminUserApi.batchUpdate(selectedUsers, "restrict", 0);
            alert("일괄 제재가 완료되었습니다.");
            setSelectedUsers([]);
            fetchData();
        } catch (e) {
            console.error("일괄 제재 실패:", e);
            alert("일괄 제재 중 오류가 발생했습니다.");
        }
    };

    // [7] 일괄 권한 변경
    const handleBatchRole = async (role) => {
        if (selectedUsers.length == 0) {
            alert('권한을 변경할 회원ㅇ르 선택해주세요.');
            return;
        }

        if (!window.confirm(`선택한 ${selectedUsers.length}명의 권한을 ${role}로 변경하시겠습니까?`)) {
            return;
        }

        try {
            await adminUserApi.batchUpdate(selectedUsers, "role", role);
            alert("일괄 권한 변경이 완료되었습니다.");
            setSelectedUsers([]);
            fetchData();
        } catch (e) {
            console.error("일괄 권한 변경 실패:", e);
            alert("일괄 권한 변경 중 오류가 발생했습니다.")
        }
    };

    // [8] 회원 상태 표시
    const getUserStateText = (state) => {
        switch (state) {
            case 1: return { text: "정상", color: "#4CAF50" };
            case 0: return { text: "휴면", color: "#d9d9d9" }
            case -1: return { text: "탈퇴예정", color: "#FF9800" }
            case -2: return { text: "알 수 없음", color: "#999" };
        }
    }

    // [9] 로딩 중
    if (loading) {
        return <div className="admin-loading"> 로딩 중... </div>;
    }

    return (<>
        <div className="admin-container">
            <div className="admin-header">
                <h2>회원 관리</h2>
                <button
                    onClick={() => navigate('/admin')}
                    className="admin-btn admin-btn-secondary"
                >
                    관리자 홈
                </button>
            </div>

            {/* 대시보드 통계 */}
            {dashboard && (
                <div className="admin-section">
                    <h3>📊 회원 통계 대시보드</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px" }}>
                        <div className="admin-card">
                            <div className="admin-card-body" style={{ textAlign: "center" }}>
                                <h4 style={{ color: "#2196F3", marginBottom: "10px" }}>전체 회원</h4>
                                <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
                                    {dashboard.totalUsers}명
                                </p>
                            </div>
                        </div>
                        <div className="admin-card">
                            <div className="admin-card-body" style={{ textAlign: "center" }}>
                                <h4 style={{ color: "#4CAF50", marginBottom: "10px" }}>활성 회원</h4>
                                <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
                                    {dashboard.activeUsers}명
                                </p>
                            </div>
                        </div>
                        <div className="admin-card">
                            <div className="admin-card-body" style={{ textAlign: "center" }}>
                                <h4 style={{ color: "#f44336", marginBottom: "10px" }}>제재 회원</h4>
                                <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
                                    {dashboard.restrictedUsers}명
                                </p>
                            </div>
                        </div>
                        <div className="admin-card">
                            <div className="admin-card-body" style={{ textAlign: "center" }}>
                                <h4 style={{ color: "#673AB7", marginBottom: "10px" }}>월간 신규</h4>
                                <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
                                    {dashboard.monthJoins}명
                                </p>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px", marginTop: "15px" }}>
                        <div className="admin-card">
                            <div className="admin-card-body" style={{ textAlign: "center" }}>
                                <h4 style={{ color: "#FF9800", marginBottom: "10px" }}>평균 출석률</h4>
                                <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>
                                    {dashboard.avgAttendance ? dashboard.avgAttendance.toFixed(1) : 0}회
                                </p>
                            </div>
                        </div>
                        <div className="admin-card">
                            <div className="admin-card-body" style={{ textAlign: "center" }}>
                                <h4 style={{ color: "#E91E63", marginBottom: "10px" }}>평균 시험 점수</h4>
                                <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>
                                    {dashboard.avgScore ? dashboard.avgScore.toFixed(1) : 0}점
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 검색 필터 */}
            <div className="admin-section">
                <h3>🔍 회원 검색</h3>
                <div className="admin-grid" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "10px", alignItems: "end" }}>
                    <div className="admin-form-group">
                        <label className="admin-form-label">키워드 (닉네임/이메일)</label>
                        <input
                            type="text"
                            value={filters.keyword}
                            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                            placeholder="검색어 입력"
                            className="admin-input"
                        />
                    </div>
                    <div className="admin-form-group">
                        <label className="admin-form-label">회원 상태</label>
                        <select
                            value={filters.userState}
                            onChange={(e) => setFilters({ ...filters, userState: e.target.value })}
                            className="admin-select"
                            style={{ width: "100%" }}
                        >
                            <option value="">전체</option>
                            <option value="1">정상</option>
                            <option value="-1">탈퇴예정</option>
                            <option value="-2">제재</option>
                        </select>
                    </div>
                    <div className="admin-form-group">
                        <label className="admin-form-label">가입 시작일</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="admin-input"
                        />
                    </div>
                    <div className="admin-form-group">
                        <label className="admin-form-label">가입 종료일</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="admin-input"
                        />
                    </div>
                    <div className="admin-form-group">
                        <label className="admin-form-label">정렬</label>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            className="admin-select"
                            style={{ width: "100%" }}
                        >
                            <option value="userDate">가입일순</option>
                            <option value="attendance">출석일수순</option>
                        </select>
                    </div>
                </div>
                <div className="admin-flex admin-flex-gap-md admin-mt-md">
                    <button onClick={handleSearch} className="admin-btn admin-btn-info">
                        검색
                    </button>
                    <button onClick={handleResetFilters} className="admin-btn admin-btn-secondary">
                        초기화
                    </button>
                </div>
            </div>

            {/* 일괄 처리 버튼 */}
            {selectedUsers.length > 0 && (
                <div className="admin-section" style={{ backgroundColor: "#fff3e0" }}>
                    <div className="admin-flex-between">
                        <span style={{ fontWeight: "bold" }}>
                            선택된 회원: {selectedUsers.length}명
                        </span>
                        <div className="admin-flex admin-flex-gap-md">
                            <button
                                onClick={handleBatchRestrict}
                                className="admin-btn admin-btn-danger"
                            >
                                일괄 제재
                            </button>
                            <button
                                onClick={() => handleBatchRole("USER")}
                                className="admin-btn admin-btn-info"
                            >
                                일괄 USER 권한
                            </button>
                            <button
                                onClick={() => handleBatchRole("ADMIN")}
                                className="admin-btn admin-btn-warning"
                            >
                                일괄 ADMIN 권한
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 회원 목록 */}
            <div className="admin-section">
                <div className="admin-flex-between admin-mb-lg">
                    <h3>👥 회원 목록 ({users.length}명)</h3>
                    <label style={{ cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={selectedUsers.length === users.length && users.length > 0}
                            onChange={handleSelectAll}
                            style={{ marginRight: "5px" }}
                        />
                        전체 선택
                    </label>
                </div>

                {users.length === 0 ? (
                    <p className="admin-empty-message">등록된 회원이 없습니다.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                                    <th style={{ padding: "12px", textAlign: "center", width: "50px" }}>선택</th>
                                    <th style={{ padding: "12px", textAlign: "left" }}>닉네임</th>
                                    <th style={{ padding: "12px", textAlign: "left" }}>이메일</th>
                                    <th style={{ padding: "12px", textAlign: "center" }}>상태</th>
                                    <th style={{ padding: "12px", textAlign: "center" }}>권한</th>
                                    <th style={{ padding: "12px", textAlign: "center" }}>출석일수</th>
                                    <th style={{ padding: "12px", textAlign: "center" }}>시험 횟수</th>
                                    <th style={{ padding: "12px", textAlign: "center" }}>정답률</th>
                                    <th style={{ padding: "12px", textAlign: "center" }}>가입일</th>
                                    <th style={{ padding: "12px", textAlign: "center" }}>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => {
                                    const stateInfo = getUserStateText(user.userState);
                                    const correctRate = user.totalQuestions > 0
                                        ? ((user.correctCount / user.totalQuestions) * 100).toFixed(1)
                                        : 0;

                                    return (
                                        <tr
                                            key={user.userNo}
                                            style={{
                                                borderBottom: "1px solid #eee",
                                                cursor: "pointer"
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9f9f9"}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                                        >
                                            <td style={{ padding: "12px", textAlign: "center" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.userNo)}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        handleCheckBox(user.userNo);
                                                    }}
                                                />
                                            </td>
                                            <td style={{ padding: "12px" }}>{user.nickName}</td>
                                            <td style={{ padding: "12px", fontSize: "13px", color: "#666" }}>
                                                {user.email}
                                            </td>
                                            <td style={{ padding: "12px", textAlign: "center" }}>
                                                <span style={{
                                                    color: stateInfo.color,
                                                    fontWeight: "bold",
                                                    padding: "3px 8px",
                                                    backgroundColor: `${stateInfo.color}20`,
                                                    borderRadius: "4px"
                                                }}>
                                                    {stateInfo.text}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px", textAlign: "center" }}>
                                                <span style={{
                                                    padding: "3px 8px",
                                                    backgroundColor: user.urole === "ADMIN" ? "#FFC107" : "#2196F3",
                                                    color: "white",
                                                    borderRadius: "4px",
                                                    fontSize: "12px"
                                                }}>
                                                    {user.urole}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px", textAlign: "center" }}>
                                                {user.totalAttendance || 0}회
                                            </td>
                                            <td style={{ padding: "12px", textAlign: "center" }}>
                                                {user.totalTests || 0}회
                                            </td>
                                            <td style={{ padding: "12px", textAlign: "center" }}>
                                                {correctRate}%
                                            </td>
                                            <td style={{ padding: "12px", textAlign: "center", fontSize: "13px" }}>
                                                {user.userDate ? new Date(user.userDate).toLocaleDateString() : "-"}
                                            </td>
                                            <td style={{ padding: "12px", textAlign: "center" }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/admin/user/${user.userNo}`);
                                                    }}
                                                    className="admin-btn admin-btn-sm admin-btn-info"
                                                >
                                                    상세보기
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    </>)
}
