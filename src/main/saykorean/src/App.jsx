import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import i18n from "./i18n.js";
import axios from "axios";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";


// 시작페이지
import StartPage from "./pages/StartPage.jsx";
// 사용자단(모바일)
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import MyInfoUpdate from "./pages/MyInfoUpdate";
import Test from "./pages/Test";
import BeforeStudy from "./pages/BeforeStudy";
import Study from "./pages/Study"
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import FindPage from "./pages/FindPage";
import Footer from "./components/Footer";
import Genre from "./pages/Genre";
import SuccessExamList from "./pages/SuccessExamList";
import TestList from "./pages/TestList";
import Language from "./pages/Language";
import TestResult from "./pages/TestResult";
import LoadingPage from "./pages/LoadingPage";
import Page404 from "./pages/Page404";

// 관리자단
import AdminStudyList from "./adminPages/AdminStudyList";
import AdminHome from "./adminPages/AdminHome";
import AdminStudyCreate from "./adminPages/AdminStudyCreate";
import AdminStudyEdit from "./adminPages/AdminStudyEdit";
import AdminNav from "./components/AdminNav";
import AdminTestList from "./adminPages/AdminTestList";
import AdminTestCreate from "./adminPages/AdminTestCreate";
import AdminTestEdit from "./adminPages/AdminTestEdit";
import AdminUserList from "./adminPages/AdminUserList.jsx";
import AdminUserIndi from "./adminPages/AdminUserIndi.jsx";
import CharacterTraining from "./adminPages/CharacterTraining.jsx";
import ExampleList from "./pages/ExampleList.jsx";

// 랭킹
import Ranking from "./pages/Ranking.jsx";

// CSS
import "./styles/App.css";


// 언어 변환 매핑
const LANG_MAP = {
  1: "ko",
  2: "ja",
  3: "zh-CN",
  4: "en",
  5: "es"
};

axios.defaults.baseURL = "http://localhost:8080";


// 사용자 레이아웃
const UserLayout = () => (
  <div id="user-frame">
    <Outlet />
    <Footer className="footer" />
    <Link to="/rank" className="admin-btn" aria-label="관리자"></Link>
  </div>
);

// 관리자 레이아웃
const AdminLayout = () => (
  <div style={{ width: '1280px', margin: '0 auto' }}>
    <AdminNav />
    <Outlet />
  </div>
);


function App() {
  // 초기 언어 설정
  useEffect(() => {
    const langNo = Number(localStorage.getItem("selectedLangNo"));
    const lang = LANG_MAP[langNo] || "ko";
    i18n.changeLanguage(lang);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Routes>
          {/* 시작 페이지 */}
          <Route path="/" element={<StartPage/>}>
            
          </Route>
          {/* 관리자단 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="study" element={<AdminStudyList />} />
            <Route path="study/create" element={<AdminStudyCreate />} />
            <Route path="study/edit/:studyNo" element={<AdminStudyEdit />} />
            <Route path="test" element={<AdminTestList />} />
            <Route path="test/create" element={<AdminTestCreate />} />
            <Route path="test/edit/:testNo" element={<AdminTestEdit />} />
            <Route path="user" element={<AdminUserList />} />
            <Route path="user/:userNo" element={<AdminUserIndi />} />
            <Route path="character-training" element={<CharacterTraining />} />

          </Route>

          {/* 사용자단 */}
          <Route className="scroll" element={<UserLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/update" element={<MyInfoUpdate />} />
            <Route path="/beforestudy" element={<BeforeStudy />} />
            <Route path="/test" element={<Test />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/find" element={<FindPage />} />
            <Route path="/genre" element={<Genre />} />
            <Route path="/study" element={<Study />} />
            <Route path="/study/:studyNo" element={<Study />} />
            <Route path="/successexamlist" element={<SuccessExamList />} />
            <Route path="/testlist" element={<TestList />} />
            <Route path="/test/:testNo" element={<Test />} />
            <Route path="/language" element={<Language />} />
            <Route path="/testresult/:testNo" element={<TestResult />} />
            <Route path="/rank" element={<Ranking />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/examplelist" element={<ExampleList/>}></Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<Page404 />} />

        </Routes>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
