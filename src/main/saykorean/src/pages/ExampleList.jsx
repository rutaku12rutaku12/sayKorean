import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

export default function ExampleList() {
  const navigate = useNavigate();
  const { studyNo } = useParams(); // URL에서 주제번호 가져오기

  // 상태 정의
  const [subject, setSubject] = useState(null);
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [studies, setStudies] = useState([]);

  // [1] 주제 상세 데이터 가져오기
  const fetchSubject = async (n) => {
    const { data } = await axios.get("/saykorean/study/getDailyStudy", {
      params: { studyNo: n },
    });
    return data; // { themeKo, commenKo, examples: [...] }
  };

  // [2] 예문만 따로 가져오기 (선택 사항)
  const fetchExamples = async (n) => {
    const { data } = await axios.get("/saykorean/study/getDailyStudy2", {
      params: { studyNo: n },
    });
    return data; // [ { examNo, examKo, examEn }, ... ]
  };

  // [3] useEffect로 데이터 로딩
  useEffect(() => {
    if (!studyNo) return; // URL 파라미터 없으면 실행 안 함

    const n = Number(studyNo);
    if (!Number.isFinite(n)) {
      setError("잘못된 학습 번호입니다.");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError("");
        // 주제 상세 + 예문 가져오기
        const s = await fetchSubject(n);
        setSubject(s);
        // examples 필드가 있다면 바로 사용, 없으면 따로 호출
        setExamples(s.examples || (await fetchExamples(n)));
      } catch (e) {
        console.error(e);
        setError("학습 데이터를 불러오는 중 문제가 발생했어요.");
      } finally {
        setLoading(false);
      }
    })();
  }, [studyNo]);

  

// -----------------------------------//




const loadStudiesFromLocal = () => {
    try {
      const studies = localStorage.getItem("studies");
      const arr = studies ? JSON.parse(studies) : [];
      return Array.isArray(arr)
        ? arr.map(Number).filter(n => Number.isFinite(n) && n > 0)
        : [];
    } catch {
      return [];
    }
  };

  const saveStudiesToLocal = (arr) => {
    localStorage.setItem("studies", JSON.stringify(arr));
  };



// -----------------------------------//


  // studyNo localStorage에 안전하게 저장하고 SuccessExamList로 이동하기 위한 함수
  const successBtn = () => {
    const id = Number(studyNo);
    if (!Number.isFinite(id) || id <= 0) {
      console.warn("Invalid studyNo:", studyNo);
      return;
    }


    // 1) localStorage에서 현재 리스트 읽기
  let base = [];
  try {
    const raw = localStorage.getItem("studies");
    base = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(base)) base = [];        // 이전에 "1" 처럼 문자열 저장됐던 경우 방어
  } catch {
    base = [];
  }

  // 2) 새 id를 병합 + 중복 제거
  const next = Array.from(new Set([...base, id]));
  console.log( next );

  // 3) 저장
  localStorage.setItem("studies", JSON.stringify(next));

  // 4) (선택) state도 맞춰두면 좋음
  setStudies(next);

  // 5) 이동
  navigate("/successexamlist");
  };


  // [4] 렌더링
  return (
    <div id="ExampleList" className="homePage">

      {subject && (
        <div className="subjectInfo">
          <h3>{subject.themeKo ?? "제목 없음"}</h3>
        </div>
      )}

          <ul className="examListWrap">
              {(Array.isArray(examples) ? examples : []).map((e) => (
                  <li key={e.examNo} className="examList">
                      <div className="ko">{e.examKo}</div>
                      {e.examEn && <div className="e">{e.examEn}</div>}
                  </li>
              ))}
          </ul>
      
          <button className="successBtn" onClick={ () => successBtn(studyNo) }> 완료</button>
      </div>
  );
}