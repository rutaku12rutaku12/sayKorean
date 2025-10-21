import { useNavigate } from "react-router-dom"

export default function AdminHome(props) {

    // 자연스러운 페이지 이동을 위한 내비게이트 사용
    const navigate = useNavigate();

    return (<>
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h3> 관리자 홈 페이지 </h3>

            <div style={{ margin: '40px 0' }}>
                <p>여기에 토돌이 호순이 그림 넣기</p>
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '60px' }}>
                <button onClick={() => navigate('/admin/study/create')} style={{
                    padding: '20px 40px',
                    fontSize: '18px',
                    backgroundColor: ' #A8E6CF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}>
                    교육 등록하기
                </button>
                <button
                    onClick={() => navigate('/admin/study')}
                    style={{
                        padding: '20px 40px',
                        fontSize: '18px',
                        backgroundColor: '#FFAAA5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}>
                    교육 목록으로 이동
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '60px' }}>
                <button onClick={() => navigate('/admin/test/create')} style={{
                    padding: '20px 40px',
                    fontSize: '18px',
                    backgroundColor: '#FF8C6B',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}>
                    시험 등록하기
                </button>
                <button
                    onClick={() => navigate('/admin/test')}
                    style={{
                        padding: '20px 40px',
                        fontSize: '18px',
                        backgroundColor: '#6B4E42',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}>
                    시험 목록으로 이동
                </button>
            </div>

        </div>

    </>)
}