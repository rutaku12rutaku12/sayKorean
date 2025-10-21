import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
    
  return(<>
  dfadsf
  </>)
}