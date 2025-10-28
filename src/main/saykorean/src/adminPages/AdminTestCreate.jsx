import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { testApi, testItemApi } from "../api/adminTestApi";
import { useEffect, useState } from "react";
import { examApi, genreApi, studyApi } from "../api/adminApi";
import { setGenres, setError } from "../store/adminSlice";
import "../styles/AdminCommon.css";

export default function AdminTestCreate() {
    // [*] 가상돔, 리덕스
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const genres = useSelector(state => state.admin.genres);

    // [*] 기본 정보
    const [selectedGenreNo, setSelectedGenreNo] = useState('');
    const [selectedStudyNo, setSelectedStudyNo] = useState('');

    // [*] 시험 제목 (다국어)
    const [testData, setTestData] = useState({
        testTitle: "",
        testTitleRoman: "",
        testTitleJp: "",
        testTitleCn: "",
        testTitleEn: "",
        testTitleEs: "",
    });

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

            if (createMode === "auto" && filtered.length >= 3) {
                const shuffled = [...filtered].sort(() => Math.random() - 0.5);
                const selected = shuffled.slice(0, 3);

                setCustomItems([
                    {
                        question: "그림: 올바른 표현을 고르세요.",
                        questionRoman: "",
                        questionJp: "",
                        questionCn: "",
                        questionEn: "",
                        questionEs: "",
                        examNo: selected[0]?.examNo || null,
                        examKo: selected[0]?.examKo || ""
                    },
                    {
                        question: "음성: 올바른 표현을 고르세요.",
                        questionRoman: "",
                        questionJp: "",
                        questionCn: "",
                        questionEn: "",
                        questionEs: "",
                        examNo: selected[1]?.examNo || null,
                        examKo: selected[1]?.examKo || ""
                    },
                    {
                        question: "주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.",
                        questionRoman: "",
                        questionJp: "",
                        questionCn: "",
                        questionEn: "",
                        questionEs: "",
                        examNo: selected[2]?.examNo || null,
                        examKo: selected[2]?.examKo || ""
                    }
                ]);
            }
        } catch (e) {
            console.error('예문 목록 조회 오류', e);
        }
    }

    // [*] 시험 제목 입력 핸들러
    const handleTestDataChange = (field, value) => {
        setTestData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // [*] 시험 제목 자동 번역
    const handleTranslateTestTitle = async () => {
        if (!testData.testTitle.trim()) {
            alert("번역할 한국어 시험 제목을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            const res = await testApi.translate({
                testTitle: testData.testTitle
            });
            const { testTitleJp, testTitleCn, testTitleEn, testTitleEs } = res.data;

            setTestData(prev => ({
                ...prev,
                testTitleJp: testTitleJp || prev.testTitleJp,
                testTitleCn: testTitleCn || prev.testTitleCn,
                testTitleEn: testTitleEn || prev.testTitleEn,
                testTitleEs: testTitleEs || prev.testTitleEs,
            }));
            alert("시험 제목 자동 번역이 완료되었습니다.");
        } catch (e) {
            console.error("시험 제목 번역 실패:", e);
            alert("번역 중 오류가 발생했습니다.");
            dispatch(setError(e.message));
        } finally {
            setLoading(false);
        }
    };

    // [*] 시험 제목 발음기호 자동 생성 (추가)
    const handleRomanizeTestTitle = async () => {
        if (!testData.testTitle.trim()) {
            alert("발음 기호로 변환할 한국어 시험 제목을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            // AdminTestController의 /romanize 엔드포인트 호출 (testApi에 romanize 함수가 정의되어 있다고 가정)
            const res = await testApi.romanize(testData.testTitle);
            const { romanized } = res.data; // 서버 응답 형식: { original: "...", romanized: "..." }

            if (romanized) {
                setTestData(prev => ({
                    ...prev,
                    testTitleRoman: romanized,
                }));
                alert("시험 제목 발음기호 생성이 완료되었습니다.");
            } else {
                alert("API 응답 형식에 문제가 있습니다.");
            }
        } catch (e) {
            console.error("시험 제목 발음기호 생성 실패:", e);
            alert("시험 제목 발음기호 생성 중 오류가 발생했습니다.");
            dispatch(setError(e.message));
        } finally {
            setLoading(false);
        }
    };

    // [3-1] 커스텀 모드: 문항 추가
    const handleAddCustomItem = () => {
        setCustomItems([
            ...customItems,
            {
                question: "",
                questionRoman: "",
                questionJp: "",
                questionCn: "",
                questionEn: "",
                questionEs: "",
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

    // [3-4] 문항 질문 자동 번역
    const handleTranslateQuestion = async (index) => {
        const item = customItems[index];
        if (!item.question.trim()) {
            alert("번역할 한국어 질문을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            const res = await testApi.translate({
                question: item.question
            });
            const { questionJp, questionCn, questionEn, questionEs } = res.data;

            setCustomItems(prev => {
                const newItems = [...prev];
                newItems[index] = {
                    ...newItems[index],
                    questionJp: questionJp || newItems[index].questionJp,
                    questionCn: questionCn || newItems[index].questionCn,
                    questionEn: questionEn || newItems[index].questionEn,
                    questionEs: questionEs || newItems[index].questionEs,
                };
                return newItems;
            });
            alert(`${index + 1}번째 문항 질문 자동 번역이 완료되었습니다.`);
        } catch (e) {
            console.error("문항 질문 번역 실패:", e);
            alert("번역 중 오류가 발생했습니다.");
            dispatch(setError(e.message));
        } finally {
            setLoading(false);
        }
    };

    // [3-5] 문항 질문 발음기호 자동 생성 (추가)
    const handleRomanizeQuestion = async (index) => {
        const item = customItems[index];
        if (!item.question.trim()) {
            alert("발음 기호로 변환할 한국어 질문을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            // AdminTestController의 /romanize 엔드포인트 호출
            const res = await testApi.romanize(item.question);
            const { romanized } = res.data;

            if (romanized) {
                handleCustomItemChange(index, 'questionRoman', romanized);
                alert(`${index + 1}번째 문항 질문 발음기호 생성이 완료되었습니다.`);
            } else {
                alert("API 응답 형식에 문제가 있습니다.");
            }

        } catch (e) {
            console.error("문항 질문 발음기호 생성 실패:", e);
            alert("문항 질문 발음기호 생성 중 오류가 발생했습니다.");
            dispatch(setError(e.message));
        } finally {
            setLoading(false);
        }
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
                questionRoman: "",
                questionJp: "",
                questionCn: "",
                questionEn: "",
                questionEs: "",
                examNo: selected[0].examNo,
                examKo: selected[0].examKo
            },
            {
                question: "음성: 올바른 표현을 고르세요.",
                questionRoman: "",
                questionJp: "",
                questionCn: "",
                questionEn: "",
                questionEs: "",
                examNo: selected[1].examNo,
                examKo: selected[1].examKo
            },
            {
                question: "주관식: 다음 상황에 맞는 한국어 표현을 작성하세요.",
                questionRoman: "",
                questionJp: "",
                questionCn: "",
                questionEn: "",
                questionEs: "",
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
        if (!testData.testTitle.trim()) {
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
    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            // 1) 시험 생성
            const res = await testApi.create({
                ...testData,
                studyNo: parseInt(selectedStudyNo)
            });
            const testNo = res.data;
            console.log('시험 생성 완료, testNo:', testNo);

            // 2) 문항 생성
            for (let item of customItems) {
                await testItemApi.create({
                    testNo,
                    question: item.question,
                    questionRoman: item.questionRoman,
                    questionJp: item.questionJp,
                    questionCn: item.questionCn,
                    questionEn: item.questionEn,
                    questionEs: item.questionEs,
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
        <div className="admin-container">
            <h2>시험 등록</h2>

            {/* 1. 장르 선택 */}
            <div className="admin-section">
                <h3>1. 장르 선택</h3>
                <select
                    value={selectedGenreNo}
                    onChange={(e) => setSelectedGenreNo(e.target.value)}
                    className="admin-select"
                    style={{ width: '320px' }}
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
                <div className="admin-section">
                    <h3>2. 주제 선택</h3>
                    <select
                        value={selectedStudyNo}
                        onChange={(e) => setSelectedStudyNo(e.target.value)}
                        className="admin-select"
                        style={{ width: '320px' }}
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
                <div className="admin-section">
                    <h3>3. 시험 제목</h3>
                    <div className="admin-grid-col-2">
                        <div>
                            <p>한국어 시험 제목</p>
                            <input
                                type="text"
                                value={testData.testTitle}
                                onChange={(e) => handleTestDataChange('testTitle', e.target.value)}
                                className="admin-input"
                                placeholder="한국어 시험 제목을 입력하세요"
                            />
                            <div className="admin-mb-sm admin-mt-sm">
                                <button
                                    onClick={handleTranslateTestTitle}
                                    disabled={loading}
                                    className="admin-btn admin-btn-sm admin-btn-info admin-mr-sm"
                                >
                                    자동 번역
                                </button>
                                {/* 발음기호 생성 버튼 추가 */}
                                <button
                                    onClick={handleRomanizeTestTitle}
                                    disabled={loading}
                                    className="admin-btn admin-btn-sm admin-btn-secondary"
                                >
                                    발음기호 생성
                                </button>
                            </div>
                        </div>
                        <div>
                            <p>발음 기호 (Romanized)</p>
                            <input
                                type="text"
                                value={testData.testTitleRoman}
                                onChange={(e) => handleTestDataChange('testTitleRoman', e.target.value)}
                                className="admin-input"
                                placeholder="자동 생성된 발음 기호"
                            />
                        </div>

                        <div className="admin-grid-2">
                            <div className="admin-form-group">
                                <label className="admin-form-label">일본어 시험 제목</label>
                                <input
                                    type="text"
                                    value={testData.testTitleJp}
                                    onChange={(e) => handleTestDataChange('testTitleJp', e.target.value)}
                                    placeholder={testData.testTitleJp || "자동번역 결과"}
                                    className="admin-input"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">중국어 시험 제목</label>
                                <input
                                    type="text"
                                    value={testData.testTitleCn}
                                    onChange={(e) => handleTestDataChange('testTitleCn', e.target.value)}
                                    placeholder={testData.testTitleCn || "자동번역 결과"}
                                    className="admin-input"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">영어 시험 제목</label>
                                <input
                                    type="text"
                                    value={testData.testTitleEn}
                                    onChange={(e) => handleTestDataChange('testTitleEn', e.target.value)}
                                    placeholder={testData.testTitleEn || "자동번역 결과"}
                                    className="admin-input"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">스페인어 시험 제목</label>
                                <input
                                    type="text"
                                    value={testData.testTitleEs}
                                    onChange={(e) => handleTestDataChange('testTitleEs', e.target.value)}
                                    placeholder={testData.testTitleEs || "자동번역 결과"}
                                    className="admin-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. 문항 생성 방식 */}
            {selectedStudyNo && exams.length > 0 && (
                <div className="admin-section">
                    <h3>4. 문항 생성 방식</h3>
                    <div className="admin-mb-md">
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
                        <div className="admin-mb-md">
                            <button
                                onClick={handleShuffle}
                                className="admin-btn admin-btn-warning"
                            >
                                🎲 문항 다시 뽑기
                            </button>
                            <p className="admin-hint" style={{ marginTop: '10px' }}>
                                * 예문 중 3개를 무작위로 선택하여 그림, 음성, 주관식 문항을 생성합니다.
                            </p>
                        </div>
                    )}

                    {/* 문항 목록 */}
                    <div>
                        <div className="admin-flex-between admin-mb-md">
                            <h4>시험 문항 ({customItems.length}개)</h4>
                            {createMode === "custom" && (
                                <button
                                    onClick={handleAddCustomItem}
                                    className="admin-btn admin-btn-success"
                                >
                                    문항 추가
                                </button>
                            )}
                        </div>

                        {customItems.map((item, index) => (
                            <div key={index} className="admin-card admin-mb-md">
                                <h4>{index + 1}번째 문항</h4>
                                <div className="admin-form-group">
                                    <label>질문 (한국어)</label>
                                    <input
                                        type="text"
                                        value={item.question}
                                        onChange={(e) => handleCustomItemChange(index, 'question', e.target.value)}
                                        className="admin-input admin-mb-sm"
                                        placeholder="한국어 질문을 입력하세요"
                                    />
                                    <div className="admin-mb-sm">
                                        <button
                                            onClick={() => handleTranslateQuestion(index)}
                                            disabled={loading}
                                            className="admin-btn admin-btn-sm admin-btn-info admin-mr-sm"
                                        >
                                            자동 번역
                                        </button>
                                        {/* 발음기호 생성 버튼 추가 */}
                                        <button
                                            onClick={() => handleRomanizeQuestion(index)}
                                            disabled={loading}
                                            className="admin-btn admin-btn-sm admin-btn-secondary"
                                        >
                                            발음기호 생성
                                        </button>
                                    </div>
                                </div>

                                <div className="admin-form-group">
                                    <label>질문 발음 기호 (Romanized)</label>
                                    <input
                                        type="text"
                                        value={item.questionRoman}
                                        onChange={(e) => handleCustomItemChange(index, 'questionRoman', e.target.value)}
                                        className="admin-input"
                                        placeholder="자동 생성된 발음 기호"
                                    />
                                </div>

                                <div className="admin-exam-content">
                                    {/* 한국어 질문 */}
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">한국어 질문 *</label>
                                        {createMode === "custom" ? (
                                            <textarea
                                                value={item.question}
                                                onChange={(e) => handleCustomItemChange(index, 'question', e.target.value)}
                                                placeholder="예: 그림: 올바른 인사 표현을 고르세요."
                                                className="admin-textarea"
                                                style={{ minHeight: '60px' }}
                                            />
                                        ) : (
                                            <div className="admin-input" style={{ backgroundColor: '#f5f5f5', minHeight: '60px', padding: '10px' }}>
                                                {item.question}
                                            </div>
                                        )}
                                        <p className="admin-hint">
                                            * 형식: "그림: 질문내용" 또는 "음성: 질문내용" 또는 "주관식: 질문내용"
                                        </p>
                                    </div>

                                    {/* 다국어 질문 */}
                                    <div className="admin-grid-2">
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">일본어 질문</label>
                                            <input
                                                type="text"
                                                value={item.questionJp}
                                                onChange={(e) => handleCustomItemChange(index, 'questionJp', e.target.value)}
                                                placeholder={item.questionJp || "자동번역 결과"}
                                                className="admin-input"
                                            />
                                        </div>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">중국어 질문</label>
                                            <input
                                                type="text"
                                                value={item.questionCn}
                                                onChange={(e) => handleCustomItemChange(index, 'questionCn', e.target.value)}
                                                placeholder={item.questionCn || "자동번역 결과"}
                                                className="admin-input"
                                            />
                                        </div>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">영어 질문</label>
                                            <input
                                                type="text"
                                                value={item.questionEn}
                                                onChange={(e) => handleCustomItemChange(index, 'questionEn', e.target.value)}
                                                placeholder={item.questionEn || "자동번역 결과"}
                                                className="admin-input"
                                            />
                                        </div>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">스페인어 질문</label>
                                            <input
                                                type="text"
                                                value={item.questionEs}
                                                onChange={(e) => handleCustomItemChange(index, 'questionEs', e.target.value)}
                                                placeholder={item.questionEs || "자동번역 결과"}
                                                className="admin-input"
                                            />
                                        </div>
                                    </div>

                                    {/* 예문 선택 */}
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">정답 예문</label>
                                        <select
                                            value={item.examNo || ""}
                                            onChange={(e) => handleCustomItemChange(index, 'examNo', parseInt(e.target.value))}
                                            className="admin-select"
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
                <div className="admin-action-buttons">
                    <button
                        onClick={() => navigate('/admin/test')}
                        className="admin-btn admin-btn-lg admin-btn-secondary"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="admin-btn admin-btn-lg admin-btn-success"
                        style={{
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? '처리 중...' : '시험 등록'}
                    </button>
                </div>
            )}
        </div >

    </>)
}