import { useNavigate } from "react-router-dom";
import "../styles/AdminCommon.css";

export default function AdminHome(props) {
    const navigate = useNavigate();

    return (
        <div className="admin-center">
            <h3>관리자 홈 페이지</h3>

            <div className="admin-mb-xxl">
                <p>여기에 토돌이 호순이 그림 넣기</p>
            </div>

            <div className="admin-flex-center admin-flex-gap-lg admin-mt-xxl">
                <button 
                    onClick={() => navigate('/admin/study/create')} 
                    className="admin-btn admin-btn-lg"
                    style={{ backgroundColor: '#A8E6CF', color: 'white' }}
                >
                    교육 등록하기
                </button>
                <button
                    onClick={() => navigate('/admin/study')}
                    className="admin-btn admin-btn-lg"
                    style={{ backgroundColor: '#FFAAA5', color: 'white' }}
                >
                    교육 목록으로 이동
                </button>
            </div>

            <div className="admin-flex-center admin-flex-gap-lg admin-mt-xxl">
                <button 
                    onClick={() => navigate('/admin/test/create')} 
                    className="admin-btn admin-btn-lg"
                    style={{ backgroundColor: '#FF8C6B', color: 'white' }}
                >
                    시험 등록하기
                </button>
                <button
                    onClick={() => navigate('/admin/test')}
                    className="admin-btn admin-btn-lg"
                    style={{ backgroundColor: '#6B4E42', color: 'white' }}
                >
                    시험 목록으로 이동
                </button>
            </div>
        </div>
    )
}