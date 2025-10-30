import axios from "axios";
import { logOut } from "../store/userSlice";
import "../styles/LoadingPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function LoadingPage(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation(); // 추가
  // [*] UI 번역
  const { t } = useTranslation();

  const slides = [
    { img: "/img/loading_img/1_loading_img.png", title: `${t("loading.sungrye")}`, description: `${t("loading.sungryeInfo")}` },
    { img: "/img/loading_img/2_loading_img.png", title: `${t("loading.bookchon")}`, description: `${t("loading.bookchonInfo")}` },
    { img: "/img/loading_img/3_loading_img.png", title: `${t("loading.guckjungback")}`, description: `${t("loading.guckjungbackInfo")}` },
    { img: "/img/loading_img/4_loading_img.png", title: `${t("loading.muryung")}`, description: `${t("loading.muryungInfo")}` },
    { img: "/img/loading_img/6_loading_img.png", title: `${t("loading.gwanghan")}`, description: `${t("loading.gwanghanInfo")}` },
    { img: "/img/loading_img/7_loading_img.png", title: `${t("loading.hanra")}`, description: `${t("loading.hanraInfo")}` }
  ];

  const randomSlide = slides[Math.floor(Math.random() * slides.length)];

  const loadingPhrases = [
    { text: `${t("loading.grading")}` }
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
        alert(t("loadingpage.gradeError"));
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
            height: "75vh",
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