import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
// 사용자단(모바일)
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import Test from "./pages/Test";
import BeforeStudy from "./pages/BeforeStudy";
import Study from "./pages/Study"
import Footer from "./components/Footer";
// 관리자단(PC)
import AdminLayout from "./adminPages/AdminLayout";
import AdminStudyList from "./adminPages/AdminStudyList";
import AdminHome from "./adminPages/AdminHome";
import AdminStudyCreate from "./adminPages/AdminStudyCreate";
import AdminStudyEdit from "./adminPages/AdminStudyEdit";
import AdminNav from "./components/AdminNav";

// 사용자단 레이아웃
const UserLayout = () => {

  return (<>
    <div style={{
      width: '410px', margin: '0 auto',
    }}>
      <Outlet />
      <Footer />
    </div>
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
          <Route path="/admin/*" element={
            <AdminLayout>
              <AdminNav />
              <Routes>
                <Route index element={<AdminHome />} />
                <Route path="study" element={<AdminStudyList />} />
                <Route path="study/create" element={<AdminStudyCreate />} />
                <Route path="study/edit/:studyNo" element={<AdminStudyEdit />} />
              </Routes>
            </AdminLayout>
          }
          />

          {/* 사용자단 */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />} ></Route>
            <Route path="/mypage" element={<MyPage />} ></Route>
            <Route path="/beforestudy" element={<BeforeStudy />} ></Route>
            <Route path="/test" element={<Test />} ></Route>
            <Route path="/study/:themeNo" element={<Study />} />
          </Route>
        </Routes>
      </BrowserRouter >
    </>
  )
}

export default App
