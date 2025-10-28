import "../styles/Study.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";

axios.defaults.withCredentials = true;

// 응답을 배열로 표준화
function asArray(payload) {
  if (typeof payload === "string") {
    try { payload = JSON.parse(payload); } catch {}
  }
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    for (const k of ["data", "list", "items", "content", "result"]) {
      if (Array.isArray(payload[k])) return payload[k];
    }
  }
  return [];
}





// 재사용 컴포넌트
function PickerSection({ title, items, activeId }) {
  return (
    <section className="panel">
      <h3 className="panelTitle">{title}</h3>
      <div className="list">
        {(Array.isArray(items) ? items : []).map((it, idx) => (
          <Link
            key={`${title}-${it?.id ?? "noid"}-${idx}`}
            to={`/study/${it.id}`}
            className={`pillBtn ${Number(activeId) === Number(it.id) ? "active" : ""}`}
          >
            <span className="label">{it.label}</span>
            {it.subLabel && <span className="sub">{it.subLabel}</span>}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Study() {
  const navigate = useNavigate();
  const { studyNo } = useParams();


  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState(null);
  const [exam, setExam] = useState(null); // 예문 한 개만
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [langNo, setLangNo] = useState(0);
  // Study 컴포넌트 내부
  const audioRef = useRef(null);

  // 오디오 재생 함수
  const playAudio = (path) => {
    try {
      if (!path) return;

      // 기존 재생 중이면 정지
      if (audioRef.current) {
        // 같은 파일을 다시 누르면 처음부터
        if (audioRef.current.src.endsWith(path)) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } else {
          audioRef.current.pause();
        }
      }

      const audio = new Audio(path);
      audioRef.current = audio;
      console.log("koAudioPath:", exam.koAudioPath);
      // iOS/Safari 대비: 사용자 클릭 이벤트 안에서 play 호출
      audio.play().catch((e) => {
        console.warn("오디오 자동재생 차단 또는 재생 실패:", e);
      });
    } catch (e) {
      console.error("오디오 재생 오류:", e);
    }
  };

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
    }
  };
}, []);


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

  // 장르 가져오기
  function getGenreNo() {
    const genreNo = localStorage.getItem("selectedGenreNo");
    if (genreNo == null) return null;

    const n = Number(genreNo);
    if (Number.isFinite(n) && n > 0) return n;
    try {
      const obj = JSON.parse(genreNo); // '{"genreNo":1}' 같은 형태 대응
      const m = Number(obj?.genreNo ?? obj);
      if (Number.isFinite(m) && m > 0) return m;
    } catch (_e) { console.log(_e); }
    return null;
  }

  // 주제 목록
  async function getSubject(genreNo) {
    const res = await axios.get("/saykorean/study/getSubject", { params: { genreNo, langNo } });
    return asArray(res.data);
  }

  // 주제 상세
  async function getDailyStudy(studyNoValue) {
    const res = await axios.get("/saykorean/study/getDailyStudy", {
      params: { studyNo: studyNoValue, langNo }
    });
    return res.data;
  }

  // 처음 예문 1개
  async function getFirstExam(studyNoValue) {
    const res = await axios.get("/saykorean/study/exam/first", {
      params: { studyNo: studyNoValue, langNo }
    });
    console.log( res.data );
    return res.data;
  }

  // 다음 예문
  async function getNextExam() {
    if (!exam) return;
    const res = await axios.get("/saykorean/study/exam/next", {
      params: {
        studyNo,
        currentExamNo: exam.examNo,
        langNo
      }
    });
    if (res.data) setExam(res.data);
  }

  // 이전 예문
  async function getPrevExam() {
    if (!exam) return;
    const res = await axios.get("/saykorean/study/exam/prev", {
      params: {
        studyNo,
        currentExamNo: exam.examNo,
        langNo
      }
    });
    if (res.data) setExam(res.data);
  }

  // 마운트 시 주제 목록
  useEffect(() => {
    getLang();
    (async () => {
      try {
        setLoading(true);
        setError("");

        const genreNo = getGenreNo();
        if (!Number.isFinite(Number(genreNo))) {
          setError("로그인이 필요하거나 선호 장르가 설정되지 않았습니다.");
          return;
        }

        const list = await getSubject(genreNo);
        const normalized = (Array.isArray(list) ? list : [])
          .map((s) => ({
            id: Number(s?.studyNo),
            label: s?.themeKo || s?.themeEn || `주제 #${s?.studyNo}`,
            subLabel: s?.themeEn ? `(${s.themeEn})` : ""
          }))
          .filter((it) => Number.isFinite(it.id) && it.id > 0);
        setSubjects(normalized);
      } catch (e) {
        console.error(e);
        setError("초기 데이터를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // studyNo 변경 시 상세 & 첫 예문 로드
  useEffect(() => {
    if (!studyNo) {
      setSubject(null);
      setExam(null);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError("");

        const s = await getDailyStudy(Number(studyNo));
        setSubject(s);

        const first = await getFirstExam(Number(studyNo));
        setExam(first);
      } catch (e) {
        console.error(e);
        setError("학습 데이터를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [studyNo, langNo]);

  return (
    <div id="Study" className="homePage">
      {loading && <div className="toast loading">불러오는 중…</div>}
      {error && <div className="toast error">{error}</div>}

      {!studyNo && (
        <PickerSection title="주제 선택" items={subjects} activeId={null} />
      )}

      {studyNo && subject && (
        <section className="panel detail">
          <div className="mainTheme">
            <h3 className="mainTitle">{subject.themeSelected || subject.themeKo || subject.themeEn || "제목 없음"}</h3>
          </div>

          {exam && (
            <div className="exam-area">
              {/* 이미지 */}
              {exam.imagePath && (
                <div className="exam-img-box">
                  <img className="exam-img" src={exam.imagePath} alt={`exam-${exam.examNo}`} />
                </div>
              )}

              {/* 텍스트 3줄 */}
              <div className="exam-text-box">
                {exam.examKo && <p className="exam-ko">{exam.examKo}</p>}
                {exam.examEn && <p className="exam-en">{exam.examEn}</p>}
                <p className="exam-selected">{exam.examSelected}</p>
              </div>

                {/* 오디오: 한국어 */}
                {exam.koAudioPath && (
                  <button
                    className="audio-btn"
                    onClick={() => playAudio(exam.koAudioPath)}
                  >
                    🔊 한국어 듣기
                  </button>
                )}

                {/* 오디오: 영어 */}
                {exam.enAudioPath && (
                  <button
                    className="audio-btn"
                    onClick={() => playAudio(exam.enAudioPath)}
                  >
                    🔊 영어 듣기
                  </button>
                )}

              {/* 이전/다음 버튼 */}
              <div className="exam-btns">
                <button className="btn-prev" onClick={getPrevExam}>이전</button>
                <button className="btn-next" onClick={getNextExam}>다음</button>
              </div>
            </div>
          )}

          {/* 예문 페이지로 이동 */}
          <button
            className="goExampleBtn"
            onClick={() => navigate(`/exampleList/${studyNo}`)}
          >
            다음 단계
          </button>
        </section>
      )}
    </div>
    );
  }
