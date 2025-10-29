import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import "../styles/StartPage.css";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { t } = useTranslation();

  const onLogout = async () => {
    try {
      const res = await axios.get("/saykorean/logout", { withCredentials: true });
      dispatch(logOut());
    } catch {}
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  return (
    <div id="StartPage">
      <div className="startWaveBg" />
      <div className="startWaveWrapper">
        <div className="startWave startWaveTop" />
        <div className="startWave startWaveBottom" />
      </div>

      <img className="startCharacters" src="/img/startCharacters.svg" alt="characters" />

      <img className="startLogoImg" src="/img/logo.png" alt="logo" />

      <div className="startBtnBox">
        <button onClick={() => navigate("/mypage")}>
          {t("home.start") ?? "시작하기"}
        </button>
      </div>
    </div>
  );
}
