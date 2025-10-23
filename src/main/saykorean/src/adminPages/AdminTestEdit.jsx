import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

export default function AdminTestEdit() {
    // [*] 가상돔
    const navigate = useNavigate();
    const { testNo } = useParams();

    // [*] 기본 정보
    const [testData, setTestData] = useState({
        testNo: parseInt(testNo),
        testTitle: "",
        studyNo: null
    })

    // [*] 문항 목록
    const [items, setItems] = useState([]);

    // [*] 참조 데이터
    const [genres, setGenres] = useState([]);
    const [studies, setStudies] = useState([]);
    const [exams, setExams] = useState([]);

    // [*] 로딩
    const [loading, setLoading] = useState(true);

    // [*] 화면 초기화 시 데이터 불러오기
    useEffect(() => {
        fetchData();
    }, []);

    // [1] 데이터 조회

    // [2] 시험 정보 변경

    // [3-1] 문항 추가

    // [3-2] 문항 삭제

    // [3-3] 문항 변경

    // [4-1] 주제에 속한 예문 목록 찾기

    // [4-2] 예문 텍스트 찾기

    // [4-3] 주제 이름 찾기

    // [5] 유효성 검사

    // [6] 수정 실행

    // [7] 로딩 (이미지 추가 에정)



    return (<>

        <h3> 시험 수정하기 </h3>


    </>)
}