import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
// 사용자단(모바일)
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import MyInfoUpdate from "./pages/MyInfoUpdate";
import Test from "./pages/Test";
import BeforeStudy from "./pages/BeforeStudy";
import Study from "./pages/Study"
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LoginPage";
import FindPage from "./pages/FindPage";
import Footer from "./components/Footer";
import ExampleList from "./pages/ExampleList";
import Genre from "./pages/Genre";
import SuccessExamList from "./pages/SuccessExamList";
// import Setting from "./pages/Setting";
import Page404 from "./pages/Page404";

// 관리자단(PC)
import AdminStudyList from "./adminPages/AdminStudyList";
import AdminHome from "./adminPages/AdminHome";
import AdminStudyCreate from "./adminPages/AdminStudyCreate";
import AdminStudyEdit from "./adminPages/AdminStudyEdit";
import AdminNav from "./components/AdminNav";


import "./styles/App.css";


// 사용자단 레이아웃
const UserLayout = () => {

  return (<>
    <div className="user-frame">
      <Outlet />
      <Footer />

      {/* ⬇︎ 우측 하단이었던 버튼을 className으로 상단 고정 */}
      <Link to="/admin" className="admin-btn" aria-label="관리자">
        <img src="/img/admin.svg" alt="관리자" />
      </Link>
    </div>
  </>)

}

// 관리자단 레이아웃
const AdminLayout = () => {
  return (<>
    <div style={{
      width: '1280px',
      margin: '0 auto',
    }}>
      <AdminNav /> {/* 관리자 헤드 내비게이션  */}
      <h3> 관리자 화면 레이아웃 </h3>
      <Outlet /> {/* Outlet: 자식 컴포넌트가 들어가는 자리 */}
      <Link to="/"> <img style={{ float: 'right' }} src="/img/myPage.svg" /> </Link>
    </div >
  </>)
}

// 관리자단과 사용자단 구분
function App() {

  return (
    <>
    <div>
      <h3> 루트페이지 </h3>
      <BrowserRouter>
        <Routes>
          {/* 관리자단 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="study" element={<AdminStudyList />} />
            <Route path="study/create" element={<AdminStudyCreate />} />
            <Route path="study/edit/:studyNo" element={<AdminStudyEdit />} />
          </Route>


          {/* 사용자단 */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />} ></Route>
            <Route path="/mypage" element={<MyPage />} ></Route>
            <Route path="/update" element={<MyInfoUpdate />} />
            <Route path="/beforestudy" element={<BeforeStudy />} ></Route>
            <Route path="/test" element={<Test />} ></Route>
            <Route path="/signup" element={<SignUpPage/>} />
            <Route path="/login" element={<LogInPage/>} />
            <Route path="/find" element={<FindPage/>} />
            <Route path="/genre" element={<Genre/>} /> {/* 장르 목록 */}
            <Route path="/study" element={<Study />} />          {/* 주제 목록 */}
            <Route path="/study/:studyNo" element={<Study />} /> {/* 주제 상세 */}
            <Route path="/exampleList/:studyNo" element={<ExampleList />} /> {/* 예문 */}
            <Route path="/successexamlist" element = { <SuccessExamList/>}> </Route>
            <Route path="*" element={<Page404 />} />
            {/* <Route path="/setting" element={<Setting />} />   설정 라우트 */}
          </Route>
        </Routes>
      </BrowserRouter >
      </div>
    </>
  )
}

export default App
