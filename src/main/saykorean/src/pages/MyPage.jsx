import axios from "axios"
import { useEffect } from "react"

export default function MyPage( props ){
    console.log("MyPage.jsx open")
    
    useEffect( () => {info() })
    const info = async () => {
        const response = await axios.get("http://localhost:5173/saykorean/info")
        console.log(response.status);
        console.log(response.data);
    }
   
    return(<>
    닉네임 · 가입일자       설정버튼 <br/>
    
    <br/>

    출석일자<br/>

    </>)
    
}