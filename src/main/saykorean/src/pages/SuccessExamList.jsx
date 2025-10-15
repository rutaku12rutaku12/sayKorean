import { useEffect, useState } from "react";
import "./ExampleList"

export default function SuccessExamList( props ){

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [studies, setStudies] = useState([]);


    function getStudies() {
        const studies = localStorage.getItem("studies");
        console.log(studies);
        if (studies == null) return null;

        

    }
    



    useEffect( () => {
        ( async() => {
            try{
                setLoading(true); // 로딩 시작
                setError(""); // 에러 초기화

                const list = Array.isArray(studies.data ) ? studies.data : [];
                setStudies(list);

            }catch(e){
                console.log( e );
                setError("완수한 주제 목록을 불러오지 못했어요.");
            }finally{
                setLoading(false);
            }
        })
    })



    return(<>
        <h3> 내가 완수한 주제 목록 조회 </h3>

        <ul>
            <li></li>
        </ul>
    </>)
}