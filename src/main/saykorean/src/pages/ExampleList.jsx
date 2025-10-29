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
  const [langNo, setLangNo] = useState(0);

  // 언어 설정 가져오기 (selectedLangNo 사용)
  function getLang() {
    const stored = localStorage.getItem("selectedLangNo");
    const n = Number(stored);
    if (!Number.isFinite(n)) {
      setLangNo(0); // ko
      return;
    }
        setLangNo(n);
    }

    // study 상세 API (번역 포함)
    async function fetchSubject(studyNo, langNo) {
        const res = await axios.get("/saykorean/study/getDailyStudy", {
            params: { studyNo, langNo }
        });
        return res.data; // { themeKo, themeEn, commentKo, commentEn, examples: [...] }
    }

  

  // [3] useEffect로 데이터 로딩
  useEffect(() => {
  getLang();
}, []);

useEffect(() => {
  if (!studyNo || !Number.isFinite(Number(studyNo))) return;

  (async () => {
    try {
      setLoading(true);
      const s = await fetchSubject(Number(studyNo), langNo);
      setSubject(s);
      setExamples(s.examples || []); 
    } catch (e) {
      console.error(e);
      setError("학습 데이터를 불러오는 중 문제가 발생했어요.");
    } finally {
      setLoading(false);
    }
  })();
}, [studyNo, langNo]);


  

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
                    <h3>{langNo === 0 ? subject.themeKo : subject.themeEn}</h3>
                </div>
            )}

            <ul className="examListWrap">
                {examples.map((e) => (
                    <li key={e.examNo} className="examList">
                        <div className="ko">
                            {langNo === 0 ? e.examKo : (e.examEn || e.examKo)}
                        </div>
                        {langNo === 0 && e.examEn && <div className="e">{e.examEn}</div>}
                    </li>
                ))}
            </ul>

      
          <button className="successBtn" onClick={ () => successBtn(studyNo) }> 완료</button>
      </div>
  );
}