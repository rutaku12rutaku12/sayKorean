import { useNavigate } from "react-router-dom";
import "../styles/LoadingPage.css";

export default function Page404( props ){

    // navigate, dispatch 함수 가져오기
    const navigate =useNavigate();
    return(<>
    
    <div id="loading-frame">
        <img style={{width:'410px'}} src="/img/404Error.png"/>
        
        <div className="homePage__actions"><button onClick={()=>navigate("/login")} >로그인으로</button>
        </div>
    </div>
    </>)
    
}