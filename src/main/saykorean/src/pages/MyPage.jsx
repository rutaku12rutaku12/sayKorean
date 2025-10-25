import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { useEffect, useState } from "react"
import { logIn } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
import "../styles/MyPage.css"
import { getAttend } from "../store/attendSlice";
axios.defaults.withCredentials = true;
import { useTranslation } from "react-i18next";
import Ranking from "./Ranking";

export default function MyPage(props) {
  console.log("MyPage.jsx open")


  // store 저장된 상태 가져오기 
  const { isAuthenticated, userInfo } = useSelector((state) => state.user);
  const { attendInfo } = useSelector((state) => state.attend);
  const [genreName, setGenreName] = useState("");
  const [langName, setLangName] = useState("")
  const { t } = useTranslation();

  // dispatch , navigate 함수가져오기 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 수정페이지로 이동 함수 MyInfoUpdate.jsx
  const onUpdate = async () => {
    navigate("/update");
  };

  // 최초 1번 렌더링
  useEffect(() => { info(); onAttend(); getGenre(); getLang(); }, [])
  // 내 정보 조회 함수
  const info = async () => {
    try {
      console.log("info.exe")
      const option = { withCredentials: true }
      const response = await axios.get("http://localhost:8080/saykorean/info", option)
      const data = response.data
      console.log(data);
      // 로그인된 데이터 정보를 userInfo에 담기
      dispatch(logIn(data));
    } catch (e) { console.log(e) }
  }

  // 출석 조회 함수 
  const onAttend = async () => {
    try {
      console.log("getAttend.exe");
      const option = { withCredentials: true }
      const response = await axios.get("http://localhost:8080/saykorean/attend", option)
      const data = response.data
      console.log(data);
      // 로그인된 데이터 정보를 attendInfo에 담기
      dispatch(getAttend(data));
    } catch (e) { console.log(e) }
  }


  //--------------정유진-------------//
  const onGenre = async () => {
    navigate("/genre");
  };

  const onLanguage = async () => {
    navigate("/language");
  }

  const onRanking = async () => {
    navigate("/rank")
  }

  const getGenre = async () => {
    try {
      const genreNo = Number(localStorage.getItem("selectedGenreNo"));
      if (!genreNo) return;

      // 장르 목록 조회 API (controller: saykorean/study/getGenre)
      const res = await axios.get("http://localhost:8080/saykorean/study/getGenre");
      const list = res.data;

      // genreNo 일치하는 항목 찾기
      const selected = list.find((g) => g.genreNo == genreNo);
      if (selected) {
        setGenreName(selected.genreName);
      } else {
        setGenreName("미설정");
      }
    } catch (e) {
      console.error("장르 조회 오류:", e);
    }

  }

  const getLang = async () => {
    try {
      const langNo = Number(localStorage.getItem("selectedLangNo"));
      if (!langNo) return;

      const res = await axios.get("http://localhost:8080/saykorean/study/getlang");
      const list = res.data;

      const selected = list.find((l) => l.langNo == langNo);
      if (selected) {
        setLangName(selected.langName);
      } else {
        setLangName("미설정");
      }

    } catch (e) {
      console.error("언어 조회 오류 :" + e);
    }
  }

  // 최대 연속 출석일 계산 함수
  const getMaxStreak = (attendList) => {
    if (!attendList || attendList.length === 0) return 0;

    // attendDay 기준으로 날짜만 추출해서 Date 객체로 변환 후 정렬
    const dates = attendList
      .map(item => new Date(item.attendDay))
      .sort((a, b) => a - b);

    let maxStreak = 1;      // 최대 연속일
    let currentStreak = 1;  // 현재 연속일

    for (let i = 1; i < dates.length; i++) {
      // 하루(24시간) 차이 계산
      const diffDays = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        // 하루 차이 → 연속 출석
        currentStreak += 1;
      } else {
        // 연속 끊김 → 초기화
        currentStreak = 1;
      }

      // 최대값 갱신
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    }

    return maxStreak;
  };

  // 비로그인시 error 페이지로 이동
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // 로그인 안 되어 있으면 바로 이동
    }
  }, [isAuthenticated, navigate]);

  // 이동 전에 화면 깜빡임 방지
  if (!isAuthenticated) return null;

  return (<>

    <div id="MyPage">
      <section className="panel">
        <h3 className="panelTitle">{t("마이페이지")}</h3>

        <ul className="infoList">
          <li className="infoRow">
            <span className="infoKey">{t("닉네임")}</span>
            <span className="infoValue">{userInfo?.nickName}</span>
          </li>
          <li className="infoRow">
            <span className="infoKey">{t("가입일자")}</span>
            <span className="infoValue">{userInfo?.userDate}</span>
          </li>
          <li className="infoRow">
            <span className="infoKey">{t("총 출석일수")}</span>
            <span className="infoValue">{attendInfo ? attendInfo.length : 0}{t("일")}</span>
          </li>
          <li className="infoRow">
            <span className="infoKey">{t("현재 연속 출석일수")}</span>
            <span className="infoValue">
              {attendInfo ? getMaxStreak(attendInfo) : 0}일
            </span>
          </li>
          <li className="infoRow">
            <span className="infoKey">{t("내가 선택한 장르")}</span>
            <span className="infoValue">{genreName || "미설정"}</span>
          </li>
          <li className="infoRow">
            <span className="infoKey">{t("내가 선택한 언어")}</span>
            <span className="infoValue">{langName || "미설정"}</span>
          </li>
        </ul>

        <div className="btnGroup">
          <button className="pillBtn" onClick={onUpdate}>{t("회원정보 수정")}</button>
          <button className="pillBtn" onClick={onGenre}>{t("장르 설정")}</button>
          <button className="pillBtn" onClick={onLanguage}>{t("언어 설정")}</button>
        </div>
      </section>
    </div>

  </>)




}