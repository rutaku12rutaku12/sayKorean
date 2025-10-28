import axios from "axios";
import { logOut } from "../store/userSlice";
import "../styles/LoadingPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function LoadingPage(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation(); // 추가

  const slides = [
    { img: "/img/loading_img/1_loading_img.png", title: "“숭례문”", description: "숭례문은 조선의 수도였던 서울(한양)의 사대문 중 하나로, 흔히 남대문이라고도 불립니다." },
    { img: "/img/loading_img/2_loading_img.png", title: "“북촌”", description: "북촌은 서울 북쪽에 위치한 한옥마을이며, 조선왕조 때 왕족, 양반, 관료 등이 살았던 고급가옥이 많아 양반촌이라고도 불렸습니다."},
    { img: "/img/loading_img/3_loading_img.png", title: "“중앙박물관”", description: "국립중앙박물관은 역사와 문화가 살아 숨쉬고, 과거와 현재, 미래가 공존하는 감동의 공간입니다."},
    { img: "/img/loading_img/4_loading_img.png", title: "“무령왕릉”", description: "공주에 위치한 무령왕릉은 백제의 무령왕과 그 왕비가 묻힌 고분입니다. 아치형 구조가 눈에 띄는 벽돌무덤입니다."},
    { img: "/img/loading_img/5_loading_img.png", title: "“프로방스”", description: "경기도 파주 프로방스 마을은 남프랑스 콘셉트의 테마 휴양지입니다."},
    { img: "/img/loading_img/6_loading_img.png", title: "“광한루”", description: "전북 남원의 광한루원에는 견우와 직녀의 슬픈 이야기가 깃든 오작교가 있습니다."},
    { img: "/img/loading_img/7_loading_img.png", title: "“한라산”", description: "남한의 최고봉인 제주도 중앙에 있는 한라산 정상에는 화산호수 백록담이 있습니다. 금강산, 지리산과 함께 삼신산이라 불렸습니다." }
  ];

  const randomSlide = slides[Math.floor(Math.random() * slides.length)];

  const loadingPhrases = [
    { text: "토돌이 시험 채점하는 중..." }
  ];
  const randomPhrase = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];

  // 제출 작업이 전달되면 여기서 실행
  useEffect(() => {
    if (!state?.action) return; // 로딩만 보여줄 때는 그대로

    (async () => {
      try {
        const { url, body } = state.payload;
        const res = await axios.post(url, body);


        // 채점이 끝나면 결과 화면으로 넘어가도록 설정
        const { score, total } = res.data;

        navigate(`/testresult/${state.payload.testNo}`, {
          replace: true,
          state: {
            result: res.data
          }
        });
      } catch (e) {
        console.error(e);
        alert("채점 중 오류가 발생했습니다.");
        navigate(state.backTo || "/home", { replace: true });
      }
    })();
  }, [state, navigate]);

  return (
    <div id="loading-frame" className="homePage">
      <div className="image-container">
        <div className="title">{randomSlide.title}</div>
        <div
          style={{
            width: "410px",
            height: "80vh",
            backgroundImage: `url(${randomSlide.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative"
          }}
        />
        <div className="text-on-image">
          <div>{randomSlide.description}</div>
        </div>
      </div>
      <div id="loading-footer">
        <div>{randomPhrase.text}</div>
      </div>
    </div>
  );
}