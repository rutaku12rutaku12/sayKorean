import { useNavigate } from "react-router-dom";
import "../styles/AdminCommon.css";

export default function AdminHome(props) {

    // 페이지 접속할 때 비밀번호 입력하게 해야함
    const navigate = useNavigate();

    return (
        <div className="admin-center">

            <div className="admin-mb-xxl">
                <img src="/img/adminPage.png" />
            </div>

            <div className="admin-flex-center admin-flex-gap-lg admin-mt-xxl">
                <button
                    onClick={() => navigate('/admin/study/create')}
                    className="admin-btn admin-btn-lg admin-btn-education-create"
                >
                    교육 등록하기
                </button>
                <button
                    onClick={() => navigate('/admin/study')}
                    className="admin-btn admin-btn-lg admin-btn-education-list"
                >
                    교육 목록으로 이동
                </button>
            </div>

            <div className="admin-flex-center admin-flex-gap-lg admin-mt-xxl">
                <button
                    onClick={() => navigate('/admin/test/create')}
                    className="admin-btn admin-btn-lg admin-btn-test-create"
                >
                    시험 등록하기
                </button>
                <button
                    onClick={() => navigate('/admin/test')}
                    className="admin-btn admin-btn-lg admin-btn-test-list"
                >
                    시험 목록으로 이동
                </button>
            </div>
        </div>
    )
}