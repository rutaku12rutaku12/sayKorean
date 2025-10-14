import { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function AdminStudyCreate(props) {

    // 가상 URL 페이지 전환
    const navigate = useNavigate();

    // 인풋박스 상태관리
    const [inputGenre , setInputGenre] = useState("");
    const [inputTheme , setInputTheme] = useState("");
    const [inputExample , setInputExample] = useState("");
    const [inputExampleImg , setInputExampleImg] = useState(null);
    const [inputAudioRecord , setInputAudioRecord] = useState("");
    const [inputAudioFile , setInputAudioFile] = useState(null);

    // 셀렉트박스 상태관리
    const [selectGenre, setSelectGenre] = useState("");
    const [selectTheme, setSelectTheme] = useState("");
    



    // [1] 장르 Axios
    const onGenre = async () => {
        try {
            const obj = 

        } catch (e) {
            console.log("장르를 불러올 수 없습니다 : ", e)
            alert("장르를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.");
        }
    }

    // [2] 주제 Axios

    // [3-1] 예문 레코드 Axios

    // [3-2] 예문 그림파일 Axios

    // [4-1] 음성 레코드 Axios

    // [4-2] 음성 파일 Axios

    // [*] 교육 레코드 생성 로직
    // 유효성 검사 ㄱㄱ

    // [*] 교육 생성 후 이동



    return (<>
        <h3> 관리자 교육 생성 </h3>
    </>)
}