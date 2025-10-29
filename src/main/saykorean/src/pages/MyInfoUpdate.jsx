import axios from "axios"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logIn, logOut } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import "../styles/MyInfoUpdate.css"

export default function MyInfoUpdatePage(props){
    console.log("MyInfoUpdate.jsx open")

    // 인풋 상태관리
    const [ userInfo , setUserInfo ] = useState(null)
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [nickName, setNickName] = useState("");
    const [phone, setPhone] = useState("");

    // 중복 여부 상태 관리 
    const [phoneCheck, setPhoneCheck] = useState(true);

    // 새로운 패스워드 확인 상태 관리
    const [currentPassword, setCurrentPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

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
            setUserInfo(data);
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
        try{const obj = { userNo: userInfo.userNo, name, nickName , phone }
            console.log("수정할 정보:", obj)
            // CORS 허용
            const option = { withCredentials : true }
            const response = await axios.put("http://localhost:8080/saykorean/updateuserinfo",obj,option)
            const data = response.data;
            setUserInfo(data);
            dispath(logIn(data));
            alert("회원정보가 정상적으로 수정되었습니다.");
        }catch(e){console.log(e);
            alert("오류가 발생하였습니다.")
        }
    }
    // 비밀번호 수정 함수
    const onUpdatePwrd = async (currentPassword,newPassword,checkPassword) => {
        console.log("onUpdatePwrd")
        if(newPassword != checkPassword) {return alert("변경할 비밀번호가 다릅니다.")}
        try{
        console.log("currentPassword:", currentPassword, "newPassword:", newPassword , "checkPassword:", checkPassword);
        const obj = { userNo: userInfo.userNo, currentPassword, newPassword };
        const option = { withCredentials : true }
        const response = await axios.put("http://localhost:8080/saykorean/updatepwrd",obj,option)
        const data = response.data;
        console.log(data);
        setUserInfo(data);
        alert("비밀번호가 정상적으로 수정되었습니다.");
        navigate("/mypage")
        }catch(e){console.log(e);
            alert("오류가 발생하였습니다.")
        }
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
                navigate("/login");
            }

        }catch(e){console.log(e)}
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

    return (<>
        <div id="updateWrapper" className="homePage">
            <h3>사용자 정보 수정</h3>

            <div className="info">
                <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="이름" />
                <input className="input" type="text" value={nickName} onChange={e => setNickName(e.target.value)} placeholder="닉네임" />
            </div>

            <div className="info row">
                <PhoneInput
                    country={'kr'}
                    preferredCountries={['us', 'cn', 'jp', 'kr']}
                    enableSearch={true}
                    value={phone}
                    onChange={handlePhoneChange}
                    inputClass={phoneCheck ? "input error" : "input success"}
                    placeholder="연락처"
                />
                <button className={`sideBtn ${phoneCheck ? "errorBtn" : "successBtn"}`} onClick={CheckPhone}>중복 확인</button>
            </div>

            <div className="homePage__actions">
                <button className="pillBtn" onClick={onUpdate}>수정</button>
            </div>


            <h3>비밀번호 수정</h3>
            <div className="info">
                <input className="input" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="기존 비밀번호" />
                <input className="input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="새 비밀번호" />
                <input className="input" type="password" value={checkPassword} onChange={e => setCheckPassword(e.target.value)} placeholder="새 비밀번호 확인" />
            </div>
            <div className="homePage__actions">
                <button className="pillBtn" onClick={() => onUpdatePwrd(currentPassword, newPassword, checkPassword)}>수정</button>
            </div>

            <h3>회원 탈퇴</h3>
            <div className="homePage__actions">
                <button className="pillBtn" onClick={onDelete}>탈퇴</button>
            </div>
        </div>


    </>)
}