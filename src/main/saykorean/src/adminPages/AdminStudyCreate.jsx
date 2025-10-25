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
            audioFiles: [] // 여러 음성 파일
        }
    ])

    // [*] 언어 코드 매핑 (Google TTS 형식)
    const languageCodeMap = {
        1: 'ko-KR',     // 한국어
        2: 'en-US'      // 영어
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
            fetchGenres(); // 목록 새로고침
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

    // [3-5] 예문 발음기호 자동 생성 핸들러 (디버깅용)
    const handleRomanizeExam = async (index) => {
        console.log(`[DEBUG] 1. handleRomanizeExam 호출됨. 인덱스: ${index}`);
        const exam = examList[index];
        if (!exam.examKo.trim()) {
            alert("발음 기호로 변환할 한국어 예문을 입력해주세요.");
            return;
        }
        console.log(`[DEBUG] 2. 변환할 한국어 텍스트: "${exam.examKo}"`);

        try {
            dispatch(setLoading(true));
            const r = await examApi.romanize(exam.examKo);
            
            console.log("[DEBUG] 3. API 응답 받음:", r);
            console.log("[DEBUG] 4. API 응답 데이터 (r.data):", r.data);

            const { romanized } = r.data;
            console.log(`[DEBUG] 5. 추출된 발음기호: "${romanized}"`);

            if (romanized) {
                handleExamChange(index, 'examRoman', romanized);
                console.log("[DEBUG] 6. handleExamChange 호출하여 상태 업데이트 시도.");
                alert(`${index + 1}번째 예문 발음기호 생성이 완료되었습니다.`);
            } else {
                console.error("[DEBUG] 'romanized' 값이 응답에 없습니다.");
                alert("API 응답 형식에 문제가 있습니다. 개발자 콘솔을 확인해주세요.");
            }

        } catch (e) {
            console.error("[DEBUG] 7. 예문 발음기호 생성 중 오류 발생: ", e);
            alert("예문 발음기호 생성 중 오류가 발생했습니다. 개발자 콘솔을 확인해주세요.");
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

    // [7] 교육 등록 실행 * axios 문제. 예문이 null이어도 등록이 됨
    const handleSubmit = async () => {
        // * 기본 유효성 검사 로직 사용
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

                // 예문 생성
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
                        // 3-1. 파일 업로드 방식
                        await audioApi.create({
                            lang: audioData.lang,
                            examNo: createdExamNo,
                            audioFile: audioData.file
                        })
                        console.log(`Audio ${j + 1} (파일) 생성 완료`);
                    } else if (audioData.type == 'tts') {
                        // 3-2. TTS 방식
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

    return (<>
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2>교육 등록</h2>

            {/* 장르 섹션 */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>1. 장르 선택</h3>

                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="text"
                        placeholder="새 장르명 입력"
                        value={newGenreName}
                        onChange={(e) => setNewGenreName(e.target.value)}
                        style={{ padding: '8px', width: '300px', marginRight: '10px' }}
                    />
                    <button onClick={handleCreateGenre} style={{ padding: '8px 20px' }}>
                        장르 생성
                    </button>
                </div>

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

            {/* 주제 섹션 */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>2. 주제 입력</h3>
                    <button onClick={handleTranslateStudy} style={{ padding: '8px 20px', backgroundColor: '#FFC107', color: 'black', border: 'none', borderRadius: '4px' }}>
                        주제/해설 자동번역
                    </button>
                </div>

                <div style={{ display: 'grid', gap: '15px' }}>
                    <div>
                        <label>한국어 주제 *</label>
                        <input
                            type="text"
                            value={studyData.themeKo}
                            onChange={(e) => handleStudyChange('themeKo', e.target.value)}
                            style={{ width: '100%', padding: '8px' }}
                            placeholder="예: 안부 묻기"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <label>일본어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeJp}
                                onChange={(e) => handleStudyChange('themeJp', e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                                placeholder={studyData.themeJp || "자동번역 결과"}
                            />
                        </div>
                        <div>
                            <label>중국어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeCn}
                                onChange={(e) => handleStudyChange('themeCn', e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                                placeholder={studyData.themeCn || "자동번역 결과"}
                            />
                        </div>
                        <div>
                            <label>영어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeEn}
                                onChange={(e) => handleStudyChange('themeEn', e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                                placeholder={studyData.themeEn || "자동번역 결과"}
                            />
                        </div>
                        <div>
                            <label>스페인어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeEs}
                                onChange={(e) => handleStudyChange('themeEs', e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                                placeholder={studyData.themeEs || "자동번역 결과"}
                            />
                        </div>
                    </div>

                    <div>
                        <label>한국어 해설</label>
                        <textarea
                            value={studyData.commenKo}
                            onChange={(e) => handleStudyChange('commenKo', e.target.value)}
                            style={{ width: '100%', padding: '8px', minHeight: '80px' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <label>일본어 해설</label>
                            <textarea
                                value={studyData.commenJp}
                                onChange={(e) => handleStudyChange('commenJp', e.target.value)}
                                style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                                placeholder={studyData.commenJp || "자동번역 결과"}
                            />
                        </div>
                        <div>
                            <label>중국어 해설</label>
                            <textarea
                                value={studyData.commenCn}
                                onChange={(e) => handleStudyChange('commenCn', e.target.value)}
                                style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                                placeholder={studyData.commenCn || "자동번역 결과"}
                            />
                        </div>
                        <div>
                            <label>영어 해설</label>
                            <textarea
                                value={studyData.commenEn}
                                onChange={(e) => handleStudyChange('commenEn', e.target.value)}
                                style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                                placeholder={studyData.commenEn || "자동번역 결과"}
                            />
                        </div>
                        <div>
                            <label>스페인어 해설</label>
                            <textarea
                                value={studyData.commenEs}
                                onChange={(e) => handleStudyChange('commenEs', e.target.value)}
                                style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                                placeholder={studyData.commenEs || "자동번역 결과"}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 예문 섹션 */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>3. 예문 입력</h3>
                    <button onClick={handleAddExam} style={{ padding: '8px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
                        예문 추가
                    </button>
                </div>

                {examList.map((exam, examIndex) => (

                    <div key={examIndex} style={{ marginBottom: '30px', padding: '15px', border: '2px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h4>예문 {examIndex + 1}</h4>

                            <div>
                                <button
                                    onClick={() => handleRomanizeExam(examIndex)}
                                    style={{ padding: '5px 15px', backgroundColor: '#673AB7', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px' }}
                                >
                                    자동 발음 생성
                                </button>
                                <button
                                    onClick={() => handleTranslateExam(examIndex)}
                                    style={{ padding: '5px 15px', backgroundColor: '#FFC107', color: 'black', border: 'none', borderRadius: '4px', marginRight: '10px' }}
                                >
                                    자동번역
                                </button>
                                {examList.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveExam(examIndex)}
                                        style={{ padding: '5px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 예문 텍스트 입력 */}
                        <div style={{ display: 'grid', gap: '10px', marginBottom: '15px' }}>
                            <input
                                type="text"
                                placeholder="한국어 예문 *"
                                value={exam.examKo}
                                onChange={(e) => handleExamChange(examIndex, 'examKo', e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />
                            <input
                                type="text"
                                placeholder="발음/로마자"
                                value={exam.examRoman}
                                onChange={(e) => handleExamChange(examIndex, 'examRoman', e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="일본어 예문"
                                    value={exam.examJp}
                                    onChange={(e) => handleExamChange(examIndex, 'examJp', e.target.value)}
                                    style={{ padding: '8px' }}
                                />
                                <input
                                    type="text"
                                    placeholder="중국어 예문"
                                    value={exam.examCn}
                                    onChange={(e) => handleExamChange(examIndex, 'examCn', e.target.value)}
                                    style={{ padding: '8px' }}
                                />
                                <input
                                    type="text"
                                    placeholder="영어 예문"
                                    value={exam.examEn}
                                    onChange={(e) => handleExamChange(examIndex, 'examEn', e.target.value)}
                                    style={{ padding: '8px' }}
                                />
                                <input
                                    type="text"
                                    placeholder="스페인어 예문"
                                    value={exam.examEs}
                                    onChange={(e) => handleExamChange(examIndex, 'examEs', e.target.value)}
                                    style={{ padding: '8px' }}
                                />
                            </div>
                        </div>

                        {/* 이미지 파일 */}
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>이미지 파일</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(examIndex, e.target.files[0])}
                                style={{ padding: '8px' }}
                            />
                            {exam.imageFile && <span style={{ marginLeft: '10px', color: '#4CAF50' }}>✓ {exam.imageFile.name}</span>}
                        </div>

                        {/* 음성 파일 - 파일 업로드 방식 */}
                        <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#fff', borderRadius: '4px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>
                                🎤 음성 파일 등록
                            </label>

                            {/* 방법 1: 파일 직접 업로드 */}
                            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1976D2' }}>
                                    📁 방법 1: 파일 직접 업로드
                                </label>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <select id={`audioLang-${examIndex}`} style={{ padding: '8px' }}>
                                        <option value={1}>한국어</option>
                                        <option value={2}>영어</option>
                                    </select>
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        id={`audioFile-${examIndex}`}
                                        style={{ padding: '8px', flex: 1 }}
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
                                        style={{ padding: '8px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}
                                    >
                                        파일 추가
                                    </button>
                                </div>
                            </div>

                            {/* 방법 2: TTS로 생성 */}
                            <div style={{ padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#388E3C' }}>
                                    🤖 방법 2: TTS로 음성 생성 (Google AI)
                                </label>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <select
                                        id={`ttsLang-${examIndex}`}
                                        style={{ padding: '8px' }}
                                        onChange={(e) => {
                                            const lang = parseInt(e.target.value);
                                            const inputBox = document.getElementById(`ttsText-${examIndex}`);
                                            // 언어별 예문 매칭
                                            let newText = "";
                                            if (lang === 1) {                   // 한국어
                                                newText = exam.examKo || '';
                                            } else if (lang === 2) {            // 영어
                                                newText = exam.examEn || '';
                                            }
                                            // 자동 입력
                                            inputBox.value = newText;
                                        }}>
                                        <option value={1}>한국어</option>
                                        <option value={2}>영어</option>
                                    </select>
                                    <input 
                                        type="text"
                                        id={`ttsText-${examIndex}`}
                                        placeholder="음성으로 변환할 텍스트 입력"
                                        defaultValue={exam.examKo}   // ✅ 기본값을 바로 세팅
                                        style={{ padding: '8px', flex: 1 }}
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
                                        style={{ padding: '8px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
                                    >
                                        TTS 생성
                                    </button>
                                </div>
                                <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
                                    💡 팁: 언어 선택 시 해당 예문이 자동으로 입력됩니다.
                                </p>
                            </div>

                            {/* 추가된 음성 파일 목록 */}
                            {exam.audioFiles.length > 0 && (
                                <div style={{ marginTop: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                        등록된 음성 ({exam.audioFiles.length}개)
                                    </label>
                                    {exam.audioFiles.map((audio, audioIndex) => (
                                        <div key={audioIndex} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '5px',
                                            padding: '8px',
                                            backgroundColor: audio.type === 'tts' ? '#e3f2fd' : '#fff3e0',
                                            borderRadius: '4px',
                                            border: `1px solid ${audio.type === 'tts' ? '#2196F3' : '#FF9800'}`
                                        }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                backgroundColor: audio.type === 'tts' ? '#2196F3' : '#FF9800',
                                                color: 'white',
                                                borderRadius: '3px',
                                                fontSize: '11px',
                                                fontWeight: 'bold'
                                            }}>
                                                {audio.type === 'tts' ? 'TTS' : 'FILE'}
                                            </span>
                                            <span style={{ flex: 1, fontSize: '14px' }}>
                                                {getLangText(audio.lang)} -
                                                {audio.type === 'file' ? ` ${audio.file.name}` : ` "${audio.text}"`}
                                            </span>
                                            <button
                                                onClick={() => handleRemoveAudioFile(examIndex, audioIndex)}
                                                style={{ padding: '4px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
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
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                <button
                    onClick={() => navigate('/admin/study')}
                    style={{ padding: '15px 40px', fontSize: '16px', backgroundColor: '#9E9E9E', color: 'white', border: 'none', borderRadius: '8px' }}
                >
                    취소
                </button>
                <button
                    onClick={handleSubmit}
                    style={{ padding: '15px 40px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px' }}
                >
                    교육 등록
                </button>
            </div>
        </div>
    </>)
}