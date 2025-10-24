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
        return <div style={{ padding: '40px', textAlign: 'center' }}> 로딩 중... </div>;
    }

    return (<>
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>시험 관리</h2>
                <button
                    onClick={() => navigate('/admin/test/create')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    새 시험 등록
                </button>
            </div>

            {/* 시험 목록 */}
            {tests.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
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
                                style={{
                                    marginBottom: '20px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                {/* 시험 헤더 */}
                                <div
                                    style={{
                                        padding: '15px 20px',
                                        backgroundColor: isExpanded ? '#e3f2fd' : '#f5f5f5',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                    onClick={() => setExpandedTestNo(isExpanded ? null : test.testNo)}
                                >
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0' }}>{test.testTitle}</h3>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                            주제: {getStudyName(test.studyNo)} | 문항 수: {items.length}개
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/test/edit/${test.testNo}`);
                                            }}
                                            style={{
                                                padding: '5px 15px',
                                                backgroundColor: '#2196F3',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTest(test.testNo);
                                            }}
                                            style={{
                                                padding: '5px 15px',
                                                backgroundColor: '#f44336',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
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
                                    <div style={{ padding: '20px', backgroundColor: '#fff' }}>
                                        {items.length === 0 ? (
                                            <p style={{ textAlign: 'center', color: '#999' }}>
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
                                                                <span style={{
                                                                    display: 'inline-block',
                                                                    padding: '3px 10px',
                                                                    backgroundColor: '#2196F3',
                                                                    color: 'white',
                                                                    borderRadius: '4px',
                                                                    fontSize: '12px',
                                                                    marginRight: '10px'
                                                                }}>
                                                                    문항 {index + 1}
                                                                </span>
                                                                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                                                    {getQuestionType(item.question)}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteItem(item.testItemNo)}
                                                                style={{
                                                                    padding: '4px 12px',
                                                                    backgroundColor: '#f44336',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '4px',
                                                                    fontSize: '12px',
                                                                    cursor: 'pointer'
                                                                }}
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


    </>)
}