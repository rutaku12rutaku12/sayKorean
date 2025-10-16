// 공부화면 들어가기 전 : 문장을 배우세요(시작) 화면
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import "../styles/BeforeStudy.css";

axios.defaults.baseURL = "http://localhost:8080";

export default function BeforeStudy() {
  const navigate = useNavigate();

  // 근데 왜 초기에 한 번 실행되어야 하는데 한꺼번에 두 번 실행되는걸까?
  // React 18 개발모드 + StrictMode 때문
  // React.StrictMode가 useEffect를 “의도적으로” 한 번 더 실행(마운트→언마운트→다시 마운트)해서 네 로그인 요청이 2번 보내짐
  // 빌드(프로덕션)에서는 1번만 실행
//   useEffect(() => {
//   (async () => {
//     try{
//       // 실제 로그인 (DB에 있는 계정 사용) --- 테스트용!
//       await axios.post("/saykorean/login", {
//         email: "user01@example.com",
//         password: "pass#01!",
//       });

//       console.log("login ok");
//     }catch (e){
//       console.error("login failed", e );
//     }
//   })();
// }, []);

  const startStudy = async() => {
    // 목록 화면으로 이동 (주제 미선택 상태)
    navigate("/study");
  };

  return (
    <div id="startGenre">
      <img className="startGenreImg" src="/img/BeforeStudy.png" />
      <div className="startBox">
        <h3>한국어를 배워보아요</h3>
        <button className="startStudy" onClick={startStudy}> 학습 시작 </button>
      </div>
    </div>
  );
}