import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


function asArray( payload ){
    if( typeof payload === "string" ){
        try{
            payload = JSON.parse( payload );
        }catch{

        }
    }


    if (Array.isArray(payload)) return payload;

    if (payload && typeof payload === "object") {
        // 객체라면 자주 쓰는 키(data/list/items/content/result) 중 배열을 찾아 반환
        for (const k of ["data", "list", "items", "content", "result"]) {
            if (Array.isArray(payload[k])) return payload[k];
        }
    }
    // 위 조건에 모두 해당 안 되면 빈 배열 리턴
    return [];
} // func end


export default function Test (props){
    
  // store 저장된 상태 가져오기
  const {isAuthenticated, userInfo } = useSelector((state)=>state.user);
  // dispatch , navigate 함수가져오기
    const dispatch = useDispatch();
    const navigate = useNavigate();
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


      const { testNo } = useParams();

    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");
    const [test,setTest] = useState([]);

    async function findTestItem( testNoValue ){
        const res = await axios.get(
            "/saykorean/test/findtestitem",
            { params : { testNo : testNoValue } }
        );
        return asArray(res.data);
    }

    useEffect( () => {
        if( !testNo ){ // URL에 testNo가 없으면
            setTest(null);
            return; // 상세 초기화
        }

        // URL 파라미터를 숫자로 변환
        const n = Number( testNo );
        if( !Number.isFinite(n) ){
            setError("잘못된 테스트 번호입니다.");
            return;
        }

        (async() => { // 비동기 즉시실행으로 상세 요청
            try{
                setLoading(true);
                setError("");
                const t = await findTestItem(n); // 테스트 상세 가져오기
                setTest(t);
            }catch( e ){
                console.error(e);
                setError("데이터를 불러오는 중 문제가 발생했어요."); // 사용자 메시지
            }finally{
                setLoading(false); // 로딩 종료
            }
        })();
        // URL의 testNo가 바뀔 때마다 다시 실행
    } , [testNo]);


    return (<>
    <div id="Test">
      {loading && <div className="toast loading">불러오는 중…</div>} {/* 로딩 표시 */}
      {error && <div className="toast error">{error}</div>} {/* 에러 표시 */}
    </div>

        <ul className="testWrap">
            {Array.isArray(test) && test.map((t) => (
                <li key={t.testItemNo} className="test">
                    <div className="test1">
                        <div>{`${t.testItemNo}번문제`}</div>
                        <div>{t.question}</div>
                    </div>
                </li>
            ))}
        </ul>


    </>)
}