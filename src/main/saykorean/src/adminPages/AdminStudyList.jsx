import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setGenres, setStudies, setExams, setAudios } from "../store/adminSlice";
import { audioApi, examApi, genreApi, studyApi } from "../api/adminApi";
import "../styles/AdminCommon.css";

// 이미지/오디오 경로를 절대 URL로 변환하는 헬퍼 함수
const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
};

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
    const [loading , setLoading] = useState(false);

    // [*] 마운트 시 교육 전체 출력 로직
    useEffect(() => {
        fetchAllData();
    }, []);

    // [*] 로딩 중 출력페이지
    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}> <img src="/img/loading.png" style={{ maxWidth: '400px', borderRadius: '12px' }} /> </div>;
    }

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

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>교육 관리</h2>
                <button
                    onClick={() => navigate('/admin/study/create')}
                    className="admin-btn admin-btn-success"
                >
                    새 교육 등록
                </button>
            </div>

            {/* 장르 목록 */}
            <div className="admin-mb-xl">
                <h3 className="admin-mb-lg">장르 목록</h3>

                {genres.map(genre => (
                    <div key={genre.genreNo} className="admin-card">
                        {/* 장르 헤더 */}
                        <div
                            className={`admin-card-header ${selectedGenreNo === genre.genreNo ? 'active' : ''}`}
                            onClick={() => setSelectedGenreNo(selectedGenreNo === genre.genreNo ? null : genre.genreNo)}
                        >
                            <div>
                                <strong className="admin-card-title">{genre.genreName}</strong>
                                <span className="admin-card-subtitle">
                                    (주제 {getStudiesByGenre(genre.genreNo).length}개)
                                </span>
                            </div>
                            <div className="admin-flex admin-flex-gap-md">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteGenre(genre.genreNo);
                                    }}
                                    className="admin-btn admin-btn-sm admin-btn-danger"
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
                            <div className="admin-card-body">
                                {getStudiesByGenre(genre.genreNo).length === 0 ? (
                                    <p className="admin-empty-message">
                                        이 장르에 등록된 주제가 없습니다.
                                    </p>
                                ) : (
                                    getStudiesByGenre(genre.genreNo).map(study => (
                                        <div key={study.studyNo} className="admin-card admin-mb-md">
                                            {/* 주제 헤더 */}
                                            <div
                                                className={`admin-card-header ${selectedStudyNo === study.studyNo ? 'active' : ''}`}
                                                onClick={() => setSelectedStudyNo(selectedStudyNo === study.studyNo ? null : study.studyNo)}
                                            >
                                                <div>
                                                    <strong>{study.themeKo}</strong>
                                                    <span className="admin-card-subtitle">
                                                        (예문 {getExamsByStudy(study.studyNo).length}개)
                                                    </span>
                                                </div>
                                                <div className="admin-flex admin-flex-gap-sm">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/admin/study/edit/${study.studyNo}`);
                                                        }}
                                                        className="admin-btn admin-btn-sm admin-btn-info"
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteStudy(study.studyNo);
                                                        }}
                                                        className="admin-btn admin-btn-sm admin-btn-danger"
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
                                                <div className="admin-card-body">
                                                    {/* 해설 정보 */}
                                                    <div className="admin-detail-box admin-mb-lg">
                                                        <h4>해설</h4>
                                                        <div>
                                                            {study.commenKo && <p><strong>🇰🇷 한국어:</strong> {study.commenKo}</p>}
                                                            {study.commenJp && <p><strong>🇯🇵 일본어:</strong> {study.commenJp}</p>}
                                                            {study.commenCn && <p><strong>🇨🇳 중국어:</strong> {study.commenCn}</p>}
                                                            {study.commenEn && <p><strong>🇺🇸 영어:</strong> {study.commenEn}</p>}
                                                            {study.commenEs && <p><strong>🇪🇸 스페인어:</strong> {study.commenEs}</p>}
                                                        </div>
                                                    </div>

                                                    {/* 예문 목록 */}
                                                    <h4>예문 목록</h4>
                                                    {getExamsByStudy(study.studyNo).length === 0 ? (
                                                        <p className="admin-empty-message">
                                                            등록된 예문이 없습니다.
                                                        </p>
                                                    ) : (
                                                        getExamsByStudy(study.studyNo).map(exam => (
                                                            <div key={exam.examNo} className="admin-exam-item">
                                                                <div className="admin-flex-between admin-mb-md">
                                                                    <div style={{ flex: 1 }}>
                                                                        <p className="admin-mb-sm"><strong>한국어:</strong> {exam.examKo}</p>
                                                                        {exam.examRoman && <p className="admin-mb-sm admin-text-muted"><strong>발음:</strong> {exam.examRoman}</p>}
                                                                        {exam.examJp && <p className="admin-mb-sm"><strong>일본어:</strong> {exam.examJp}</p>}
                                                                        {exam.examCn && <p className="admin-mb-sm"><strong>중국어:</strong> {exam.examCn}</p>}
                                                                        {exam.examEn && <p className="admin-mb-sm"><strong>영어:</strong> {exam.examEn}</p>}
                                                                        {exam.examEs && <p className="admin-mb-sm"><strong>스페인어:</strong> {exam.examEs}</p>}
                                                                    </div>
                                                                    <div>
                                                                        <button
                                                                            onClick={() => handleDeleteExam(exam.examNo)}
                                                                            className="admin-btn admin-btn-sm admin-btn-danger"
                                                                        >
                                                                            예문 삭제
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* 이미지 */}
                                                                {exam.imagePath && (
                                                                    <div className="admin-mb-md">
                                                                        <p className="admin-text-muted" style={{ fontSize: '11px', marginBottom: '5px' }}>
                                                                            DB 경로: {exam.imagePath}
                                                                        </p>
                                                                        <img
                                                                            src={getFullUrl(exam.imagePath)}
                                                                            alt="예문 이미지"
                                                                            className="admin-image-preview"
                                                                            onLoad={() => console.log('✅ 이미지 로드 성공:', exam.imagePath)}
                                                                            onError={(e) => { 
                                                                                console.error("❌ 이미지 로드 실패:", exam.imagePath);
                                                                                console.error("시도한 URL:", e.target.src);
                                                                                e.target.style.display = 'none'; 
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}

                                                                {/* 음성 파일 목록 */}
                                                                {getAudiosByExam(exam.examNo).length > 0 && (
                                                                    <div className="admin-audio-section">
                                                                        <strong className="admin-mb-sm" style={{ display: 'block' }}>음성 파일:</strong>
                                                                        {getAudiosByExam(exam.examNo).map(audio => (
                                                                            <div key={audio.audioNo} className="admin-flex-between admin-mb-sm" style={{ padding: '5px', backgroundColor: '#f5f5f5', borderRadius: '3px' }}>
                                                                                <div style={{ flex: 1 }}>
                                                                                    <span style={{ fontSize: '13px' }}>
                                                                                        {getLangText(audio.lang)} - {audio.audioName}
                                                                                    </span>
                                                                                    {audio.audioPath && (
                                                                                        <audio 
                                                                                            controls 
                                                                                            style={{ display: 'block', marginTop: '5px', maxWidth: '300px' }}
                                                                                            onError={(e) => console.error('❌ 오디오 로드 실패:', audio.audioPath)}
                                                                                        >
                                                                                            <source src={getFullUrl(audio.audioPath)} type="audio/mpeg" />
                                                                                        </audio>
                                                                                    )}
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => handleDeleteAudio(audio.audioNo)}
                                                                                    className="admin-btn admin-btn-sm admin-btn-danger"
                                                                                    style={{ padding: '3px 10px', fontSize: '11px' }}
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
                    <p className="admin-empty-message">
                        등록된 장르가 없습니다. 새 교육을 등록해주세요.
                    </p>
                )}
            </div>
        </div>
    )
}