import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export default function SignUpPage (props){
    console.log("SignUpPage.jsx open")
    
    // disptach , navigate 함수 가져오기
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // 인풋 상태 관리 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickName, setNickName] = useState("");
    const [phone, setPhone] = useState("");
                    // const [genreNo, setGenreNo] = useState(""); 기본값1
    
    // 중복 여부 상태 관리 
    const [emailCheck, setEmailCheck] = useState(true);
    const [phoneCheck, setPhoneCheck] = useState(true);

    
    // 이메일 중복검사
    const CheckEmail = async () =>{
        try{
            // CORS 옵션 허용
            const option = { withCredentials : true ,
            // params:{키1:값1 , 키2:값2} 을 넣으면 자동으로 URL뒤에 ?키1=값1&키2=값2 으로 매핑됨. 
                            params:{email:email}}; 
            // axios.get(url, config) 
            const response = await axios.get("http://localhost:8080/saykorean/checkemail",option)
            console.log(response);
            const data = response.data;
            console.log("중복이면 1 , 사용가능 0 반환:", data)
            if(data==0){
                setEmailCheck(false);
                {alert("사용 가능한 이메일입니다.")}}
            else if(data==1){
                setEmailCheck(true);
                alert("이미 등록된 이메일입니다.")}
            else if(data==-1){
                setEmailCheck(true);}
            else{alert("이메일 형식에 맞게 입력해 주세요.")}
        }catch (e){alert("이메일 형식이 올바르지 않습니다.")
            console.log("예외 : " ,e)
        }
    }
    // 연락처 중복검사
    const CheckPhone = async () =>{
        try{
            // CORS 옵션 허용
            const option = { withCredentials : true,
                            params:{phone:phone}
            }; console.log("검사할 번호 : ", phone);
            const response = await axios.get("http://localhost:8080/saykorean/checkphone",option)
            console.log(response);
            const data = response.data;
            console.log("중복이면 1 , 사용가능 0 반환:", data)
            if(data==0){
                setPhoneCheck(false);
                {alert("사용 가능한 연락처입니다.")}
            } 
            else if(data==1){
            setPhoneCheck(true);
            alert("이미 등록된 연락처입니다.")
            }
            else if(data==-1){
                setPhoneCheck(true);
            }
            else{alert("전화번호 형식에 맞게 입력해 주세요.")}
        }catch (e){alert("연락처 형식이 올바르지 않습니다.")
            console.log("예외 : " ,e)
        }
    }


    // 회원가입 함수 
    const onSignup = async()=>{
        try{
            const obj = { name : name , email: email, password:password, nickName: nickName , phone : phone}
            console.log(obj);
            if(emailCheck || phoneCheck) return alert("중복확인을 해주세요.")
            // CORS 옵션 허용
            const option = { withCredentials : true }    
            const response = await axios.post("http://localhost:8080/saykorean/signup",obj,option)
            console.log("보내는값확인",obj);
            const data = response.data;
            console.log("userNo",data,"으로 가입");
            alert("Welcome! 회원이 되신 것을 환영합니다. ")
            navigate("/login");
            console.log("회원가입 성공");
            }catch(e){
                alert("회원가입이 실패 했습니다.");
                console.log("회원가입 실패", e)}
    }

    // 전화번호에 +값이 빠지는걸 추가 시키는 함수
    const handlePhoneChange = (value, country, event, formattedValue) => {
        // 공백 제거
        let phoneWithPlus = (value || "").replace(/\s+/g, "");

        // + 없으면 붙이기
        if (!phoneWithPlus.startsWith("+")) {
            phoneWithPlus = "+" + phoneWithPlus;
        }

        setPhone(phoneWithPlus);
        console.log("저장될 phone:", phoneWithPlus);
    };


    return(<> <h3>회원가입</h3><br/>
        <div>
            이름 (name) <br/>
            <input type="text" placeholder="이름을 입력해주세요." value={name} onChange={(e)=> setName(e.target.value)} /> <br/>
            이메일 (email) <br/>
            <input type="email" placeholder="이메일을 입력해주세요." value={email} onChange={(e)=> setEmail(e.target.value)} /> <button onClick={CheckEmail}> 중복 확인</button> <br/>
            비밀번호 (password) <br/>
            <input type="password" placeholder="비밀번호를 입력해주세요." value={password} onChange={(e)=> setPassword(e.target.value)} /> <br/>
            닉네임 (nickName) <br/>
            <input type="text" placeholder="닉네임을 입력해주세요." value={nickName} onChange={(e)=> setNickName(e.target.value)} /> <br/>
            연락처 (phone) <br/>
            <PhoneInput
            country={'kr'} // initial country
            preferredCountries={['us', 'cn', 'jp', 'kr']} // country codes to be at the top
            enableSearch={true}
            value={phone}
            onChange={handlePhoneChange}
                inputProps={{ name: 'phone', required: true }}
                inputStyle={{ width: '200px', height: '20px', fontSize: '15px' }}
            /> <button type="button" onClick={CheckPhone}> 중복 확인</button> <br/>   
            <br/>
            <button onClick={onSignup}>회원가입 (SignUp) </button>
        </div>
    </>)
}