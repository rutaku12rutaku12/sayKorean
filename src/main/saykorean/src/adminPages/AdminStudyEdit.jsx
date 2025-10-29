import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import { genreApi, studyApi, examApi, audioApi } from "../api/adminApi";
import { setGenres } from "../store/adminSlice";
import { useEffect, useState } from "react";
import "../styles/AdminCommon.css";

export default function AdminStudyEdit(props) {

    // [*] 가상DOM, 리덕스
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { studyNo } = useParams();
    const genres = useSelector(state => state.admin.genres);

    // [*] 주제 데이터
    const [studyData, setStudyData] = useState({
        studyNo: parseInt(studyNo),
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
        genreNo: ""
    });

    // [*] 예문 데이터
    const [examList, setExamList] = useState([]);

    // [*] 로딩 상태
    const [loading, setLoading] = useState(false);

    // [*] 언어 코드 매핑 (Google TTS 형식)
    const languageCodeMap = {
        1: 'ko-KR',
        2: 'en-US',
    }

    // [*] 마운트 시 교육 수정 로직 불러오기
    useEffect(() => {
        fetchData();
    }, []);

    // [1] 데이터 조회
    const fetchData = async () => {
        try {
            // 장르 목록 조회
            const genreRes = await genreApi.getAll();
            dispatch(setGenres(genreRes.data));

            // 주제 상세 조회
            const studyRes = await studyApi.getIndi(studyNo);
            setStudyData(studyRes.data);

            // 예문 전체 조회 후 해당 주제 예문만 필터링
            const examRes = await examApi.getAll();
            const studyExams = examRes.data.filter(exam => exam.studyNo == parseInt(studyNo));

            // 각 예문의 음성 파일 조회
            const audioRes = await audioApi.getAll();
            const examsWithAudios = studyExams.map(exam => ({
                ...exam,
                audioFiles: audioRes.data.filter(audio => audio.examNo == exam.examNo),
                newImageFile: null,
                newAudioFiles: []
            }));

            setExamList(examsWithAudios);
            setLoading(false);

        } catch (e) {
            console.error("데이터 조회 실패:", e)
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
            setLoading(false);
        }
    }

    // [2-1] 주제 입력 핸들러
    const handleStudyChange = async (field, value) => {
        setStudyData(e => ({
            ...e,
            [field]: value
        }));
    };

    // [2-1-1] 주제/해설 자동 번역 핸들러
    const handleTranslateStudy = async () => {
        if (!studyData.themeKo.trim() && !studyData.commenKo.trim()) {
            alert("번역할 한국어 주제 또는 해설을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            const r = await studyApi.translate({
                themeKo: studyData.themeKo,
                commenKo: studyData.commenKo
            });
            const { themeJp, themeCn, themeEn, themeEs, commenJp, commenCn, commenEn, commenEs } = r.data;

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
        } finally {
            setLoading(false);
        }
    };

    // [2-2] 예문 입력 핸들러
    const handleExamChange = async (index, field, value) => {
        setExamList(e => {
            const newList = [...e];
            newList[index] = {
                ...newList[index],
                [field]: value
            };
            return newList;
        })
    }

    // [2-2-1] 예문 자동 번역 핸들러
    const handleTranslateExam = async (index) => {
        const exam = examList[index];
        if (!exam.examKo.trim()) {
            alert("번역할 한국어 예문을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

    // [2-2-2] 예문 발음기호 자동 생성 핸들러
    const handleRomanizeExam = async (index) => {
        const exam = examList[index];
        if (!exam.examKo.trim()) {
            alert("발음 기호로 변환할 한국어 예문을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    // [2-3] 새 이미지 파일 선택 핸들러
    const handleNewImageFile = async (index, file) => {
        setExamList(e => {
            const newList = [...e];
            newList[index] = {
                ...newList[index],
                newImageFile: file
            };
            return newList;
        })
    }

    // [2-4] 새 음성 파일 추가 핸들러
    const handleAddNewAudioFile = async (examIndex, lang, file) => {
        setExamList(e => {
            const newList = [...e];
            if (!newList[examIndex].newAudioFiles) {
                newList[examIndex].newAudioFiles = [];
            }
            newList[examIndex].newAudioFiles.push({
                type: 'file',
                lang,
                file
            });
            return newList;
        })
    }

    // [2-5] TTS 새 음성 추가 핸들러
    const handleAddNewAudioTTS = async (examIndex, lang, text) => {
        if (!text || !text.trim()) {
            alert("텍스트를 입력해주세요.");
            return;
        }

        setExamList(e => {
            const newList = [...e];
            if (!newList[examIndex].newAudioFiles) {
                newList[examIndex].newAudioFiles = [];
            }
            newList[examIndex].newAudioFiles.push({
                type: 'tts',
                lang,
                text: text.trim(),
                languageCode: languageCodeMap[lang]
            });
            return newList;
        })
    }

    // [2-6] 새 음성 파일삭제 핸들러
    const handleRemoveNewAudioFile = async (examIndex, audioIndex) => {
        setExamList(e => {
            const newList = [...e];
            newList[examIndex].newAudioFiles = newList[examIndex].newAudioFiles.filter((_, i) => i !== audioIndex);
            return newList;
        })
    }

    // [2-7] 기존 음성 파일 삭제 핸들러
    const handleDeleteExistingAudio = async (examIndex, audioNo) => {
        if (!window.confirm("이 음성 파일을 삭제하시겠습니까?")) return;

        try {
            await audioApi.delete(audioNo);
            alert("음성 파일이 삭제되었습니다.")

            // 로컬 상태 업데이트
            setExamList(e => {
                const newList = [...e];
                newList[examIndex].audioFiles = newList[examIndex].audioFiles.filter(audio => audio.audioNo !== audioNo);
                return newList;
            })

        } catch (e) {
            console.error("음성 파일 삭제 실패:", e);
            alert("음성 파일 삭제에 실패했습니다.")
        }
    }

    // [2-8] 예문 추가
    const handleAddExam = () => {
        setExamList(e => [...e, {
            examKo: "",
            examRoman: "",
            examJp: "",
            examCn: "",
            examEn: "",
            examEs: "",
            studyNo: parseInt(studyNo),
            imageFile: null,
            newImageFile: null,
            audioFiles: [],
            newAudioFiles: []
        }]);
    };

    // [2-9] 예문 삭제
    const handleDeleteExam = async (index, examNo) => {
        if (!examNo) {
            // DB에 저장되지 않은 예문은 바로 삭제
            setExamList(e => e.filter((_, i) => i !== index));
            return;
        }

        if (!window.confirm("이 예문을 삭제하시겠습니까?")) return;

        try {
            await examApi.delete(examNo);
            alert("예문이 삭제되었습니다.")
            setExamList(e => e.filter((_, i) => i !== index));
        } catch (e) {
            console.error("예문 삭제 실패:", e);
            alert("예문 삭제에 실패했습니다.");
        }
    }

    // [*] 오디오 언어 코드를 텍스트로 변환
    const getLangText = (lang) => {
        const langMap = { 1: '한국어', 2: '영어', };
        return langMap[lang] || '알 수 없음';
    };

    // [3] 데이터 유효성 검사
    const validateData = () => {
        if (!studyData.genreNo) {
            alert("장르를 선택해주세요.");
            return false;
        }

        if (!studyData.themeKo.trim()) {
            alert("한국어 주제를 입력해주세요.");
            return false;
        }

        if (examList.length === 0) {
            alert("최소 1개의 예문이 필요합니다.");
            return false;
        }

        for (let i = 0; i < examList.length; i++) {
            if (!examList[i].examKo.trim()) {
                alert(`${i + 1}번째 예문의 한국어를 입력해주세요.`);
                return false;
            }
        }

        return true;
    };

    // [4] 수정 실행
    const handleSubmit = async () => {
        if (!validateData()) return;

        try {
            setLoading(true);

            // 1. 주제 or 해설 (Study) 수정
            await studyApi.update(studyData);
            console.log("Study 수정 완료")

            // 2. 예문 처리
            for (let i = 0; i < examList.length; i++) {
                const exam = examList[i];

                if (exam.examNo) {
                    // 기존 예문 수정
                    await examApi.update({
                        ...exam,
                        newImageFile: exam.newImageFile
                    });
                    console.log(`Exam ${exam.examNo} 수정 완료`);

                    // 새로운 음성 파일 추가
                    if (exam.newAudioFiles && exam.newAudioFiles.length > 0) {
                        for (let j = 0; j < exam.newAudioFiles.length; j++) {
                            const audioData = exam.newAudioFiles[j];

                            if (audioData.type == 'file') {
                                // 파일 업로드
                                await audioApi.create({
                                    lang: audioData.lang,
                                    examNo: exam.examNo,
                                    audioFile: audioData.file
                                });
                                console.log(`새 Audio (파일) 추가 완료`);
                            } else if (audioData.type == 'tts') {
                                // TTS 생성
                                await audioApi.createFromTTS({
                                    text: audioData.text,
                                    languageCode: audioData.languageCode,
                                    examNo: exam.examNo,
                                    lang: audioData.lang
                                });
                                console.log(`새 Audio (TTS) 추가 완료`)
                            }
                        }
                    }
                } else {
                    // 새 예문 생성
                    const examResponse = await examApi.create({
                        ...exam,
                        studyNo: parseInt(studyNo),
                        imageFile: exam.newImageFile
                    });
                    const createdExamNo = examResponse.data;
                    console.log(`새 Exam 생성 완료, examNo: ${createdExamNo}`);

                    // 새 예문의 음성 파일 추가
                    if (exam.newAudioFiles && exam.newAudioFiles.length > 0) {
                        for (let j = 0; j < exam.newAudioFiles.length; j++) {
                            const audioData = exam.newAudioFiles[j];

                            if (audioData.type === 'file') {
                                await audioApi.create({
                                    lang: audioData.lang,
                                    examNo: createdExamNo,
                                    audioFile: audioData.file
                                });
                                console.log(`새 Audio (파일) 추가 완료`);
                            } else if (audioData.type === 'tts') {
                                await audioApi.createFromTTS({
                                    text: audioData.text,
                                    languageCode: audioData.languageCode,
                                    examNo: createdExamNo,
                                    lang: audioData.lang
                                });
                                console.log(`새 Audio (TTS) 추가 완료`);
                            }
                        }
                    }
                }
            }
            alert("교육이 성공적으로 수정되었습니다!");
            navigate('/admin/study');

        } catch (e) {
            console.error("교육 수정 실패:", e);
            alert("교육 수정 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // [*] 로딩 중 출력페이지
    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}> <img src="/img/loading.png" style={{ maxWidth: '400px', borderRadius: '12px' }} /> </div>;
    }

    return (
        <div className="admin-container">
            <h2>교육 수정</h2>

            {/* 장르 섹션 */}
            <div className="admin-section">
                <h3>1. 장르 선택</h3>
                <select
                    value={studyData.genreNo}
                    onChange={(e) => handleStudyChange('genreNo', parseInt(e.target.value))}
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
                    <h3>2. 주제 수정</h3>
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
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">중국어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeCn}
                                onChange={(e) => handleStudyChange('themeCn', e.target.value)}
                                className="admin-input"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">영어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeEn}
                                onChange={(e) => handleStudyChange('themeEn', e.target.value)}
                                className="admin-input"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">스페인어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeEs}
                                onChange={(e) => handleStudyChange('themeEs', e.target.value)}
                                className="admin-input"
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
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">중국어 해설</label>
                            <textarea
                                value={studyData.commenCn}
                                onChange={(e) => handleStudyChange('commenCn', e.target.value)}
                                className="admin-textarea"
                                style={{ minHeight: '60px' }}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">영어 해설</label>
                            <textarea
                                value={studyData.commenEn}
                                onChange={(e) => handleStudyChange('commenEn', e.target.value)}
                                className="admin-textarea"
                                style={{ minHeight: '60px' }}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">스페인어 해설</label>
                            <textarea
                                value={studyData.commenEs}
                                onChange={(e) => handleStudyChange('commenEs', e.target.value)}
                                className="admin-textarea"
                                style={{ minHeight: '60px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 예문 섹션 */}
            <div className="admin-section">
                <div className="admin-flex-between admin-mb-lg">
                    <h3>3. 예문 수정</h3>
                    <button onClick={handleAddExam} className="admin-btn admin-btn-success">
                        예문 추가
                    </button>
                </div>

                {examList.map((exam, examIndex) => (
                    <div key={examIndex} className="admin-exam-item">
                        <div className="admin-exam-header">
                            <h4>예문 {examIndex + 1} {exam.examNo ? `(ID: ${exam.examNo})` : '(새로 추가)'}</h4>

                            <div className="admin-flex admin-flex-gap-md">
                                <button
                                    onClick={() => (handleRomanizeExam(examIndex), handleTranslateExam(examIndex))}
                                    className="admin-btn admin-btn-sm admin-btn-warning"
                                >
                                    자동번역 및 발음 생성
                                </button>
                                <button
                                    onClick={() => handleDeleteExam(examIndex, exam.examNo)}
                                    className="admin-btn admin-btn-sm admin-btn-danger"
                                >
                                    삭제
                                </button>
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

                            {exam.imagePath && (
                                <div className="admin-mb-sm">
                                    <p className="admin-text-muted" style={{ fontSize: '14px' }}>현재 이미지:</p>
                                    <img
                                        src={exam.imagePath}
                                        alt="현재 이미지"
                                        className="admin-image-preview"
                                        onError={(e) => {
                                            console.error("이미지 로드 실패:", exam.imagePath);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleNewImageFile(examIndex, e.target.files[0])}
                                className="admin-input"
                            />
                            {exam.newImageFile && <span className="admin-text-success admin-mt-sm" style={{ display: 'block' }}>✓ 새 이미지: {exam.newImageFile.name}</span>}
                        </div>

                        {/* 기존 음성 파일 목록 */}
                        {exam.audioFiles && exam.audioFiles.length > 0 && (
                            <div className="admin-audio-section admin-mb-md">
                                <label className="admin-form-label">기존 음성 파일</label>
                                {exam.audioFiles.map((audio) => (
                                    <div key={audio.audioNo} className="admin-flex-between" style={{ marginBottom: '5px', padding: '5px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                                        <span style={{ fontSize: '14px' }}>
                                            {getLangText(audio.lang)} - {audio.audioName}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteExistingAudio(examIndex, audio.audioNo)}
                                            className="admin-btn admin-btn-sm admin-btn-danger"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 새 음성 파일 추가 */}
                        <div className="admin-audio-section">
                            <label className="admin-form-label">🎤 새 음성 파일 추가</label>

                            {/* 방법 1: 파일 직접 업로드 */}
                            <div className="admin-audio-method admin-audio-method-file">
                                <label className="admin-form-label" style={{ color: '#1976D2' }}>📁 방법 1: 파일 직접 업로드</label>
                                <div className="admin-file-inline">
                                    <select id={`newAudioLang-${examIndex}`} className="admin-select">
                                        <option value={1}>한국어</option>
                                        <option value={2}>영어</option>
                                    </select>
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        id={`newAudioFile-${examIndex}`}
                                        className="admin-input"
                                    />
                                    <button
                                        onClick={() => {
                                            const lang = parseInt(document.getElementById(`newAudioLang-${examIndex}`).value);
                                            const file = document.getElementById(`newAudioFile-${examIndex}`).files[0];
                                            if (file) {
                                                handleAddNewAudioFile(examIndex, lang, file);
                                                document.getElementById(`newAudioFile-${examIndex}`).value = '';
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
                                        id={`newTTSLang-${examIndex}`}
                                        className="admin-select"
                                        onChange={(e) => {
                                            const lang = parseInt(e.target.value);
                                            const inputBox = document.getElementById(`newTTSText-${examIndex}`);
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
                                        id={`newTTSText-${examIndex}`}
                                        placeholder="음성으로 변환할 텍스트 입력"
                                        defaultValue={exam.examKo}
                                        className="admin-input"
                                    />
                                    <button
                                        onClick={() => {
                                            const lang = parseInt(document.getElementById(`newTTSLang-${examIndex}`).value);
                                            const text = document.getElementById(`newTTSText-${examIndex}`).value;
                                            if (text && text.trim()) {
                                                handleAddNewAudioTTS(examIndex, lang, text);
                                                document.getElementById(`newTTSText-${examIndex}`).value = '';
                                            } else {
                                                alert('텍스트를 입력해주세요.');
                                            }
                                        }}
                                        className="admin-btn admin-btn-success"
                                    >
                                        TTS 생성
                                    </button>
                                </div>
                                <p className="admin-hint">💡 팁: 언어 선택 시 해당 예문이 자동으로 입력됩니다</p>
                            </div>

                            {/* 추가된 새 음성 파일 목록 */}
                            {exam.newAudioFiles && exam.newAudioFiles.length > 0 && (
                                <div className="admin-mt-md">
                                    <label className="admin-form-label">추가 예정 음성 ({exam.newAudioFiles.length}개)</label>
                                    {exam.newAudioFiles.map((audio, audioIndex) => (
                                        <div key={audioIndex} className={`admin-audio-list-item ${audio.type}`}>
                                            <span className={`admin-audio-badge ${audio.type}`}>
                                                {audio.type === 'tts' ? 'TTS' : 'FILE'}
                                            </span>
                                            <span className="admin-audio-text">
                                                {getLangText(audio.lang)} -
                                                {audio.type === 'file' ? ` ${audio.file.name}` : ` "${audio.text}"`}
                                            </span>
                                            <button
                                                onClick={() => handleRemoveNewAudioFile(examIndex, audioIndex)}
                                                className="admin-btn admin-btn-sm admin-btn-danger"
                                            >
                                                취소
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
                    disabled={loading}
                    className="admin-btn admin-btn-lg admin-btn-success"
                >
                    {loading ? '처리 중...' : '수정 완료'}
                </button>
            </div>
        </div>
    )
}