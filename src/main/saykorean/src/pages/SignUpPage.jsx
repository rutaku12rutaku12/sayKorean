import { useState } from "react";
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";

console.log("회원가입 페이지 렌더링")
export default function SignUpPage (props){
    
    // disptach , navigate 함수 가져오기
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickName, setNickname] = useState("");
    const [phone, setPhone] = useState("");
    const [genreNo, setGenreNo] 

    return(<>
    이름: 
    이메일:
    비밀번호:
    닉네임:
    연락처:
    장르:
    </>)
}