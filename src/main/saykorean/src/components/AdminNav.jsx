import { Link } from "react-router-dom";

export default function AdminNav(props) {

    return (<>
        <div>
            <ul class="list">
                <li> <Link to="/admin"> 관리자 홈 </Link> </li>
                <li> <Link to="/admin/study"> 교육 관리 </Link> </li>
                <li> <Link to="/admin/test"> 시험 관리 </Link> </li>
            </ul>
        </div>
    </>)
}