
# 관리자 페이지 내비게이션 유격 현상 해결 방안

## 문제 원인

관리자 페이지(`AdminHome`, `AdminStudyList`, `AdminTestList`) 간 이동 시 내비게이션 바의 위치가 미세하게 변하는 현상은 각 페이지의 최상위 컨테이너 스타일이 다르기 때문입니다.

- **AdminHome.jsx**: `.admin-center` 클래스를 사용하여 `padding: 60px 20px`를 가집니다.
- **AdminStudyList.jsx**: `.admin-container` 클래스를 사용하여 `padding: 50px`를 가집니다.
- **AdminTestList.jsx**: 인라인 스타일로 `padding: '20px'`를 가집니다.

이처럼 페이지마다 상단 여백(`padding-top`)이 달라 내용이 시작되는 위치가 변하면서, 고정된 내비게이션 바가 움직이는 것처럼 보이는 것입니다.

## 해결 방안

모든 관리자 페이지의 최상위 컨테이너를 일관되게 `.admin-container` 클래스로 통일하여, 동일한 여백을 갖도록 수정합니다.

### 1. `src/adminPages/AdminHome.jsx` 수정

기존의 `.admin-center` 대신 `.admin-container`를 사용하고, 내용물 중앙 정렬을 위해 `.admin-text-center` 클래스를 추가합니다.

```jsx
import { useNavigate } from "react-router-dom";
import "../styles/AdminCommon.css";

export default function AdminHome(props) {

    // 페이지 접속할 때 비밀번호 입력하게 해야함
    const navigate = useNavigate();

    return (
        <div className="admin-container admin-text-center" style={{ paddingTop: '60px', paddingBottom: '60px' }}>

            <div className="admin-mb-xxl">
                <img src="/img/adminPage.png" style={{ maxWidth: '400px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </div>

            <div className="admin-flex-center admin-flex-gap-lg admin-mt-xxl">
                <button
                    onClick={() => navigate('/admin/study/create')}
                    className="admin-btn admin-btn-lg admin-btn-education-create"
                >
                    교육 등록하기
                </button>
                <button
                    onClick={() => navigate('/admin/study')}
                    className="admin-btn admin-btn-lg admin-btn-education-list"
                >
                    교육 목록으로 이동
                </button>
            </div>

            <div className="admin-flex-center admin-flex-gap-lg admin-mt-xxl">
                <button
                    onClick={() => navigate('/admin/test/create')}
                    className="admin-btn admin-btn-lg admin-btn-test-create"
                >
                    시험 등록하기
                </button>
                <button
                    onClick={() => navigate('/admin/test')}
                    className="admin-btn admin-btn-lg admin-btn-test-list"
                >
                    시험 목록으로 이동
                </button>
            </div>
        </div>
    )
}
```

**주요 변경 사항:**
- 최상위 `div`의 클래스를 `admin-container admin-text-center`로 변경했습니다.
- 기존 `.admin-center`의 상하 여백(`padding: 60px 20px`)과 유사한 느낌을 유지하기 위해 인라인 스타일로 `paddingTop`과 `paddingBottom`을 추가했습니다.
- 이미지에 적용되던 스타일이 유지되도록 `img` 태그에 인라인 스타일을 추가했습니다.

### 2. `src/adminPages/AdminTestList.jsx` 수정

인라인 스타일을 사용하던 최상위 `div`를 `.admin-container` 클래스를 사용하도록 변경합니다.

```jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { testApi, testItemApi } from "../api/adminTestApi";
import { examApi, studyApi } from "../api/adminApi";


export default function AdminTestList() {
    // [*] 가상 돔
    const navigate = useNavigate();

    // [*] 데이터 상태
    const [tests, setTests] = useState([]);
    const [testItems, setTestItems] = useState([]);
    const [studies, setStudies] = useState([]);
    const [exams, setExams] = useState([]);

    // [*] 상세보기 상태
    const [expandedTestNo, setExpandedTestNo] = useState(null);

    // [*] 로딩
    const [loading, setLoading] = useState(false);

    // [*] 화면 초기화 시 데이터 불러오기
    useEffect(() => {
        fetchAllData();
    }, []);

    // [1] 전체 데이터 조회 함수
    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [testRes, itemRes, studyRes, examRes] = await Promise.all([
                testApi.getAll(),
                testItemApi.getAll(),
                studyApi.getAll(),
                examApi.getAll()
            ]);

            setTests(testRes.data);
            setTestItems(itemRes.data);
            setStudies(studyRes.data);
            setExams(examRes.data);

        } catch (e) {
            console.error("데이터 조회 오류:", e);
            alert("데이터 조회 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // [2-1] 시험 삭제
    const handleDeleteTest = async (testNo) => {
        if (!window.confirm("정말로 이 시험을 삭제하시겠습니까? 하위 시험문항도 모두 삭제됩니다.")) return;

        try {
            await testApi.delete(testNo);
            alert("시험이 성공적으로 삭제되었습니다.");
            fetchAllData();

        } catch (e) {
            console.error("시험 삭제 오류:", e);
            alert("시험 삭제 중 오류가 발생했습니다.");
        }
    }

    // [2-2] 문항 삭제
    const handleDeleteItem = async (testItemNo) => {
        if (!window.confirm("이 문항을 삭제하시겠습니까?")) return;

        try {
            await testItemApi.delete(testItemNo);
            alert("문항이 성공적으로 삭제되었습니다.");
            fetchAllData();

        } catch (e) {
            console.error("문항 삭제 오류:", e);
            alert("문항 삭제 중 오류가 발생했습니다.");
        }

    }

    // [3] 특정 시험 문항 목록 확인
    const getItemsByTest = (testNo) => {
        return testItems.filter(item => item.testNo === testNo);
    };

    // [4-1] 주제 이름 찾기
    const getStudyName = (studyNo) => {
        const study = studies.find(s => s.studyNo === studyNo);
        return study?.themeKo || "알 수 없음";
    }

    // [4-2] 예문 내용 찾기
    const getExamText = (examNo) => {
        const exam = exams.find(e => e.examNo === examNo);
        return exam?.examKo || "알 수 없음";
    }

    // [5] 문항 유형 추출
    const getQuestionType = (question) => {
        if (question.startsWith("그림:")) return "🖼️ 그림";
        if (question.startsWith("음성:")) return "🎧 음성";
        if (question.startsWith("주관식:")) return "✏️ 주관식";
        return "❓ 기타";
    };

    // [6] 로딩 메시지 (이미지 추가예정)
    if (loading) {
        return <div className="admin-loading"> 로딩 중... </div>;
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>시험 관리</h2>
                <button
                    onClick={() => navigate('/admin/test/create')}
                    className="admin-btn admin-btn-success"
                >
                    새 시험 등록
                </button>
            </div>

            {/* 시험 목록 */}
            {tests.length === 0 ? (
                <div className="admin-empty-message">
                    <p>등록된 시험이 없습니다.</p>
                    <p>새 시험을 등록해주세요.</p>
                </div>
            ) : (
                <div>
                    {tests.map(test => {
                        const items = getItemsByTest(test.testNo);
                        const isExpanded = expandedTestNo === test.testNo;

                        return (
                            <div
                                key={test.testNo}
                                className="admin-card"
                            >
                                {/* 시험 헤더 */}
                                <div
                                    className={`admin-card-header ${isExpanded ? 'active' : ''}`}
                                    onClick={() => setExpandedTestNo(isExpanded ? null : test.testNo)}
                                >
                                    <div>
                                        <h3 className="admin-card-title" style={{ margin: '0 0 5px 0' }}>{test.testTitle}</h3>
                                        <p className="admin-card-subtitle" style={{ margin: 0 }}>
                                            주제: {getStudyName(test.studyNo)} | 문항 수: {items.length}개
                                        </p>
                                    </div>
                                    <div className="admin-flex admin-flex-gap-md">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/test/edit/${test.testNo}`);
                                            }}
                                            className="admin-btn admin-btn-sm admin-btn-info"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTest(test.testNo);
                                            }}
                                            className="admin-btn admin-btn-sm admin-btn-danger"
                                        >
                                            삭제
                                        </button>
                                        <span style={{ fontSize: '20px', marginLeft: '10px' }}>
                                            {isExpanded ? '▲' : '▼'}
                                        </span>
                                    </div>
                                </div>

                                {/* 문항 목록 (펼쳐졌을 때만 표시) */}
                                {isExpanded && (
                                    <div className="admin-card-body">
                                        {items.length === 0 ? (
                                            <p className="admin-empty-message" style={{ padding: 0 }}>
                                                등록된 문항이 없습니다.
                                            </p>
                                        ) : (
                                            <div>
                                                <h4 style={{ marginBottom: '15px' }}>시험 문항 목록</h4>
                                                {items.map((item, index) => (
                                                    <div
                                                        key={item.testItemNo}
                                                        style={{
                                                            marginBottom: '15px',
                                                            padding: '15px',
                                                            border: '1px solid #e0e0e0',
                                                            borderRadius: '6px',
                                                            backgroundColor: '#fafafa'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                            <div>
                                                                <span className="admin-question-type">
                                                                    문항 {index + 1}
                                                                </span>
                                                                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                                                    {getQuestionType(item.question)}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteItem(item.testItemNo)}
                                                                className="admin-btn admin-btn-sm admin-btn-danger"
                                                            >
                                                                삭제
                                                            </button>
                                                        </div>

                                                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                                            <p style={{ margin: '5px 0' }}>
                                                                <strong>질문:</strong> {item.question}
                                                            </p>
                                                            <p style={{ margin: '5px 0' }}>
                                                                <strong>정답 예문:</strong> {getExamText(item.examNo)}
                                                            </p>
                                                            <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                                                                문항 ID: {item.testItemNo} | 예문 ID: {item.examNo}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}
```

**주요 변경 사항:**
- 최상위 `div`에서 인라인 스타일을 제거하고 `className="admin-container"`로 변경했습니다.
- 내부 요소들의 스타일을 인라인 스타일 대신 `AdminCommon.css`에 정의된 유틸리티 클래스(예: `admin-header`, `admin-btn`, `admin-card` 등)를 최대한 활용하도록 수정했습니다.

위와 같이 파일들을 수정하면 모든 관리자 페이지가 동일한 레이아웃 구조를 갖게 되어, 페이지 이동 시 더 이상 유격 현상이 발생하지 않을 것입니다.
