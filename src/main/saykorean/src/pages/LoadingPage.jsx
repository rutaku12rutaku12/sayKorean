  import axios from "axios";
import { logOut } from "../store/userSlice";
import "../styles/LoadingPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
  export default function LoadingPage( props ){

    // 슬라이스 객체 배열 
    const slides = [
    { img :"/img/loading_img/1_loading_img.png" ,
      title : "“숭례문”",
      description : "숭례문은 조선의 수도였던 서울(한양)의 사대문 중 하나로, 흔히 남대문이라고도 불립니다."
    }, 
    { img :"/img/loading_img/2_loading_img.png" ,
      title : "“북촌”",
      description : "북촌은 서울 북쪽에 위치한 한옥마을이며, 조선왕조 때 왕족, 양반, 관료 등이 살았던 고급가옥이 많아 양반촌이라고도 불렸습니다."
    }, 
    { img :"/img/loading_img/3_loading_img.png" ,
      title : "“중앙박물관”",
      description : "국립중앙박물관은 역사와 문화가 살아 숨쉬고, 과거와 현재, 미래가 공존하는 감동의 공간입니다."
    }
    ];

    // 랜덤 슬라이스 함수 : (0~1 사이 실수 * 배열의 길이)에서 소수점 버림 한 인덱스 값에 접근  
        // Math.random : 0 이상 1미만의 랜덤 실수 생성 ex) 0.1 , 0.2, 0.7
        // Math.floor : 소수점 버림 함수 ex) 0.1 -> 0 , 0.2 -> 0 , 5.9 -> 5
    const randomSlide = slides[Math.floor(Math.random() * slides.length) ];

    // 로딩문구 객체 배열
    const loadingPhrases = [
      {text:"토돌이 당근 수집하는 중..."},
      {text:"호순이 그루밍하는 중..."},
      {text:"토돌이 귀를 쫑긋하는 중..."},
      {text:"호순이 개박하 찾는 중..."},
      {text:"토돌이 수업 준비하는 중..."},
      {text:"호순이 쇼핑하는 중..."},
      {text:"토돌이 시험 출제 중..."},
      {text:"호순이 게임 연습하는 중..."}
    ];

    // 랜덤 텍스트 함수 : (0~1 사이 실수 * 배열의 길이)에서 소수점 버림 한 인덱스 값에 접근  
        // Math.random : 0 이상 1미만의 랜덤 실수 생성 ex) 0.1 , 0.2, 0.7
        // Math.floor : 소수점 버림 함수 ex) 0.1 -> 0 , 0.2 -> 0 , 5.9 -> 5
    const randomPhrase = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length) ];


    // navigate, dispatch 함수 가져오기
    const navigate =useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state)=>state.user.isAuthenticated);
    
    // 1. 로그아웃 처리 함수 정의 
    const onLogout = async()=>{
        try{
            // CORS 옵션 허용
            const option = { withCredentials : true }
            const response = await axios.get("http://localhost:8080/saykorean/logout",option)
            const data = response.data;
            console.log("로그아웃 성공",data)
            dispatch(logOut());
        }catch(e){console.log("로그아웃 실패 : ", e)}
    }
      return (
      <div id="loading-frame">
        <div className="image-container">
          <div className="title"> {randomSlide.title} </div>
          <div
            style={{
              width: "410px",
              height: "80vh", 
              backgroundImage: `url(${randomSlide.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position:"relative"
            }}
          >
          </div>
          <div className="text-on-image">
            <div>{randomSlide.description}</div>
          </div>
        </div>
        <div className="image-buttons">
            {isAuthenticated ? (
                <button onClick={onLogout}>로그아웃</button>
            ) : (
                <>
                    <button onClick={() => navigate("/signup")}>회원가입</button>
                    <button onClick={() => navigate("/login")}>로그인</button>
                </>
            )}
        </div>
        <div id="loading-footer">
          <div>{randomPhrase.text}</div>
        </div>
      </div>
    );


      
  }


