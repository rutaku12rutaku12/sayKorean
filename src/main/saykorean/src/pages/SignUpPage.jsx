import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";

console.log("회원가입 페이지 렌더링")
export default function SignUpPage (props){
    
    // disptach , navigate 함수 가져오기
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // 인풋 상태 관리 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickName, setNickname] = useState("");
    const [phone, setPhone] = useState("");
                    // const [genreNo, setGenreNo] = useState(""); 기본값1
    
    // 중복 여부 상태 관리 
    const [emailCheck, setEmailCheck] = useState(false);
    const [phoneCheck, setPhoneCheck] = useState(false);

    
    // 중복검사1
    const CheckEmail = async () =>{
        try{
            // CORS 옵션 허용
            const option = { withCredentials : true }
            const response = await axios.get(`http://localhost:8080/saykorean/checkemail?email=${email}`,option)
            console.log(response);
            const data = response.data;
            console.log("중복여부", data)
            if(data==1){
            setEmailCheck(true);
            alert("사용 가능한 이메일입니다.")
            }else{alert("이미 등록된 이메일입니다.")}
        }catch (e){alert("이메일 형식이 올바르지 않습니다.")
            console.log("예외 : " ,e)
        }
    }
    const CheckPhone = async () =>{
        try{
            // CORS 옵션 허용
            const option = { withCredentials : true }
            const response = await axios.get(`http://localhost:8080/saykorean/checkphone?phone=${phone}`,option)
            console.log(response);
            const data = response.data;
            console.log("중복여부", data)
            setPhoneCheck(true);
            if(data==1){
            setPhoneCheck(true);
            alert("사용 가능한 연락처입니다.")
            }else{alert("이미 등록된 연락처입니다.")}
        }catch (e){alert("연락처 형식이 올바르지 않습니다.")
            console.log("예외 : " ,e)
        }
    }

    return(<> <h3>회원가입</h3><br/>
        <div>
            이름 (name) <br/>
            <input type="name" placeholder="이름을 입력해주세요." value={name} onChange={(e)=> setName(e.target.value)} /> <br/>
            이메일 (email) <br/>
            <input type="email" placeholder="이메일을 입력해주세요." value={email} onChange={(e)=> setEmail(e.target.value)} /> <button onClick={CheckEmail}> 중복확인</button> <br/>
            비밀번호 (password) <br/>
            <input type="password" placeholder="비밀번호를 입력해주세요." value={password} onChange={(e)=> setPassword(e.target.value)} /> <br/>
            닉네임 (nickName) <br/>
            <input type="nickName" placeholder="닉네임을 입력해주세요." value={nickName} onChange={(e)=> setNickname(e.target.value)} /> <br/>
            연락처 (phone) <br/>
            <input type="phone" placeholder="연락처를 입력해주세요." value={phone} onChange={(e)=> setPhone(e.target.value)} /> <button onClick={CheckPhone}> 중복확인</button> <br/>
            <br/>
            <button>회원가입 (SignUp) </button>
        </div>
    </>)
}