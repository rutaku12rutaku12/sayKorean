import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logIn } from "../store/userSlice";

export default function TestList( props ){

    const navigate = useNavigate();

    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");
    const [testList,setTestList] = useState([]);

    useEffect(() => {
        ( async() => {
            try{
                setLoading( true );
                setError("");
                const res = await axios.get("/saykorean/test");
                const list = Array.isArray( res.data ) ? res.data : [];
                setTestList(list);
            }catch(e){
                console.error(e);
                setError("테스트 목록을 불러오지 못했어요.");
            }finally{
                setLoading(false);
            }
        })();
     }, []);

    // store 저장된 상태 가져오기
    const {isAuthenticated, userInfo } = useSelector((state)=>state.user);
    // dispatch , navigate 함수가져오기
        const dispatch = useDispatch();
    // 최초 1번 렌더링
        useEffect( () => { info(); } , [] )
    // 내 정보 조회 함수
    const info = async () => {
        try{console.log("info.exe")
            const option = { withCredentials : true }
            const response = await axios.get("http://localhost:8080/saykorean/info",option)
            const data = response.data
            console.log(data);
            // 로그인된 데이터 정보를 userInfo에 담기
            dispatch(logIn(data));
        }catch(e){console.log(e)}
    }
    // 비로그인시 error 페이지로 이동
    useEffect(() => {
        if (!isAuthenticated) {
        navigate("/error"); // 로그인 안 되어 있으면 바로 이동
        }
    }, [isAuthenticated, navigate]);

    // 이동 전에 화면 깜빡임 방지
    if (!isAuthenticated) return null;


    return (<>
        <div id="TestList">
            <div className="panel">
                <h3 className="panelTitle">테스트 선택</h3>

                {loading && <div className="toast loading">불러오는 중...</div>}
                {error && <div className="toast error">{error}</div>}


                <ul className="testListWrap">
                    {testList.map((t) => (
                        <li key={t.testNo} className="testList">
                            <div className="test">
                                {t.testTitle ?? `테스트 #${t.testNo}`}
                                <button onClick={() => navigate(`/test/${t.testNo}`)}> 이동 </button>
                            </div>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
     

     
     </>)
}