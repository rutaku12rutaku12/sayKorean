// 공부화면 들어가기 전 : 문장을 배우세요(시작) 화면

import { useNavigate } from "react-router-dom";
import './BeforeStudy.css';


export default function( props ){

    const navigate = useNavigate();

  const StartStudy = async() => {
    navigate("/study"); // ← 라우트 경로
  };

  return (<>


      <div id="BeforeStudy">
          <img className="beforeStudyImg" src="/img/BeforeStudy.png" />
          <div className="startBox">
              <h3>한국어를 배워보아요</h3>
              <button className="StartStudy" onClick={ StartStudy }>시작</button>
          </div>

      </div>


    </>);


}