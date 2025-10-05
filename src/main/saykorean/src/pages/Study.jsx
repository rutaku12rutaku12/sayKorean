import './Study.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true; // 세션도 쓰면 유지

export default function Study(props) {

    // 1) URL 라우팅 파라미터에서 themeNo(주제 PK) 받기: /study/:themeNo
    const { themeNo } = useParams();

    // 2) 화면 상태
    const [ subject, setSubject ] = useState(null);    // 주제/해설(StudyDto)
    const [ exam, setExam ] = useState([]);    // 예문 목록(ExamDto[])

    // 주제/해설 불러오는 함수
    async function fetchSubject( themeNoValue ) {
        const response = await axios.get("/saykorean/study/getDailyStudy", {
            params: { themeNo: themeNoValue },
        });
        return response.data;
    }

    // [B] 예문 목록 불러오는 함수
    async function fetchExamples( studyNoValue ) {
        const response = await axios.get("/saykorean/exam", {
            params: { studyNo: studyNoValue },
        });
        return response.data;
    }

    // [C] 전체 플로우: (1) 주제/해설 → (2) 예문
    async function loadAll( themeNoValue ) {
        try {
            setLoading(true);
            setError("");

            // 주제/해설 가져오기
            const study = await fetchSubject( themeNoValue );
            setSubject(study);

            // 방금 가져온 주제의 themeNo(studyNo)로 예문 가져오기
            const list = await fetchExamples( study.themeNo );
            setExamples(list);
        } catch ( error ) {
            console.error( error );
            setError( "학습 데이터를 불러오는 중 문제가 발생했어요." );
        }
        
    }

    // 3) themeNo가 변할 때마다(=다른 주제로 들어왔을 때) 전체 데이터를 다시 로드
    useEffect(() => {
        // URL에 themeNo가 없으면 그냥 중단
        if (!themeNo) return;
        loadAll(themeNoNum);
    }, [themeNo] ); // 의존성: URL 파라미터가 바뀔 때마다 실행

    

    


    return (<>
        <div id="Study">
            <div className="mainTheme">
                <img className="studyImg" src="/img/rabbit.png"/>
                <h3> {subject.themeKo ?? subject.themeEn ?? "제목 없음"} </h3>
            </div>
            <ul>
                {examples.map(( e ) => (
              <li key={ e.examNo } className="examList">
                <div className="ko">{ e.examKo }</div>
                { e.examEn && <div className="e">{ e.examEn }</div> }
              </li>
            ))}
            </ul>
            


        </div>
    </>)
}