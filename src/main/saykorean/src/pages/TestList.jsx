import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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