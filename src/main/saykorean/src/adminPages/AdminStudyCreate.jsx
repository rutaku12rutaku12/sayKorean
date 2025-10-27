import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { audioApi, genreApi, studyApi, examApi } from "../api/adminApi";
import { setGenres, setLoading, setError } from "../store/adminSlice";
import "../styles/AdminCommon.css";

export default function AdminStudyCreate(props) {

    // [*] 가상DOM, 리덕스
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const genres = useSelector(state => state.admin.genres);

    // [*] 장르 상태
    const [newGenreName, setNewGenreName] = useState("");
    const [selectedGenreNo, setSelectedGenreNo] = useState("");

    // [*] 교육 상태
    const [studyData, setStudyData] = useState({
        themeKo: "",
        themeJp: "",
        themeCn: "",
        themeEn: "",
        themeEs: "",
        commenKo: "",
        commenJp: "",
        commenCn: "",
        commenEn: "",
        commenEs: "",
    });

    // [*] 예문 관련 상태 (배열 관리)
    const [examList, setExamList] = useState([
        {
            examKo: "",
            examRoman: "",
            examJp: "",
            examCn: "",
            examEn: "",
            examEs: "",
            imageFile: null,
            audioFiles: []
        }
    ])

    // [*] 언어 코드 매핑 (Google TTS 형식)
    const languageCodeMap = {
        1: 'ko-KR',
        2: 'en-US'
    };

    // [*] 컴포넌트 마운트 시 장르 목록 불러오기
    useEffect(() => {
        fetchGenres();
    }, []);

    // [1-1] 장르 목록 불러오기
    const fetchGenres = async () => {
        try {
            const r = await genreApi.getAll();
            dispatch(setGenres(r.data));
        } catch (e) {
            console.error("장르 목록 조회 실패: ", e);
            alert("장르 목록을 불러올 수 없습니다.");
        }
    };

    // [1-2] 새 장르 생성
    const handleCreateGenre = async () => {
        if (!newGenreName.trim()) {
            alert("장르명을 입력해주세요.");
            return;
        }

        try {
            const r = await genreApi.create({ genreName: newGenreName });
            alert("장르가 생성되었습니다.");
            setNewGenreName("");
            fetchGenres();
        } catch (e) {
            console.error("장르 생성 실패: ", e);
            alert("장르 생성에 실패했습니다.")
        }
    }

    // [2] 주제 입력 핸들러
    const handleStudyChange = (field, value) => {
        setStudyData(e => ({
            ...e,
            [field]: value
        }));
    };

    // [2-1] 주제/해설 자동 번역 핸들러
    const handleTranslateStudy = async () => {
        if (!studyData.themeKo.trim() && !studyData.commenKo.trim()) {
            alert("번역할 한국어 주제 또는 해설을 입력해주세요.");
            return;
        }

        try {
            dispatch(setLoading(true));
            const r = await studyApi.translate({
                themeKo: studyData.themeKo,
                commenKo: studyData.commenKo
            });
            const { themeJp, themeCn, themeEn, themeEs, commenJp, commenCn, commenEn, commenEs }
                = r.data;

            setStudyData(e => ({
                ...e,
                themeJp: themeJp || e.themeJp,
                themeCn: themeCn || e.themeCn,
                themeEn: themeEn || e.themeEn,
                themeEs: themeEs || e.themeEs,
                commenJp: commenJp || e.commenJp,
                commenCn: commenCn || e.commenCn,
                commenEn: commenEn || e.commenEn,
                commenEs: commenEs || e.commenEs,
            }));
            alert("주제 및 해설 자동 번역이 완료되었습니다.");
        } catch (e) {
            console.error("주제/해설 자동 번역 실패: ", e);
            alert("번역 중 오류가 발생했습니다.");
            dispatch(setError(e.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    // [3-1] 예문 추가
    const handleAddExam = () => {
        setExamList(e => [...e, {
            examKo: "",
            examRoman: "",
            examJp: "",
            examCn: "",
            examEn: "",
            examEs: "",
            imageFile: null,
            audioFiles: []
        }]);
    };

    // [3-2] 예문 삭제
    const handleRemoveExam = (index) => {
        setExamList(e => e.filter((_, i) => i !== index));
    };

    // [3-3] 예문 입력 핸들러
    const handleExamChange = (index, field, value) => {
        setExamList(e => {
            const newList = [...e];
            newList[index] = {
                ...newList[index],
                [field]: value
            };
            return newList;
        })
    };

    // [3-4] 예문 자동 번역 핸들러
    const handleTranslateExam = async (index) => {
        const exam = examList[index];
        if (!exam.examKo.trim()) {
            alert("번역할 한국어 예문을 입력해주세요.");
            return;
        }

        try {
            dispatch(setLoading(true));
            const r = await examApi.translate({ examKo: exam.examKo });
            const { examJp, examCn, examEn, examEs } = r.data;
            setExamList(e => {
                const newList = [...e];
                newList[index] = {
                    ...newList[index],
                    examJp: examJp || newList[index].examJp,
                    examCn: examCn || newList[index].examCn,
                    examEn: examEn || newList[index].examEn,
                    examEs: examEs || newList[index].examEs,
                };
                return newList;
            });
            alert(`${index + 1}번째 예문 자동 번역이 완료되었습니다.`);
        } catch (e) {
            console.error("예문 자동 번역 실패: ", e);
            alert("예문 번역 중 오류가 발생했습니다.");
            dispatch(setError(e.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    // [3-5] 예문 발음기호 자동 생성 핸들러
    const handleRomanizeExam = async (index) => {
        const exam = examList[index];
        if (!exam.examKo.trim()) {
            alert("발음 기호로 변환할 한국어 예문을 입력해주세요.");
            return;
        }

        try {
            dispatch(setLoading(true));
            const r = await examApi.romanize(exam.examKo);
            const { romanized } = r.data;

            if (romanized) {
                handleExamChange(index, 'examRoman', romanized);
                alert(`${index + 1}번째 예문 발음기호 생성이 완료되었습니다.`);
            } else {
                alert("API 응답 형식에 문제가 있습니다.");
            }

        } catch (e) {
            console.error("예문 발음기호 생성 중 오류 발생: ", e);
            alert("예문 발음기호 생성 중 오류가 발생했습니다.");
            dispatch(setError(e.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    // [4] 이미지 파일 선택 핸들러
    const handleImageFileChange = (index, file) => {
        setExamList(e => {
            const newList = [...e];
            newList[index] = {
                ...newList[index],
                imageFile: file
            };
            return newList;
        })
    }

    // [5-1] 음성 파일 추가 핸들러
    const handleAddAudioFile = (examIndex, lang, file) => {
        setExamList(e => {
            const newList = [...e];
            newList[examIndex].audioFiles.push({
                type: 'file',
                lang,
                file
            });
            return newList;
        })
    }

    // [5-2] 음성 TTS 추가 핸들러
    const handleAddAudioTTS = (examIndex, lang, text) => {
        if (!text || !text.trim()) {
            alert("텍스트를 입력해주세요.")
            return;
        }

        setExamList(e => {
            const newList = [...e];
            newList[examIndex].audioFiles.push({
                type: 'tts',
                lang,
                text: text.trim(),
                languageCode: languageCodeMap[lang]
            });
            return newList;
        })
    }

    // [5-3] 음성 파일 삭제 핸들러
    const handleRemoveAudioFile = (examIndex, audioIndex) => {
        setExamList(e => {
            const newList = [...e];
            newList[examIndex].audioFiles = newList[examIndex].audioFiles.filter((_, i) => i !== audioIndex);
            return newList;
        })
    }

    // [6] 전체 데이터 유효성 검사
    const validateData = () => {
        if (!selectedGenreNo) {
            alert("장르를 선택해주세요.");
            return false;
        }

        if (!studyData.themeKo.trim()) {
            alert("한국어 주제를 입력해주세요.");
            return false;
        }

        if (examList.length === 0) {
            alert("최소 1개의 예문을 입력해주세요.");
            return false;
        }

        for (let i = 0; i < examList.length; i++) {
            if (!examList[i].examKo.trim()) {
                alert(`${i + 1}번째 예문의 한국어를 입력해주세요.`);
                return false;
            }
        }

        return true;
    }

    // [7] 교육 등록 실행
    const handleSubmit = async () => {
        if (!validateData()) return;

        try {
            dispatch(setLoading(true));

            // 1. 주제 생성
            const studyResponse = await studyApi.create({
                ...studyData,
                genreNo: parseInt(selectedGenreNo)
            });
            const createdStudyNo = studyResponse.data;
            console.log("주제 생성 완료, studyNo:", createdStudyNo);

            // 2. for문으로 각 예문 생성
            for (let i = 0; i < examList.length; i++) {
                const exam = examList[i];

                const examResponse = await examApi.create({
                    ...exam,
                    studyNo: createdStudyNo,
                    imageFile: exam.imageFile
                });
                const createdExamNo = examResponse.data;
                console.log(`Exam ${i + 1} 생성 완료, examNo:`, createdExamNo);

                // 3. 해당 예문의 음성 파일 생성
                for (let j = 0; j < exam.audioFiles.length; j++) {
                    const audioData = exam.audioFiles[j];

                    if (audioData.type == 'file') {
                        await audioApi.create({
                            lang: audioData.lang,
                            examNo: createdExamNo,
                            audioFile: audioData.file
                        })
                        console.log(`Audio ${j + 1} (파일) 생성 완료`);
                    } else if (audioData.type == 'tts') {
                        await audioApi.createFromTTS({
                            text: audioData.text,
                            languageCode: audioData.languageCode,
                            examNo: createdExamNo,
                            lang: audioData.lang
                        });
                        console.log(`Audio ${j + 1} (TTS) 생성 완료`);
                    }
                }
            }

            alert('교육이 성공적으로 등록되었습니다.')
            navigate('/admin/study');

        } catch (e) {
            console.error("교육 등록 실패: ", e);
            alert("교육 등록 중 오류가 발생했습니다.")
            dispatch(setError(e.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    // [8] 언어 설정 함수
    const getLangText = (lang) => {
        const langMap = { 1: '한국어', 2: '영어' };
        return langMap[lang] || '알 수 없음';
    }

    return (
        <div className="admin-container">
            <h2>교육 등록</h2>

            {/* 장르 섹션 */}
            <div className="admin-section">
                <h3>1. 장르 선택</h3>

                <div className="admin-mb-md">
                    <input
                        type="text"
                        placeholder="새 장르명 입력"
                        value={newGenreName}
                        onChange={(e) => setNewGenreName(e.target.value)}
                        className="admin-input admin-mr-md"
                        style={{ width: '300px' }}
                    />
                    <button onClick={handleCreateGenre} className="admin-btn admin-btn-primary">
                        장르 생성
                    </button>
                </div>

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

            {/* 주제 섹션 */}
            <div className="admin-section">
                <div className="admin-flex-between admin-mb-lg">
                    <h3>2. 주제 입력</h3>
                    <button onClick={handleTranslateStudy} className="admin-btn admin-btn-warning">
                        주제/해설 자동번역
                    </button>
                </div>

                <div className="admin-grid">
                    <div className="admin-form-group">
                        <label className="admin-form-label">한국어 주제 *</label>
                        <input
                            type="text"
                            value={studyData.themeKo}
                            onChange={(e) => handleStudyChange('themeKo', e.target.value)}
                            className="admin-input"
                            placeholder="예: 안부 묻기"
                        />
                    </div>

                    <div className="admin-grid-2">
                        <div className="admin-form-group">
                            <label className="admin-form-label">일본어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeJp}
                                onChange={(e) => handleStudyChange('themeJp', e.target.value)}
                                className="admin-input"
                                placeholder={studyData.themeJp || "자동번역 결과"}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">중국어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeCn}
                                onChange={(e) => handleStudyChange('themeCn', e.target.value)}
                                className="admin-input"
                                placeholder={studyData.themeCn || "자동번역 결과"}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">영어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeEn}
                                onChange={(e) => handleStudyChange('themeEn', e.target.value)}
                                className="admin-input"
                                placeholder={studyData.themeEn || "자동번역 결과"}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">스페인어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeEs}
                                onChange={(e) => handleStudyChange('themeEs', e.target.value)}
                                className="admin-input"
                                placeholder={studyData.themeEs || "자동번역 결과"}
                            />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-label">한국어 해설</label>
                        <textarea
                            value={studyData.commenKo}
                            onChange={(e) => handleStudyChange('commenKo', e.target.value)}
                            className="admin-textarea"
                        />
                    </div>

                    <div className="admin-grid-2">
                        <div className="admin-form-group">
                            <label className="admin-form-label">일본어 해설</label>
                            <textarea
                                value={studyData.commenJp}
                                onChange={(e) => handleStudyChange('commenJp', e.target.value)}
                                className="admin-textarea"
                                style={{ minHeight: '60px' }}
                                placeholder={studyData.commenJp || "자동번역 결과"}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">중국어 해설</label>
                            <textarea
                                value={studyData.commenCn}
                                onChange={(e) => handleStudyChange('commenCn', e.target.value)}
                                className="admin-textarea"
                                style={{ minHeight: '60px' }}
                                placeholder={studyData.commenCn || "자동번역 결과"}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">영어 해설</label>
                            <textarea
                                value={studyData.commenEn}
                                onChange={(e) => handleStudyChange('commenEn', e.target.value)}
                                className="admin-textarea"
                                style={{ minHeight: '60px' }}
                                placeholder={studyData.commenEn || "자동번역 결과"}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">스페인어 해설</label>
                            <textarea
                                value={studyData.commenEs}
                                onChange={(e) => handleStudyChange('commenEs', e.target.value)}
                                className="admin-textarea"
                                style={{ minHeight: '60px' }}
                                placeholder={studyData.commenEs || "자동번역 결과"}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 예문 섹션 */}
            <div className="admin-section">
                <div className="admin-flex-between admin-mb-lg">
                    <h3>3. 예문 입력</h3>
                    <button onClick={handleAddExam} className="admin-btn admin-btn-success">
                        예문 추가
                    </button>
                </div>

                {examList.map((exam, examIndex) => (
                    <div key={examIndex} className="admin-exam-item">
                        <div className="admin-exam-header">
                            <h4>예문 {examIndex + 1}</h4>

                            <div className="admin-flex admin-flex-gap-md">
                                <button
                                    onClick={() => handleRomanizeExam(examIndex)}
                                    className="admin-btn admin-btn-sm admin-btn-purple"
                                >
                                    자동 발음 생성
                                </button>
                                <button
                                    onClick={() => handleTranslateExam(examIndex)}
                                    className="admin-btn admin-btn-sm admin-btn-warning"
                                >
                                    자동번역
                                </button>
                                {examList.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveExam(examIndex)}
                                        className="admin-btn admin-btn-sm admin-btn-danger"
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 예문 텍스트 입력 */}
                        <div className="admin-exam-content">
                            <input
                                type="text"
                                placeholder="한국어 예문 *"
                                value={exam.examKo}
                                onChange={(e) => handleExamChange(examIndex, 'examKo', e.target.value)}
                                className="admin-input"
                            />
                            <input
                                type="text"
                                placeholder="발음/로마자"
                                value={exam.examRoman}
                                onChange={(e) => handleExamChange(examIndex, 'examRoman', e.target.value)}
                                className="admin-input"
                            />

                            <div className="admin-grid-2">
                                <input
                                    type="text"
                                    placeholder="일본어 예문"
                                    value={exam.examJp}
                                    onChange={(e) => handleExamChange(examIndex, 'examJp', e.target.value)}
                                    className="admin-input"
                                />
                                <input
                                    type="text"
                                    placeholder="중국어 예문"
                                    value={exam.examCn}
                                    onChange={(e) => handleExamChange(examIndex, 'examCn', e.target.value)}
                                    className="admin-input"
                                />
                                <input
                                    type="text"
                                    placeholder="영어 예문"
                                    value={exam.examEn}
                                    onChange={(e) => handleExamChange(examIndex, 'examEn', e.target.value)}
                                    className="admin-input"
                                />
                                <input
                                    type="text"
                                    placeholder="스페인어 예문"
                                    value={exam.examEs}
                                    onChange={(e) => handleExamChange(examIndex, 'examEs', e.target.value)}
                                    className="admin-input"
                                />
                            </div>
                        </div>

                        {/* 이미지 파일 */}
                        <div className="admin-form-group">
                            <label className="admin-form-label">이미지 파일</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(examIndex, e.target.files[0])}
                                className="admin-input"
                            />
                            {exam.imageFile && <span className="admin-text-success admin-mt-sm" style={{ display: 'block' }}>✓ {exam.imageFile.name}</span>}
                        </div>

                        {/* 음성 파일 */}
                        <div className="admin-audio-section">
                            <label className="admin-form-label">🎤 음성 파일 등록</label>

                            {/* 방법 1: 파일 직접 업로드 */}
                            <div className="admin-audio-method admin-audio-method-file">
                                <label className="admin-form-label" style={{ color: '#1976D2' }}>📁 방법 1: 파일 직접 업로드</label>
                                <div className="admin-file-inline">
                                    <select id={`audioLang-${examIndex}`} className="admin-select">
                                        <option value={1}>한국어</option>
                                        <option value={2}>영어</option>
                                    </select>
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        id={`audioFile-${examIndex}`}
                                        className="admin-input"
                                    />
                                    <button
                                        onClick={() => {
                                            const lang = parseInt(document.getElementById(`audioLang-${examIndex}`).value);
                                            const file = document.getElementById(`audioFile-${examIndex}`).files[0];
                                            if (file) {
                                                handleAddAudioFile(examIndex, lang, file);
                                                document.getElementById(`audioFile-${examIndex}`).value = '';
                                            } else {
                                                alert('파일을 선택해주세요.');
                                            }
                                        }}
                                        className="admin-btn admin-btn-info"
                                    >
                                        파일 추가
                                    </button>
                                </div>
                            </div>

                            {/* 방법 2: TTS로 생성 */}
                            <div className="admin-audio-method admin-audio-method-tts">
                                <label className="admin-form-label" style={{ color: '#388E3C' }}>🤖 방법 2: TTS로 음성 생성 (Google AI)</label>
                                <div className="admin-file-inline">
                                    <select
                                        id={`ttsLang-${examIndex}`}
                                        className="admin-select"
                                        onChange={(e) => {
                                            const lang = parseInt(e.target.value);
                                            const inputBox = document.getElementById(`ttsText-${examIndex}`);
                                            let newText = "";
                                            if (lang === 1) {
                                                newText = exam.examKo || '';
                                            } else if (lang === 2) {
                                                newText = exam.examEn || '';
                                            }
                                            inputBox.value = newText;
                                        }}
                                    >
                                        <option value={1}>한국어</option>
                                        <option value={2}>영어</option>
                                    </select>
                                    <input 
                                        type="text"
                                        id={`ttsText-${examIndex}`}
                                        placeholder="음성으로 변환할 텍스트 입력"
                                        defaultValue={exam.examKo}
                                        className="admin-input"
                                    />
                                    <button
                                        onClick={() => {
                                            const lang = parseInt(document.getElementById(`ttsLang-${examIndex}`).value);
                                            const text = document.getElementById(`ttsText-${examIndex}`).value;
                                            if (text && text.trim()) {
                                                handleAddAudioTTS(examIndex, lang, text);
                                                document.getElementById(`ttsText-${examIndex}`).value = '';
                                            } else {
                                                alert('텍스트를 입력해주세요.');
                                            }
                                        }}
                                        className="admin-btn admin-btn-success"
                                    >
                                        TTS 생성
                                    </button>
                                </div>
                                <p className="admin-hint">💡 팁: 언어 선택 시 해당 예문이 자동으로 입력됩니다.</p>
                            </div>

                            {/* 추가된 음성 파일 목록 */}
                            {exam.audioFiles.length > 0 && (
                                <div className="admin-mt-md">
                                    <label className="admin-form-label">등록된 음성 ({exam.audioFiles.length}개)</label>
                                    {exam.audioFiles.map((audio, audioIndex) => (
                                        <div key={audioIndex} className={`admin-audio-list-item ${audio.type}`}>
                                            <span className={`admin-audio-badge ${audio.type}`}>
                                                {audio.type === 'tts' ? 'TTS' : 'FILE'}
                                            </span>
                                            <span className="admin-audio-text">
                                                {getLangText(audio.lang)} -
                                                {audio.type === 'file' ? ` ${audio.file.name}` : ` "${audio.text}"`}
                                            </span>
                                            <button
                                                onClick={() => handleRemoveAudioFile(examIndex, audioIndex)}
                                                className="admin-btn admin-btn-sm admin-btn-danger"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 하단 버튼 */}
            <div className="admin-action-buttons">
                <button
                    onClick={() => navigate('/admin/study')}
                    className="admin-btn admin-btn-lg admin-btn-secondary"
                >
                    취소
                </button>
                <button
                    onClick={handleSubmit}
                    className="admin-btn admin-btn-lg admin-btn-success"
                >
                    교육 등록
                </button>
            </div>
        </div>
    )
}