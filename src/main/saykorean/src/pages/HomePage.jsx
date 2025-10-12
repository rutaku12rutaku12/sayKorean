import { useSelector } from "react-redux";
import {useNavigate} from "react-router-dom"
export default function HomePage ( props ){
    const navigate =useNavigate();
    const isAuthenticated = useSelector((state)=>state.user.isAuthenticated);
    return (<>
    <h3>재밌는 한국어</h3>
            <div>
                <img className="mainImg" src="/img/mainimage.svg"/>
                <br/>
                {isAuthenticated == false ?(<>
                    <button>회원가입</button> 
                    <button onClick={()=>navigate("/login")}>로그인</button>
                    </>)
                : <button>로그아웃</button> }
            </div>
            
    </>)
}