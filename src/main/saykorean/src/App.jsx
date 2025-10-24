
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import i18n from "./i18n.js";
import axios from "axios";
import { useEffect } from "react";
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
import ExampleList from "./pages/ExampleList";
import Genre from "./pages/Genre";
import SuccessExamList from "./pages/SuccessExamList";
import TestList from "./pages/TestList";
import Language from "./pages/Language";
import TestResult from "./pages/TestResult";
// import Setting from "./pages/Setting";

// 로딩페이지 
import LoadingPage from "./pages/LoadingPage";
// 404페이지
import Page404 from "./pages/Page404";


// 관리자단(PC)
import AdminStudyList from "./adminPages/AdminStudyList";
import AdminHome from "./adminPages/AdminHome";
import AdminStudyCreate from "./adminPages/AdminStudyCreate";
import AdminStudyEdit from "./adminPages/AdminStudyEdit";
import AdminNav from "./components/AdminNav";


import "./styles/App.css";
import AdminTestList from "./adminPages/AdminTestList";
import AdminTestCreate from "./adminPages/AdminTestCreate";
import AdminTestEdit from "./adminPages/AdminTestEdit";

// 언어 변환 - 정유진

const LANG_MAP = {
  1: "ko",
  2: "ja",
  3: "zh",
  4: "en",
  5: "es"
};

axios.defaults.baseURL = "http://localhost:8080";

// 여기서 useEffect 제거 (컴포넌트 밖에서는 사용 불가)

// 사용자단 레이아웃
const UserLayout = () => (
  <div id="user-frame">
    <Outlet />
    <Footer className="footer" />
    <Link to="/admin" className="admin-btn" aria-label="관리자">
      <img src="/img/설정.svg" alt="관리자" />
    </Link>
  </div>
);

// 관리자단 레이아웃
const AdminLayout = () => (
  <div style={{ width: '1280px', margin: '0 auto' }}>
    <AdminNav />
    <h3> 관리자 화면 레이아웃 </h3>
    <Outlet />
    <Link to="/home">
      <img style={{ float: 'right' }} src="/img/myPage.svg" alt="홈" />
    </Link>
  </div>
);

// App 함수 내부에 useEffect 옮기기
function App() {
  useEffect(() => {
    const langNo = Number(localStorage.getItem("selectedLangNo"));
    const lang = LANG_MAP[langNo] || "ko";
    i18n.changeLanguage(lang);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 관리자단 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="study" element={<AdminStudyList />} />
          <Route path="study/create" element={<AdminStudyCreate />} />
          <Route path="study/edit/:studyNo" element={<AdminStudyEdit />} />
          <Route path="test" element={<AdminTestList />} />
          <Route path="test/create" element={<AdminTestCreate />} />
          <Route path="test/edit/:testNo" element={<AdminTestEdit />} />
        </Route>

        {/* 로딩페이지 */}
        <Route path="/" element={<LoadingPage />} />
        {/* 404페이지 */}
        <Route path="*" element={<Page404 />} />

        {/* 사용자단 */}
        <Route element={<UserLayout />}>
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
          <Route path="/exampleList/:studyNo" element={<ExampleList />} />
          <Route path="/successexamlist" element={<SuccessExamList />} />
          <Route path="/testlist" element={<TestList />} />
          <Route path="/test/:testNo" element={<Test />} />
          <Route path="/language" element={<Language />} />
          <Route path="/testresult/:testNo" element={<TestResult />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;