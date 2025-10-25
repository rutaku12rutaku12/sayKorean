import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setGenres, setStudies, setExams, setAudios } from "../store/adminSlice";
import { audioApi, examApi, genreApi, studyApi } from "../api/adminApi";
import "../styles/AdminCommon.css";

export default function AdminStudyList(props) {

    // [*] 가상DOM, 리덕스
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const genres = useSelector(state => state.admin.genres);
    const studies = useSelector(state => state.admin.studies);
    const exams = useSelector(state => state.admin.exams);
    const audios = useSelector(state => state.admin.audios);

    // [*] 상세보기 상태 관리
    const [selectedGenreNo, setSelectedGenreNo] = useState(null);
    const [selectedStudyNo, setSelectedStudyNo] = useState(null);

    // [*] 마운트 시 교육 전체 출력 로직
    useEffect(() => {
        fetchAllData();
    }, []);

    // [1] 전체 데이터 조회
    const fetchAllData = async () => {
        try {
            const [genreRes, studyRes, examRes, audioRes] = await Promise.all([
                genreApi.getAll(),
                studyApi.getAll(),
                examApi.getAll(),
                audioApi.getAll()
            ])

            dispatch(setGenres(genreRes.data));
            dispatch(setStudies(studyRes.data));
            dispatch(setExams(examRes.data));
            dispatch(setAudios(audioRes.data));

        } catch (e) {
            console.error("데이터 조회 실패:", e);
            alert("데이터 호출 중 오류가 발생했습니다.");
        }
    }

    // [2-1] 장르 삭제
    const handleDeleteGenre = async (genreNo) => {
        if (!window.confirm("이 장르를 삭제하시겠습니까?")) return;

        try {
            await genreApi.delete(genreNo);
            alert("장르가 삭제되었습니다.");
            fetchAllData();
        } catch (e) {
            console.error("장르 삭제 실패:", e);
            alert("장르 삭제에 실패했습니다. 하위 주제와 예문이 있는지 확인해주세요.");
        }
    }

    // [2-2] 주제 삭제
    const handleDeleteStudy = async (studyNo) => {
        if (!window.confirm("이 주제를 삭제하시겠습니까?")) return;

        try {
            await studyApi.delete(studyNo);
            alert("주제가 삭제되었습니다.")
            fetchAllData();
        } catch (e) {
            console.error("주제 삭제 실패:", e);
            alert("주제 삭제에 실패했습니다.")
        }
    };

    // [2-3] 예문 삭제
    const handleDeleteExam = async (examNo) => {
        if (!window.confirm("이 예문을 삭제하시겠습니까?")) return;

        try {
            await examApi.delete(examNo);
            alert("예문이 삭제되었습니다.")
            fetchAllData();
        } catch (e) {
            console.error("예문 삭제 실패:", e);
            alert("예문 삭제에 실패했습니다.");
        }
    }

    // [2-4] 음성 삭제
    const handleDeleteAudio = async (audioNo) => {
        if (!window.confirm("이 음성 파일을 삭제하시겠습니까?")) return;

        try {
            await audioApi.delete(audioNo);
            alert("음성 파일이 삭제되었습니다.")
            fetchAllData();
        } catch (e) {
            console.error("음성 삭제 실패:", e)
            alert("음성 파일 삭제에 실패했습니다.");
        }
    }

    // [3-1] 장르에 속한 주제 필터링
    const getStudiesByGenre = (genreNo) => {
        return studies.filter(study => study.genreNo == genreNo);
    };

    // [3-2] 주제에 속한 예문 필터링
    const getExamsByStudy = (studyNo) => {
        return exams.filter(exam => exam.studyNo == studyNo);
    };

    // [3-3] 예문에 속한 음성 필터링
    const getAudiosByExam = (examNo) => {
        return audios.filter(audio => audio.examNo == examNo);
    }

    // [4] 음성 언어 코드를 텍스트로 변환
    const getLangText = (lang) => {
        const langMap = { 1: "한국어", 2: "영어" };
        return langMap[lang] || '알 수 없는 언어코드입니다.';
    }

    return (<>

        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>교육 관리</h2>
                <button
                    onClick={() => navigate('/admin/study/create')}
                    style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    새 교육 등록
                </button>
            </div>

            {/* 장르 목록 */}
            <div style={{ marginBottom: '30px' }}>
                <h3 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>장르 목록</h3>

                {genres.map(genre => (
                    <div key={genre.genreNo} style={{ marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                        {/* 장르 헤더 */}
                        <div
                            style={{
                                padding: '15px',
                                backgroundColor: selectedGenreNo === genre.genreNo ? '#e3f2fd' : '#f5f5f5',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                            onClick={() => setSelectedGenreNo(selectedGenreNo === genre.genreNo ? null : genre.genreNo)}
                        >
                            <div>
                                <strong style={{ fontSize: '18px' }}>{genre.genreName}</strong>
                                <span style={{ marginLeft: '10px', color: '#666' }}>
                                    (주제 {getStudiesByGenre(genre.genreNo).length}개)
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteGenre(genre.genreNo);
                                    }}
                                    style={{ padding: '5px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
                                >
                                    장르 삭제
                                </button>
                                <span style={{ fontSize: '20px' }}>
                                    {selectedGenreNo === genre.genreNo ? '▲' : '▼'}
                                </span>
                            </div>
                        </div>

                        {/* 주제 목록 (장르 선택 시 표시) */}
                        {selectedGenreNo === genre.genreNo && (
                            <div style={{ padding: '15px', backgroundColor: '#fff' }}>
                                {getStudiesByGenre(genre.genreNo).length === 0 ? (
                                    <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                                        이 장르에 등록된 주제가 없습니다.
                                    </p>
                                ) : (
                                    getStudiesByGenre(genre.genreNo).map(study => (
                                        <div key={study.studyNo} style={{ marginBottom: '15px', border: '1px solid #e0e0e0', borderRadius: '6px' }}>
                                            {/* 주제 헤더 */}
                                            <div
                                                style={{
                                                    padding: '12px',
                                                    backgroundColor: selectedStudyNo === study.studyNo ? '#fff3e0' : '#fafafa',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}
                                                onClick={() => setSelectedStudyNo(selectedStudyNo === study.studyNo ? null : study.studyNo)}
                                            >
                                                <div>
                                                    <strong>{study.themeKo}</strong>
                                                    <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>
                                                        (예문 {getExamsByStudy(study.studyNo).length}개)
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/admin/study/edit/${study.studyNo}`);
                                                        }}
                                                        style={{ padding: '4px 12px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px' }}
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteStudy(study.studyNo);
                                                        }}
                                                        style={{ padding: '4px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px' }}
                                                    >
                                                        삭제
                                                    </button>
                                                    <span style={{ fontSize: '16px' }}>
                                                        {selectedStudyNo === study.studyNo ? '▲' : '▼'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* 주제 상세 정보 */}
                                            {selectedStudyNo === study.studyNo && (
                                                <div style={{ padding: '15px', backgroundColor: '#fff', borderTop: '1px solid #e0e0e0' }}>
                                                    {/* 해설 정보 */}
                                                    <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                                                        <h4 style={{ marginBottom: '10px' }}>해설</h4>
                                                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                                            {study.commenKo && <p><strong>🇰🇷 한국어:</strong> {study.commenKo}</p>}
                                                            {study.commenJp && <p><strong>🇯🇵 일본어:</strong> {study.commenJp}</p>}
                                                            {study.commenCn && <p><strong>🇨🇳 중국어:</strong> {study.commenCn}</p>}
                                                            {study.commenEn && <p><strong>🇺🇸 영어:</strong> {study.commenEn}</p>}
                                                            {study.commenEs && <p><strong>🇪🇸 스페인어:</strong> {study.commenEs}</p>}
                                                        </div>
                                                    </div>

                                                    {/* 예문 목록 */}
                                                    <h4 style={{ marginBottom: '10px' }}>예문 목록</h4>
                                                    {getExamsByStudy(study.studyNo).length === 0 ? (
                                                        <p style={{ color: '#999', textAlign: 'center', padding: '10px' }}>
                                                            등록된 예문이 없습니다.
                                                        </p>
                                                    ) : (
                                                        getExamsByStudy(study.studyNo).map(exam => (
                                                            <div key={exam.examNo} style={{ marginBottom: '15px', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '4px', backgroundColor: '#fafafa' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                                    <div style={{ flex: 1 }}>
                                                                        <p style={{ marginBottom: '5px' }}><strong>한국어:</strong> {exam.examKo}</p>
                                                                        {exam.examRoman && <p style={{ marginBottom: '5px', fontSize: '14px', color: '#666' }}><strong>발음:</strong> {exam.examRoman}</p>}
                                                                        {exam.examJp && <p style={{ marginBottom: '5px', fontSize: '14px' }}><strong>일본어:</strong> {exam.examJp}</p>}
                                                                        {exam.examCn && <p style={{ marginBottom: '5px', fontSize: '14px' }}><strong>중국어:</strong> {exam.examCn}</p>}
                                                                        {exam.examEn && <p style={{ marginBottom: '5px', fontSize: '14px' }}><strong>영어:</strong> {exam.examEn}</p>}
                                                                        {exam.examEs && <p style={{ marginBottom: '5px', fontSize: '14px' }}><strong>스페인어:</strong> {exam.examEs}</p>}
                                                                    </div>
                                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                                                        <button
                                                                            onClick={() => handleDeleteExam(exam.examNo)}
                                                                            style={{ padding: '4px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                                                                        >
                                                                            예문 삭제
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* 이미지 */}
                                                                {exam.imagePath && (
                                                                    <div style={{ marginBottom: '10px' }}>
                                                                        <img
                                                                            src={exam.imagePath}
                                                                            alt="예문 이미지"
                                                                            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '4px' }}
                                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                                        />
                                                                    </div>
                                                                )}

                                                                {/* 음성 파일 목록 */}
                                                                {getAudiosByExam(exam.examNo).length > 0 && (
                                                                    <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
                                                                        <strong style={{ fontSize: '13px' }}>음성 파일:</strong>
                                                                        {getAudiosByExam(exam.examNo).map(audio => (
                                                                            <div key={audio.audioNo} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px', padding: '5px', backgroundColor: '#f5f5f5', borderRadius: '3px' }}>
                                                                                <span style={{ fontSize: '13px' }}>
                                                                                    {getLangText(audio.lang)} - {audio.audioName}
                                                                                </span>
                                                                                <button
                                                                                    onClick={() => handleDeleteAudio(audio.audioNo)}
                                                                                    style={{ padding: '3px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', fontSize: '11px' }}
                                                                                >
                                                                                    삭제
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {genres.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                        등록된 장르가 없습니다. 새 교육을 등록해주세요.
                    </p>
                )}
            </div>
        </div>

    </>)
}