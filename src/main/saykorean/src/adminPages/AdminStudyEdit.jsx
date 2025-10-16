import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import { genreApi, studyApi, examApi, audioApi } from "../api/adminApi";
import { setGenres } from "../store/adminSlice";
import { useEffect, useState } from "react";

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
    const [loading, setLoading] = useState(true);

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
            console.log("studyApi:", studyApi);

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

    // [2-4] 새 음성 파일 추가 핸들러 * 비동기함수 추가
    const handleAddNewAudioFile = async (examIndex, lang, file) => {
        setExamList(e => {
            const newList = [...e];
            if (!newList[examIndex].newAudioFiles) {
                newList[examIndex].newAudioFiles = [];
            }
            newList[examIndex].newAudioFiles.push({ lang, file });
            return newList;
        })
    }

    // [2-5] 새 음성 파일삭제 핸들러
    const handleRemoveNewAudioFile = async (examIndex, audioIndex) => {
        setExamList(e => {
            const newList = [...e];
            newList[examIndex].newAudioFiles = newList[examIndex].newAudioFiles.filter((_, i) => i !== audioIndex);
            return newList;
        })
    }

    // [2-6] 기존 음성 파일 삭제 핸들러
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

    // [2-7] 예문 추가
    const handleAddExam = () => {
        // 새 예문은 examNo가 없음 (추가 시 생성됨)
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

    // [2-8] 예문 삭제
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
                            const audioFile = exam.newAudioFiles[j];
                            await audioApi.create({
                                lang: audioFile.lang,
                                examNo: exam.examNo,
                                audioFile: audioFile.file
                            });
                            console.log(`새 Audio 추가 완료`);
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
                            const audioFile = exam.newAudioFiles[j];
                            await audioApi.create({
                                lang: audioFile.lang,
                                examNo: createdExamNo,
                                audioFile: audioFile.file
                            });
                            console.log(`새 Audio 추가 완료`);
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

    // [*] 페이지 로딩 로직
    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>;
    }



    return (<>
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2>교육 수정</h2>

            {/* 장르 섹션 */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>1. 장르 선택</h3>
                <select
                    value={studyData.genreNo}
                    onChange={(e) => handleStudyChange('genreNo', parseInt(e.target.value))}
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
                <h3>2. 주제 수정</h3>

                <div style={{ display: 'grid', gap: '15px' }}>
                    <div>
                        <label>한국어 주제 *</label>
                        <input
                            type="text"
                            value={studyData.themeKo}
                            onChange={(e) => handleStudyChange('themeKo', e.target.value)}
                            style={{ width: '100%', padding: '8px' }}
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
                            />
                        </div>
                        <div>
                            <label>중국어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeCn}
                                onChange={(e) => handleStudyChange('themeCn', e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div>
                            <label>영어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeEn}
                                onChange={(e) => handleStudyChange('themeEn', e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div>
                            <label>스페인어 주제</label>
                            <input
                                type="text"
                                value={studyData.themeEs}
                                onChange={(e) => handleStudyChange('themeEs', e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
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
                            />
                        </div>
                        <div>
                            <label>중국어 해설</label>
                            <textarea
                                value={studyData.commenCn}
                                onChange={(e) => handleStudyChange('commenCn', e.target.value)}
                                style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                            />
                        </div>
                        <div>
                            <label>영어 해설</label>
                            <textarea
                                value={studyData.commenEn}
                                onChange={(e) => handleStudyChange('commenEn', e.target.value)}
                                style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                            />
                        </div>
                        <div>
                            <label>스페인어 해설</label>
                            <textarea
                                value={studyData.commenEs}
                                onChange={(e) => handleStudyChange('commenEs', e.target.value)}
                                style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 예문 섹션 */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>3. 예문 수정</h3>
                    <button onClick={handleAddExam} style={{ padding: '8px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
                        예문 추가
                    </button>
                </div>

                {examList.map((exam, examIndex) => (
                    <div key={examIndex} style={{ marginBottom: '30px', padding: '15px', border: '2px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h4>예문 {examIndex + 1} {exam.examNo ? `(ID: ${exam.examNo})` : '(새로 추가)'}</h4>
                            <button
                                onClick={() => handleDeleteExam(examIndex, exam.examNo)}
                                style={{ padding: '5px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
                            >
                                삭제
                            </button>
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

                            {exam.imagePath && (
                                <div style={{ marginBottom: '10px' }}>
                                    <p style={{ fontSize: '14px', color: '#666' }}>현재 이미지:</p>
                                    <img
                                        src={exam.imagePath}
                                        alt="현재 이미지"
                                        style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '4px' }}
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleNewImageFile(examIndex, e.target.files[0])}
                                style={{ padding: '8px' }}
                            />
                            {exam.newImageFile && <span style={{ marginLeft: '10px', color: '#4CAF50' }}>✓ 새 이미지: {exam.newImageFile.name}</span>}
                        </div>

                        {/* 기존 음성 파일 목록 */}
                        {exam.audioFiles && exam.audioFiles.length > 0 && (
                            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>기존 음성 파일</label>
                                {exam.audioFiles.map((audio, audioIndex) => (
                                    <div key={audio.audioNo} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', padding: '5px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                                        <span style={{ flex: 1, fontSize: '14px' }}>
                                            {getLangText(audio.lang)} - {audio.audioName}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteExistingAudio(examIndex, audio.audioNo)}
                                            style={{ padding: '4px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 새 음성 파일 추가 */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>새 음성 파일 추가</label>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <select id={`newAudioLang-${examIndex}`} style={{ padding: '8px' }}>
                                    <option value={1}>한국어</option>
                                    <option value={2}>영어</option>
                                </select>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    id={`newAudioFile-${examIndex}`}
                                    style={{ padding: '8px' }}
                                />
                                <button
                                    onClick={() => {
                                        const lang = parseInt(document.getElementById(`newAudioLang-${examIndex}`).value);
                                        const file = document.getElementById(`newAudioFile-${examIndex}`).files[0];
                                        if (file) {
                                            handleAddNewAudioFile(examIndex, lang, file);
                                            document.getElementById(`newAudioFile-${examIndex}`).value = '';
                                        }
                                    }}
                                    style={{ padding: '8px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}
                                >
                                    음성 추가
                                </button>
                            </div>

                            {/* 추가된 새 음성 파일 목록 */}
                            {exam.newAudioFiles && exam.newAudioFiles.length > 0 && (
                                <div style={{ marginTop: '10px' }}>
                                    {exam.newAudioFiles.map((audio, audioIndex) => (
                                        <div key={audioIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', padding: '5px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                                            <span style={{ flex: 1 }}>
                                                {audio.lang === 1 ? '🇰🇷 한국어' : '🇺🇸 영어'} - {audio.file.name} (새로 추가 예정)
                                            </span>
                                            <button
                                                onClick={() => handleRemoveNewAudioFile(examIndex, audioIndex)}
                                                style={{ padding: '4px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
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
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                <button
                    onClick={() => navigate('/admin/study')}
                    style={{ padding: '15px 40px', fontSize: '16px', backgroundColor: '#9E9E9E', color: 'white', border: 'none', borderRadius: '8px' }}
                >
                    취소
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ padding: '15px 40px', fontSize: '16px', backgroundColor: loading ? '#ccc' : '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? '처리 중...' : '수정 완료'}
                </button>
            </div>
        </div>
    </>)
}