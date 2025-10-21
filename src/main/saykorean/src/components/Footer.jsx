import "../styles/Footer.css"
import { Link } from "react-router-dom";

export default function Footer(props) {

    return (<>
        {/* <h3> 푸터 </h3> */}
        <div id="footer">
            <ul className="list">
                <li> <Link to="/home"> <img src="/img/home.svg"/></Link> </li>
                <li> <Link to="/mypage"><img src="/img/myPage.svg"/></Link> </li>
                <li> <Link to="/beforestudy"><img src="/img/study.svg"/></Link> </li>
                <li> <Link to="/test"><img src="/img/test.svg"/></Link> </li>
            </ul>
        </div>
    </>)
}