import axios from "axios"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logIn, logOut } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

export default function MyInfoUpdatePage(props){
    console.log("MyInfoUpdate.jsx open")

    // 인풋 상태관리
    const [ userInfo , setUserInfo ] = useState(null)
    const [password, setPassword] = useState("");
    const [nickName, setNickName] = useState("");
    const [phone, setPhone] = useState("");

   // dispath , navigate 함수가져오기 
    const dispath = useDispatch();
    const navigate = useNavigate();
    
    // useEffect로 최초실행 렌더링
    useEffect( () => { info() } , [] )
    // 내 정보 조회 함수
    const info = async () => {
        try{console.log("info.exe")
            const option = { withCredentials : true }
            const response = await axios.get("http://localhost:8080/saykorean/info",option)
            const data = response.data
            console.log(data);
            // 로그인된 데이터 정보를 userInfo에 담기
            dispath(logIn(data));
            setUserInfo(data);
        }catch(e){console.log(e)}
    }

    // 수정함수
    const onUpdate = async () => {
        console.log("onUpdate.exe")
        console.log("수정할 정보:", userInfo)
        // CORS 허용
        try{const option = { withCredentials : true }
            const response = await axios.put("http://localhost:8080/saykorean/updateuserinfo",userInfo,option)
            const data = response.data

        }catch(e){console.log(e)}
    }
    // 탈퇴함수
    const onDelete = async () => {
        console.log("onDelete.exe")
        const promptPassword = prompt("정말 탈퇴하시겠습니까? 비밀번호를 입력해주세요.");
        if(!promptPassword) 
            return alert("비밀번호를 다시 입력해주세요.");
        // CORS 허용
        try{const option = { withCredentials : true }
            const response = await axios.put("http://localhost:8080/saykorean/deleteuser",{password:promptPassword},option)
            console.log(response.data);
            const data = response.data
            if(data==1){
                alert("회원탈퇴가 완료되었습니다.")
                dispath(logOut());
                navigate("/");
            }

        }catch(e){console.log(e)}
    }

    return(<>
        <h3>사용자 정보 수정</h3>
        <br/>
        닉네임 <input type="text" value={nickName} onChange={(e)=> setNickName(e.target.value)}/><br/>
        연락처 <input type="tel" value={phone} onChange={(e)=> setPhone(e.target.value)}/><br/> 
        <button onClick={onUpdate}>수정</button>
        <h3>비밀번호 수정</h3>
        비밀번호 <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/> <br/>

        <br/>
        <h3></h3>
        <button onClick={onDelete}>탈퇴</button>

    </>)
}