import "../styles/Footer.css"
import { Link } from "react-router-dom";

export default function Footer(props) {

    return (<>
        {/* <h3> 푸터 </h3> */}
        <ul id="footer">
            <ul className="list">
                <li> <Link to="/home"> <img src="/img/home.svg"/></Link> <div>홈</div></li>
                <li> <Link to="/mypage"><img src="/img/myPage.svg"/></Link> <div>내정보</div> </li>
                <li> <Link to="/beforestudy"><img src="/img/study.svg"/></Link> <div>학습</div> </li>
                <li> <Link to="/testlist"><img src="/img/test.svg"/></Link> <div>시험</div> </li>
                <li> <Link to="/rank"><img src="/img/test.svg"/></Link> <div>순위</div> </li>
                {/* <li> <Link to="/rank"><img src="/img/rank.svg"/></Link><div>홈</div></li> */}
            </ul>
        </ul>
    </>)
}