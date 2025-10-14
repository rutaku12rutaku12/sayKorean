import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
// 사용자단(모바일)
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import Test from "./pages/Test";
import BeforeStudy from "./pages/BeforeStudy";
import Study from "./pages/Study"
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LoginPage";
import Footer from "./components/Footer";
import ExampleList from "./pages/ExampleList";
import Genre from "./pages/Genre";
// 관리자단(PC)
import AdminStudyList from "./adminPages/AdminStudyList";
import AdminHome from "./adminPages/AdminHome";
import AdminStudyCreate from "./adminPages/AdminStudyCreate";
import AdminStudyEdit from "./adminPages/AdminStudyEdit";
import AdminNav from "./components/AdminNav";


// 사용자단 레이아웃
const UserLayout = () => {

  return (<>
    <div style={{
      width: '410px',
      margin: '0 auto',
    }}>
      <h3> 사용자 화면 레이아웃 </h3>
      <Outlet /> {/* Outlet: 자식 컴포넌트가 들어가는 자리 */}
      <Footer /> {/* 공통 Footer  */}
      <Link to="/admin" > <img style={{ float: 'right', width: '49.6px', height: '49.6px' }} src="/img/admin.svg" /> </Link>
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
            <Route path="/beforestudy" element={<BeforeStudy />} ></Route>
            <Route path="/test" element={<Test />} ></Route>
            <Route path="/signup" element={<SignUpPage/>} />
            <Route path="/login" element={<LogInPage/>} />
            <Route path="/genre" element={<Genre/>} /> {/* 장르 목록 */}
            <Route path="/study" element={<Study />} />          {/* 주제 목록 */}
            <Route path="/study/:studyNo" element={<Study />} /> {/* 주제 상세 */}
            <Route path="/exampleList/:studyNo" element={<ExampleList />} /> {/* 예문 */}
          </Route>
        </Routes>
      </BrowserRouter >
    </>
  )
}

export default App
