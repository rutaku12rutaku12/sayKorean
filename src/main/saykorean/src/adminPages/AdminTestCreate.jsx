import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { testApi, testItemApi } from "../api/adminTestApi";
import { useEffect, useState } from "react";
import { examApi, genreApi, studyApi } from "../api/adminApi";
import { setGenres } from "../store/adminSlice";

export default function AdminTestCreate() {
    // [*] 가상돔, 리덕스
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const genres = useSelector(state => state.admin.genres);

    // [*] 기본 정보
    const [selectedGenreNo, setSelectedGenreNo] = useState('');
    const [selectedStudyNo, setSelectedStudyNo] = useState('');
    const [testTitle, setTestTitle] = useState('');

    // [*] 주제 목록 및 예문 목록
    const [studies, setStudies] = useState([]);
    const [exams, setExams] = useState([]);

    // [*] 문항 생성 방식
    const [createMode, setCreateMode] = useState("auto");  // "auto" 자동생성 | "custom" 수동생성
    const [customItems, setCustomItems] = useState([]);

    // [*] 로딩
    const [loading, setLoading] = useState(false);

    // [*] 화면 생성 시 초기화
    useEffect(() => {
        fetchGenres();
    }, []);

    useEffect(() => {
        if (selectedGenreNo) {
            fetchStudiesByGenre();
        }
    }, [selectedGenreNo]);

    useEffect(() => {
        if (selectedStudyNo) {
            fetchExamsByStudy();
        }
    }, [selectedStudyNo]);

    // [1-1] 장르 목록 조회
    const fetchGenres = async () => {
        try {
            const res = await genreApi.getAll();
            dispatch(setGenres(res.data));
        } catch (e) {
            console.error('장르 목록 조회 오류', e);
            alert('장르 목록을 불러올 수 없습니다.');
        }
    }

    // [1-2] 장르별 주제 조회
    const fetchStudiesByGenre = async () => {
        try {
            const res = await studyApi.getAll();
            const filtered = res.data.filter(study => study.genreNo == selectedGenreNo);
            setStudies(filtered);
            setSelectedStudyNo('');
            setExams([]);
        } catch (e) {
            console.error('주제 목록 조회 오류', e);
        }
    }

    // [2] 주제별 예문 조회
    const fetchExamsByStudy = async () => {
        try {
            const res = await examApi.getAll();
            const filtered = res.data.filter(exam => exam.studyNo == selectedStudyNo);
            setExams(filtered);

            // 자동 생성 모드일 시, 초기 문항 세팅
            if (createMode === "auto" && filtered.length >= 3) {
                const shuffled = [...filtered].sort(() => Math.random() - 0.5);
                const selected = shuffled.slice(0, 3);

                setCustomItems([
                    {
                        question: "그림: 올바른 표현을 고르세요.",
                        examNo: selected[0]?.examNo || null,
                        examKo: selected[0]?.examKo || ""
                    },
                    {
                        question: "음성: 올바른 표현을 고르세요.",
                        examNo: selected[1]?.examNo || null,
                        examKo: selected[1]?.examKo || ""
                    },
                    {
                        question: "주관식: 올바른 표현을 고르세요.",
                        examNo: selected[2]?.examNo || null,
                        examKo: selected[2]?.examKo || ""
                    }
                ]);
            }
        } catch (e) {
            console.error('예문 목록 조회 오류', e);
        }
    }

    // [3-1] 커스텀 모드 : 문항 추가
    const handleAddCustomItem = () => {
        setCustomItems([
            ...customItems,
            {
                question: "",
                examNo: null,
                examKo: ""
            }
        ]);
    };

    // [3-2] 커스텀 모드 : 문항 삭제
    const handleRemoveCustomItem = (index) => {
        setCustomItems(customItems.filter((_, i) => i !== index));
    };

    // [3-3] 커스텀 모드 : 문항 수정
    const handleCustomItemChange = (index, field, value) => {
        setCustomItems(p => {
            const newItems = [...p];
            newItems[index] = {
                ...newItems[index],
                [field]: value
            };

            // examNo 변경 시, examKo 자동 세팅
            if (field === "examNo") {
                const exam = exams.find(e => e.examNo == value);
                newItems[index].examKo = exam ? exam.examKo : "";
            }

            return newItems;

        })
    };

    // [4] 난수 재생성
    const handleShuffle = () => {
        if (exams.length < 3) {
            alert('선택한 주제의 예문이 3개 미만입니다. 다른 주제를 선택해주세요.');
            return;
        }

        const shuffled = [...exams].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 3);

        setCustomItems([
            {
                question: "그림: 올바른 표현을 고르세요.",
                examNo: selected[0].examNo,
                examKo: selected[0].examKo
            },
            {
                question: "음성: 올바른 표현을 고르세요.",
                examNo: selected[1].examNo,
                examKo: selected[1].examKo
            },
            {
                question: "주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.",
                examNo: selected[2].examNo,
                examKo: selected[2].examKo
            }
        ]);
    };


    // [5] 유효성 검사
    const validate = () => {
        if (!selectedGenreNo) {
            alert('장르를 선택해주세요.');
            return false;
        }
        if (!selectedStudyNo) {
            alert('주제를 선택해주세요.');
            return false;
        }
        if (!testTitle.trim()) {
            alert('시험 제목을 입력해주세요.');
            return false;
        }
        if (customItems.length < 3) {
            alert('시험문항은 최소 3개 이상이어야 합니다.');
            return false;
        }

        // 1) 문항 유형 검사 (그림, 음성, 주관식 각 1개 이상)
        const hasImage = customItems.some(item => item.question.startsWith("그림:"));
        const hasAudio = customItems.some(item => item.question.startsWith("음성:"));
        const hasSubjective = customItems.some(item => item.question.startsWith("주관식:"));

        if (!hasImage || !hasAudio || !hasSubjective) {
            alert('문항 유형은 그림, 음성, 주관식 각 1개 이상 포함되어야 합니다.');
            return false;
        }

        // 2) 문항 examNo 검사
        for (let i = 0; i < customItems.length; i++) {
            if (!customItems[i].examNo) {
                alert(`${i + 1}번째 문항의 예문을 선택해주세요.`);
                return false;
            }
            if (!customItems[i].question.trim()) {
                alert(`${i + 1}번째 문항의 질문을 입력해주세요.`);
                return false;
            }
        }

        return true;
    }

    // [6] 시험 생성 실행
    const handleSumbit = async () => {
        // 1) 유효성 검사
        if (!validate()) return;

        try {
            setLoading(true);

            // 2) 시험 생성
            const res = await testApi.create({
                testTitle,
                studyNo: parseInt(selectedStudyNo)
            })
            const testNo = res.data;
            console.log('시험 생성 완료, testNo : ', testNo);

            // 3) 문항 생성
            for (let item of customItems) {
                await testItemApi.create({
                    testNo,
                    question: item.question,
                    examNo: item.examNo
                });
            }

            alert('시험이 성공적으로 생성되었습니다.');
            navigate('/admin/test');

        } catch (e) {
            console.error('시험 생성 오류', e);
            alert('시험 생성에 실패했습니다.');
        } finally {
            setLoading(false);
        }

    };


    return (<>
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2>시험 등록</h2>

            {/* 1. 장르 선택 */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>1. 장르 선택</h3>
                <select
                    value={selectedGenreNo}
                    onChange={(e) => setSelectedGenreNo(e.target.value)}
                    style={{ padding: '8px', width: '320px' }}
                >
                    <option value="">장르를 선택하세요</option>
                    {genres.map(genre => (
                        <option key={genre.genreNo} value={genre.genreNo}>
                            {genre.genreName}
                        </option>
                    ))}
                </select>
            </div>

            {/* 2. 주제 선택 */}
            {selectedGenreNo && (
                <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h3>2. 주제 선택</h3>
                    <select
                        value={selectedStudyNo}
                        onChange={(e) => setSelectedStudyNo(e.target.value)}
                        style={{ padding: '8px', width: '320px' }}
                    >
                        <option value="">주제를 선택하세요</option>
                        {studies.map(study => (
                            <option key={study.studyNo} value={study.studyNo}>
                                {study.themeKo}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* 3. 시험 제목 */}
            {selectedStudyNo && (
                <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h3>3. 시험 제목</h3>
                    <input
                        type="text"
                        value={testTitle}
                        onChange={(e) => setTestTitle(e.target.value)}
                        placeholder="예: 인사 표현 익히기"
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    />
                </div>
            )}

            {/* 4. 문항 생성 방식 */}
            {selectedStudyNo && exams.length > 0 && (
                <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h3>4. 문항 생성 방식</h3>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ marginRight: '20px' }}>
                            <input
                                type="radio"
                                value="auto"
                                checked={createMode === "auto"}
                                onChange={(e) => setCreateMode(e.target.value)}
                            />
                            <span style={{ marginLeft: '5px' }}>자동 생성 (난수)</span>
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="custom"
                                checked={createMode === "custom"}
                                onChange={(e) => setCreateMode(e.target.value)}
                            />
                            <span style={{ marginLeft: '5px' }}>직접 선택</span>
                        </label>
                    </div>

                    {createMode === "auto" && (
                        <div style={{ marginBottom: '20px' }}>
                            <button
                                onClick={handleShuffle}
                                style={{ padding: '10px 20px', backgroundColor: '#FFC107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                🎲 문항 다시 뽑기
                            </button>
                            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                                * 예문 중 3개를 무작위로 선택하여 그림, 음성, 주관식 문항을 생성합니다.
                            </p>
                        </div>
                    )}

                    {/* 문항 목록 */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h4>시험 문항 ({customItems.length}개)</h4>
                            {createMode === "custom" && (
                                <button
                                    onClick={handleAddCustomItem}
                                    style={{ padding: '8px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
                                >
                                    문항 추가
                                </button>
                            )}
                        </div>

                        {customItems.map((item, index) => (
                            <div key={index} style={{ marginBottom: '20px', padding: '15px', border: '2px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <h5>문항 {index + 1}</h5>
                                    {createMode === "custom" && customItems.length > 3 && (
                                        <button
                                            onClick={() => handleRemoveCustomItem(index)}
                                            style={{ padding: '5px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
                                        >
                                            삭제
                                        </button>
                                    )}
                                </div>

                                {/* 질문 전체 내용 */}
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                        질문 (전체)
                                    </label>
                                    {createMode === "custom" ? (
                                        <textarea
                                            value={item.question}
                                            onChange={(e) => handleCustomItemChange(index, 'question', e.target.value)}
                                            placeholder="예: 그림: 올바른 인사 표현을 고르세요."
                                            style={{ width: '100%', padding: '8px', minHeight: '60px', resize: 'vertical' }}
                                        />
                                    ) : (
                                        <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', minHeight: '60px' }}>
                                            {item.question}
                                        </div>
                                    )}
                                    <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                        * 형식: "그림: 질문내용" 또는 "음성: 질문내용" 또는 "주관식: 질문내용"
                                    </p>
                                </div>

                                {/* 예문 선택 */}
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>정답 예문</label>
                                    <select
                                        value={item.examNo || ""}
                                        onChange={(e) => handleCustomItemChange(index, 'examNo', parseInt(e.target.value))}
                                        style={{ padding: '8px', width: '100%' }}
                                        disabled={createMode === "auto"}
                                    >
                                        <option value="">예문을 선택하세요</option>
                                        {exams.map(exam => (
                                            <option key={exam.examNo} value={exam.examNo}>
                                                {exam.examKo}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 선택된 예문 표시 */}
                                {item.examKo && (
                                    <div style={{ padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
                                        <strong>선택된 정답:</strong> {item.examKo}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 예문이 없는 경우 */}
            {selectedStudyNo && exams.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                    <p>선택한 주제에 예문이 없습니다.</p>
                    <p>먼저 교육 관리에서 예문을 등록해주세요.</p>
                </div>
            )}

            {/* 하단 버튼 */}
            {customItems.length >= 3 && (
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                    <button
                        onClick={() => navigate('/admin/test')}
                        style={{ padding: '15px 40px', fontSize: '16px', backgroundColor: '#9E9E9E', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSumbit}
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
                        {loading ? '처리 중...' : '시험 등록'}
                    </button>
                </div>
            )}
        </div>

    </>)
}