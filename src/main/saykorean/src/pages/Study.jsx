import "../styles/Study.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";

axios.defaults.withCredentials = true;

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
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [langNo, setLangNo] = useState(0);
  const audioRef = useRef(null);

  const playAudio = (path) => {
    if (!path) return;
    try {
      if (audioRef.current) {
        if (audioRef.current.src.endsWith(path)) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } else {
          audioRef.current.pause();
        }
      }
      const audio = new Audio(path);
      audioRef.current = audio;
      audio.play();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  function getLang() {
    const stored = localStorage.getItem("selectedLangNo");
    const n = Number(stored);
    setLangNo(Number.isFinite(n) && n > 0 ? n : 1);
  }

  function getGenreNo() {
    const n = Number(localStorage.getItem("selectedGenreNo"));
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  async function getSubject(genreNo) {
    const res = await axios.get("/saykorean/study/getSubject", { params: { genreNo, langNo } });
    console.log( res.data );
    return asArray(res.data);
    
  }

  async function getDailyStudy(studyNoValue) {
    const res = await axios.get("/saykorean/study/getDailyStudy", { params: { studyNo: studyNoValue, langNo }});
    console.log( res.data );
    return res.data;
  }

  async function getFirstExam(studyNoValue) {
    const res = await axios.get("/saykorean/study/exam/first", { params: { studyNo: studyNoValue, langNo }});
    return res.data;
  }

  async function getNextExam() {
    if (!exam) return;
    const res = await axios.get("/saykorean/study/exam/next", {
      params: { studyNo, currentExamNo: exam.examNo, langNo }
    });
    if (res.data) setExam(res.data);
  }

  async function getPrevExam() {
    if (!exam) return;
    const res = await axios.get("/saykorean/study/exam/prev", {
      params: { studyNo, currentExamNo: exam.examNo, langNo }
    });
    if (res.data) setExam(res.data);
  }

  useEffect(() => {
    getLang();
  }, []);

  useEffect(() => {
    (async () => {
      const genreNo = getGenreNo();
      if (!Number.isFinite(genreNo)) return;

      const list = await getSubject(genreNo);
      const normalized = (Array.isArray(list) ? list : []).map(s => ({
        id: Number(s.studyNo),
        label: s.themeSelected || s.themeEn,
        subLabel: s.themeEn ? `(${s.themeEn})` : ""
      }));
      setSubjects(normalized); // langNo 바뀌면 새로 set됨

    })();
  }, [langNo]);

  useEffect(() => {
    if (!studyNo) return;

    (async () => {
      setLoading(true);
      const s = await getDailyStudy(Number(studyNo));
      setSubject(s);
      const first = await getFirstExam(Number(studyNo));
      setExam(first);
      setLoading(false);
    })();
  }, [studyNo, langNo]);

  const successBtn = () => {
    const id = Number(studyNo);
    if (!Number.isFinite(id) || id <= 0) return;

    const raw = localStorage.getItem("studies");
    const base = raw ? JSON.parse(raw) : [];
    const next = Array.from(new Set([...base, id]));
    localStorage.setItem("studies", JSON.stringify(next));

    navigate("/successexamlist");
    
  };

  

  return (
    <div id="Study" className="homePage">
      {loading && <div className="toast loading">불러오는 중…</div>}
      {error && <div className="toast error">{error}</div>}

      {!studyNo && <PickerSection title="주제 선택" items={subjects} activeId={null} />}

      {studyNo && subject && (
        <section className="panel detail">
          <div className="mainTheme">
            <h3 className="mainTitle">{ subject.themeSelected || "제목 없음"}</h3>
          </div>

        
          {subject.commenSelected && (
            <p className="mainComment">{subject.commenSelected}</p>
          )}

          {exam && (
            <div className="exam-area">
              {exam.imagePath && (
                <div className="exam-img-box">
                  <img className="exam-img" src={exam.imagePath} />
                </div>
              )}

              <div className="exam-text-box">
                <p className="exam-ko">{exam.examSelected}</p>
              </div>

              {exam.koAudioPath && (
                <button className="audio-btn" onClick={() => playAudio(exam.koAudioPath)}>
                  🔊 한국어 듣기
                </button>
              )}
              {exam.enAudioPath && (
                <button className="audio-btn" onClick={() => playAudio(exam.enAudioPath)}>
                  🔊 영어 듣기
                </button>
              )}

              <div className="exam-btns">
                <button className="btn-prev" onClick={getPrevExam}>이전</button>
                <button className="btn-next" onClick={getNextExam}>다음</button>
              </div>
            </div>
          )}

          <button className="goExampleBtn" onClick={successBtn}>
            교육 종료
          </button>
        </section>
      )}
    </div>
  );
}
