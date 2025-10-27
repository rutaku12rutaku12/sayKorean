import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { testApi, testItemApi } from "../api/adminTestApi";
import { examApi, genreApi, studyApi } from "../api/adminApi";
import "../styles/AdminCommon.css";

export default function AdminTestEdit() {
    // [*] 가상돔
    const navigate = useNavigate();
    const { testNo } = useParams();

    // [*] 기본 정보
    const [testData, setTestData] = useState({
        testNo: parseInt(testNo),
        testTitle: "",
        studyNo: null
    })

    // [*] 문항 목록
    const [items, setItems] = useState([]);

    // [*] 참조 데이터
    const [genres, setGenres] = useState([]);
    const [studies, setStudies] = useState([]);
    const [exams, setExams] = useState([]);

    // [*] 로딩
    const [loading, setLoading] = useState(true);

    // [*] 화면 초기화 시 데이터 불러오기
    useEffect(() => {
        fetchData();
    }, []);

    // [1] 데이터 조회
    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. 시험 정보 조회
            const testRes = await testApi.getIndi(testNo);
            setTestData(testRes.data);

            // 2. 문항 목록 조회
            const itemRes = await testItemApi.getAll();
            const testItems = itemRes.data.filter(item => item.testNo == testNo);
            setItems(testItems);

            // 3. 참조 데이터 조회
            const [genreRes, studyRes, examRes] = await Promise.all([
                genreApi.getAll(),
                studyApi.getAll(),
                examApi.getAll()
            ])

            // 4. 데이터 준비
            setGenres(genreRes.data);
            setStudies(studyRes.data);
            setExams(examRes.data);

        } catch (e) {
            console.error("데이터 조회 실패:", e);
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    // [2] 시험 정보 변경
    const handleTestChange = (field, value) => {
        setTestData(p => ({
            ...p,
            [field]: value
        }));
    };

    // [3-1] 문항 추가
    const handleAddItem = () => {
        setItems([...items, {
            testItemNo: null, // 새 문항
            testNo: parseInt(testNo),
            question: "",
            examNo: null
        }]);
    };

    // [3-2] 문항 삭제
    const handleRemoveItem = async (index, testItemNo) => {
        if (testItemNo) {
            // DB에 있는 문항 레코드 삭제
            if (!window.confirm("이 문항을 삭제하시겠습니까?")) return;

            try {
                await testItemApi.delete(testItemNo);
                alert("문항이 삭제되었습니다.")
                setItems(items.filter((_, i) => i != index));
            } catch (e) {
                console.e("문항 삭제 실패:", e)
                alert("문항 삭제에 실패했습니다.");
            }
        } else {
            // 로컬에만 있는 문항 삭제
            setItems(items.filter((_, i) => i != index));
        }
    }

    // [3-3] 문항 변경
    const handleItemChange = (index, field, value) => {
        setItems(p => {
            const newItems = [...p];
            newItems[index] = {
                ...newItems[index],
                [field]: value
            };

            // examNo 변경 시 examKo도 함께 표시하기 위한 처리
            if (field == "examNo") {
                const exam = exams.find(e => e.examNo == value);
                newItems[index].examKo = exam?.examKo || "";
            }

            return newItems;

        });
    };

    // [4-1] 주제에 속한 예문 목록 찾기
    const getExamsByStudyNo = () => {
        if (!testData.studyNo) return [];
        return exams.filter(e => e.studyNo == testData.studyNo);
    };

    // [4-2] 예문 텍스트 찾기
    const getExamText = (examNo) => {
        const exam = exams.find(e => e.examNo == examNo);
        return exam?.examKo || "알 수 없음";
    }

    // [4-3] 주제 이름 찾기
    const getStudyName = (studyNo) => {
        const study = studies.find(s => s.studyNo == studyNo);
        return study?.themeKo || "알 수 없음";
    }

    // [5] 유효성 검사
    const validate = () => {
        if (!testData.testTitle.trim()) {
            alert("시험 제목을 입력해주세요.")
            return false;
        }

        if (items.length < 3) {
            alert("시험 문항은 최소 3개 이상이어야 합니다.")
            return false;
        }

        // 1) 문장 유형 검사
        const hasImage = items.some(item => item.question.startsWith("그림:"));
        const hasAudio = items.some(item => item.question.startsWith("음성:"));
        const hasSubjective = items.some(item => item.question.startsWith("주관식:"));

        if (!hasImage || !hasAudio || !hasSubjective) {
            alert("그림, 음성, 주관식 문항이 각각 최소 1개씩 필요합니다.");
            return false;
        }

        // 2) 모든 문항 검증
        for (let i = 0; i < items.length; i++) {
            if (!items[i].question.trim()) {
                alert(`${i + 1}번째 문항의 질문을 입력해주세요.`)
                return false;
            }
            if (!items[i].examNo) {
                alert(`${i + 1}번째 문항의 예문을 선택해주세요.`)
                return false;
            }
        }

        return true;
    }

    // [6] 수정 실행
    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            // 1) 시험 정보 수정
            await testApi.update(testData);
            // 2-1) 문항 처리
            for (let item of items) {
                if (item.testItemNo) {
                    // 2-2) 기존 문항 수정
                    await testItemApi.update(item);
                    // 2-3) 새 문항 생성
                    await testItemApi.create({
                        testNo: parseInt(testNo),
                        question: item.question,
                        examNo: item.examNo
                    });
                }
            }

            alert("시험이 성공적으로 수정되었습니다!");
            navigate("/admin/test");

        } catch (e) {
            console.error("시험 수정 실패:", e)
            alert("시험 수정 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    // [7] 로딩 (이미지 추가 에정)
    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}> 로딩 중... </div>
    }

    // [8] 사용 가능한 예문 const 정의
    const availableExams = getExamsByStudyNo();

    return (<>
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2>시험 수정</h2>

            {/* 1. 기본 정보 */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>1. 기본 정보</h3>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        주제
                    </label>
                    <input
                        type="text"
                        value={getStudyName(testData.studyNo)}
                        disabled
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        * 주제는 수정할 수 없습니다. 주제를 변경하려면 새 시험을 생성해주세요.
                    </p>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        시험 제목 *
                    </label>
                    <input
                        type="text"
                        value={testData.testTitle}
                        onChange={(e) => handleTestChange('testTitle', e.target.value)}
                        placeholder="예: 인사 표현 익히기"
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                </div>
            </div>

            {/* 2. 문항 관리 */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>2. 시험 문항 ({items.length}개)</h3>
                    <button
                        onClick={handleAddItem}
                        style={{
                            padding: '8px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        문항 추가
                    </button>
                </div>

                {items.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            marginBottom: '20px',
                            padding: '15px',
                            border: '2px solid #eee',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h4>
                                문항 {index + 1}
                                {item.testItemNo ? ` (ID: ${item.testItemNo})` : ' (새로 추가)'}
                            </h4>
                            {items.length > 3 && (
                                <button
                                    onClick={() => handleRemoveItem(index, item.testItemNo)}
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
                            )}
                        </div>

                        {/* 질문 유형 선택 */}
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                질문 유형
                            </label>
                            <select
                                value={item.question.split(':')[0] + ':' || ""}
                                onChange={(e) => {
                                    const type = e.target.value;
                                    let newQuestion = type + " 올바른 표현을 고르세요.";
                                    if (type === "주관식:") {
                                        newQuestion = "주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.";
                                    }
                                    handleItemChange(index, 'question', newQuestion);
                                }}
                                style={{ padding: '8px', width: '200px' }}
                            >
                                <option value="">유형 선택</option>
                                <option value="그림:">그림</option>
                                <option value="음성:">음성</option>
                                <option value="주관식:">주관식</option>
                            </select>
                        </div>

                        {/* 질문 내용 */}
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                질문 내용 *
                            </label>
                            <input
                                type="text"
                                value={item.question}
                                onChange={(e) => handleItemChange(index, 'question', e.target.value)}
                                placeholder="질문을 입력하세요"
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>

                        {/* 정답 예문 선택 */}
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                정답 예문 *
                            </label>
                            <select
                                value={item.examNo || ""}
                                onChange={(e) => handleItemChange(index, 'examNo', parseInt(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            >
                                <option value="">예문을 선택하세요</option>
                                {availableExams.map(exam => (
                                    <option key={exam.examNo} value={exam.examNo}>
                                        {exam.examKo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 선택된 예문 미리보기 */}
                        {item.examNo && (
                            <div style={{
                                padding: '10px',
                                backgroundColor: '#e8f5e9',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}>
                                <strong>선택된 정답:</strong> {getExamText(item.examNo)}
                            </div>
                        )}
                    </div>
                ))}

                {items.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                        <p>등록된 문항이 없습니다.</p>
                        <p>"문항 추가" 버튼을 클릭하여 문항을 추가해주세요.</p>
                    </div>
                )}
            </div>

            {/* 하단 버튼 */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                <button
                    onClick={() => navigate('/admin/test')}
                    style={{
                        padding: '15px 40px',
                        fontSize: '16px',
                        backgroundColor: '#9E9E9E',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    취소
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        padding: '15px 40px',
                        fontSize: '16px',
                        backgroundColor: loading ? '#ccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? '처리 중...' : '수정 완료'}
                </button>
            </div>
        </div>


    </>)
}