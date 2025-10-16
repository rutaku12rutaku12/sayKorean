import axios from "axios"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logIn, logOut } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function MyInfoUpdatePage(props){
    console.log("MyInfoUpdate.jsx open")

    // 인풋 상태관리
    const [ userInfo , setUserInfo ] = useState(null)
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [nickName, setNickName] = useState("");
    const [phone, setPhone] = useState("");

    // 중복 여부 상태 관리 
    const [phoneCheck, setPhoneCheck] = useState(false);

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
            setName(data.name);
            setNickName(data.nickName);
            setPhone(data.phone);
            console.log(data);
            // 로그인된 데이터 정보를 userInfo에 담기
            dispath(logIn(data));
            setUserInfo(data);
        }catch(e){console.log(e)}
    }
    
    // 회원정보 수정 함수
    const onUpdate = async () => {
        console.log("onUpdate.exe")
        // return에 존재하는 input 마크업 내에 value={?} 값과 연결됨.
        try{const obj = { name, nickName , phone } // 
            console.log("수정할 정보:", obj)
            // CORS 허용
            const option = { withCredentials : true }
            const response = await axios.put("http://localhost:8080/saykorean/updateuserinfo",userInfo,option)
            const data = response.data

        }catch(e){console.log(e)}
    }
    // 비밀번호 수정 함수
    const onUpdatePwrd = async () => {
        console.log("onUpdatePwrd")
        try{

        }catch(e){console.log(e)}
    }

    // 연락처 중복검사
        const CheckPhone = async () =>{
            try{
                // CORS 옵션 허용
                const option = { withCredentials : true,
                                params:{phone:phone}
                }
                const response = await axios.get("http://localhost:8080/saykorean/checkphone",option)
                console.log(response);
                const data = response.data;
                console.log("중복이면 1 , 사용가능 0 반환:", data)
                if(data==-1){
                    setPhoneCheck(true);
                }
                else if(data==0){
                    setPhoneCheck(false);
                    {alert("사용 가능한 연락처입니다.")}
                }
                else if(data==1){
                setPhoneCheck(true);
                alert("이미 등록된 연락처입니다.")
                }
                else{alert("전화번호 형식에 맞게 입력해 주세요.")}
            }catch (e){alert("연락처 형식이 올바르지 않습니다.")
                console.log("예외 : " ,e)
            }
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
        이름&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" value={name} onChange={(e)=> setName(e.target.value)}/><br/>
        닉네임 <input type="text" value={nickName} onChange={(e)=> setNickName(e.target.value)}/><br/>
        연락처
        <PhoneInput
            country={'kr'} // initial country
            preferredCountries={['us', 'cn', 'jp', 'kr']} // country codes to be at the top
            enableSearch={true}
            value={phone}
            onChange={setPhone}
                inputProps={{ name: 'phone', required: true }}
                inputStyle={{ width: '40px', height: '5px', fontSize: '1.5rem' }}
        />
        <button onClick={CheckPhone}>중복 확인</button><br/> 
        <button onClick={onUpdate}>수정</button>
        <h3>비밀번호 수정</h3>
        비밀번호 <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/> <br/>
        <button onClick={onUpdatePwrd}>수정</button>

        <br/>
        <h3></h3>
        <button onClick={onDelete}>탈퇴</button>

    </>)
}