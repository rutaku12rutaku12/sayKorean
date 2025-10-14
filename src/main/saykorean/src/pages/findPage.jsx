import axios from "axios";
import { useState } from "react";


export default function FindPage(props){
    console.log("FindPage.jsx open")

        // 인풋 상태 관리 
        const [name, setName] = useState("");
        const [phone, setPhone] = useState("");
        const [email, setEmail] = useState("");
        const [name2, setName2] = useState("");
        const [phone2, setPhone2] = useState("");

        // 이메일 찾기 함수
        const findEmail = async()=>{
            try{
                // CORS 옵션 허용
                const option = { withCredentials : true ,
                    params:{name,phone}
                }
                const response = await axios.get("http://localhost:8080/saykorean/findemail",option)
                const data = response.data;
                console.log("조회 결과:", data);
                alert("이메일 : "+data);
                
            }catch(e){console.log(" 이메일찾기 실패 ", e)}
        }

        // 비밀번호 찾기 함수
        const findPwrd = async()=>{
            try{
                // CORS 옵션 허용
                const option = { withCredentials : true ,
                    params:{name:name2,phone:phone2,email}
                }
                const response = await axios.get("http://localhost:8080/saykorean/findpwrd",option)
                const data = response.data;
                alert("비밀번호 : "+data);
            }catch(e){console.log(" : ", e)}
        }

    return(<>
        <h3>이메일 찾기</h3><br/>
         이름 (name) <br/>
            <input type="text" placeholder="이름을 입력해주세요." value={name} onChange={(e)=> setName(e.target.value)} /> <br/>
        연락처 (phone) <br/>
            <input type="tel" placeholder="연락처를 입력해주세요." value={phone} onChange={(e)=> setPhone(e.target.value)} /> <br/> <br/>
        <button onClick={findEmail}>확인</button>

        <h3>비밀번호 찾기</h3><br/>
         이름 (name) <br/>
            <input type="text" placeholder="이름을 입력해주세요." value={name2} onChange={(e)=> setName2(e.target.value)} /> <br/>
        연락처 (phone) <br/>
            <input type="tel" placeholder="연락처를 입력해주세요." value={phone2} onChange={(e)=> setPhone2(e.target.value)} /> <br/>
        이메일 (email) <br/>
            <input type="email" placeholder="이메일을 입력해주세요." value={email} onChange={(e)=> setEmail(e.target.value)} /> <br/> <br/>
        <button onClick={findPwrd}>확인</button>
    </>)
}