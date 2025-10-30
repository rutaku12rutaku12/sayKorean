import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logIn } from "../store/userSlice";
axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;
import { useTranslation } from "react-i18next";
import "../styles/TestList.css";

export default function TestList( props ){

    const navigate = useNavigate();
    const { t } = useTranslation();

    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");
    const [testList,setTestList] = useState([]);
    const [langNo, setLangNo] = useState(0);

    // 언어 설정 가져오기 (selectedLangNo 사용)
  function getLang() {
    const stored = localStorage.getItem("selectedLangNo");
    console.log( stored );
    const n = Number(stored);
    if (!Number.isFinite(n)) {
      setLangNo(0); // ko
      return;
    }
    setLangNo(n);
  }

  useEffect(() => {
    getLang();
  }, []);

    useEffect(() => {
  if (langNo == 0) return; // 0이면 실행 안 함

  (async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/saykorean/test", {
        params: { langNo }
      });
      const list = Array.isArray(res.data) ? res.data : [];
      console.log(list);
      setTestList(list);
    } catch (e) {
      console.error(e);
      setError("테스트 목록을 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  })();
}, [langNo]); // langNo가 바뀔 때마다 재요청

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
        navigate("/login"); // 로그인 안 되어 있으면 바로 이동
        }
    }, [isAuthenticated, navigate]);

    // 이동 전에 화면 깜빡임 방지
    if (!isAuthenticated) return null;


    return (
    <>
      <div id="TestList" className="homePage">
        <div className="panel">
          <h3 className="panelTitle">{t("testList.title")}</h3>

          {loading && <div className="toast loading">{t("common.loading")}</div>}
          {error && <div className="toast error">{error}</div>}

          <ul className="testListWrap">
            {testList.map((tItem) => (
              <li key={tItem.testNo} className="testList">
                   <button className="test" onClick={() => navigate(`/test/${tItem.testNo}`)}>
                  {tItem.testTitleSelected ?? t("testList.fallbackTitle", { num: tItem.testNo })}
                  </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}