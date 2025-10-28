import "../styles/StartPage.css";

export default function StartPage(props) {
  console.log("StartPage.jsx open");

  return(<>
    <div id="StartRay">
        <div id="homePage" className="homePage">
            {/* 이 한 줄이 ‘이 페이지에서만’ 배경 역할을 함 */}
            <div className="homePage__bg" aria-hidden="true" />

            <img className="logoImg" src="/img/logo.png" />

            <div className="homePage__content">
                <img className="mainImg" src="/img/mainimage.svg" alt="메인" />
                <div className="homePage__actions">
                
                </div>
            </div>
        </div>
    </div>
    </>)
}