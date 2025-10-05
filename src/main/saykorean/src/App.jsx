import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import Test from "./pages/Test";
import BeforeStudy from "./pages/BeforeStudy";
import Study from "./pages/Study"
import Footer from "./components/Footer";
import Admin from "./pages/Admin";


function App() {

  return (
    <>
      <h3> 루트 페이지 </h3>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} ></Route>
            <Route path="/mypage" element={<MyPage />} ></Route>
            <Route path="/beforestudy" element={<BeforeStudy />} ></Route>
            <Route path="/test" element={<Test />} ></Route>
            <Route path="/study/:themeNo" element={<Study />} />
          </Routes>
          <Footer />
          <Admin />
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
