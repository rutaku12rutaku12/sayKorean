import { Link } from "react-router-dom";

export default function Footer(props) {

    return (<>
        <h3> 푸터 </h3>
        <div>
            <ul>
                <li> <Link to="/"> 홈 </Link> </li>
                <li> <Link to="/mypage"> 마이페이지 </Link> </li>
                <li> <Link to="/study"> 한국어학습 </Link> </li>
                <li> <Link to="/test"> 한국어시험 </Link> </li>
            </ul>
        </div>
    </>)
}