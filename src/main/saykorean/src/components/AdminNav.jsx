import { Link } from "react-router-dom";
import "../styles/AdminCommon.css";

export default function AdminNav(props) {
    return (
        <div className="admin-nav">
            <div>
                <Link to="/admin"> <img className="navImg" src="/img/todori.png" /> </Link>
                <span className="navTitle"> 재밌는한국어 관리자 </span>
            </div>
            <ul className="list">
                <li><Link to="/admin">관리자 홈</Link></li>
                <li><Link to="/admin/study">교육 관리</Link></li>
                <li><Link to="/admin/test">시험 관리</Link></li>
                <li><Link to="/admin/user">회원 관리</Link> </li>
            </ul>
        </div >
    )
}