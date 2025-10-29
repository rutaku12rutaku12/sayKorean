import "../styles/Study.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

axios.defaults.withCredentials = true;

// 배열 유틸
function asArray(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (typeof payload === "string") {
    try {
      const parsed = JSON.parse(payload);
      return Array.isArray(parsed) ? parsed : [];
    } catch {}
  }
  if (typeof payload === "object") {
    for (const key of ["data", "list", "items", "content", "result"]) {
      if (Array.isArray(payload[key])) return payload[key];
    }
  }
  return [];
}

// 주제 목록 UI
function PickerSection({ title, items, activeId }) {
  return (
    <section className="panel">
      <h3 className="panelTitle">{title}</h3>
      <div className="list">
        {(items || []).map((it, idx) => (
          <Link
            key={`${title}-${it.id}-${idx}`}
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

  // 상태
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState(null);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [langNo, setLangNo] = useState(0);
  const audioRef = useRef(null);

  // 오디오
  const playAudio = (path) => {
    if (!path) return;
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(path);
    audioRef.current = audio;
    audio.play().catch(() => {});
  };

  function getLang() {
    const stored = Number(localStorage.getItem("selectedLangNo"));
    setLangNo(Number.isFinite(stored) && stored > 0 ? stored : 1);
  }

  function getGenreNo() {
    const n = Number(localStorage.getItem("selectedGenreNo"));
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  // API 호출
  async function getSubject(genreNo) {
    const res = await axios.get("/saykorean/study/getSubject", {
      params: { genreNo, langNo: langNo ?? 1 }
    });
    return asArray(res.data);
  }

  async function getDailyStudy(studyNo) {
    const res = await axios.get("/saykorean/study/getDailyStudy", {
      params: { studyNo, langNo: langNo ?? 1 }
    });
    return res.data;
  }

  async function getFirstExam(studyNo) {
    const res = await axios.get("/saykorean/study/exam/first", {
      params: { studyNo, langNo: langNo ?? 1 }
    });
    return res.data;
  }

  async function getNextExam() {
    if (!exam) return;
    const res = await axios.get("/saykorean/study/exam/next", {
      params: { studyNo, currentExamNo: exam.examNo, langNo }
    });
    res.data && setExam(res.data);
  }

  async function getPrevExam() {
    if (!exam) return;
    const res = await axios.get("/saykorean/study/exam/prev", {
      params: { studyNo, currentExamNo: exam.examNo, langNo }
    });
    res.data && setExam(res.data);
  }

  // 제목 클릭 시 완료 처리
  const successBtn = () => {
    const id = Number(studyNo);
    if (id > 0) {
      const prev = JSON.parse(localStorage.getItem("studies") || "[]");
      const save = Array.from(new Set([...prev, id]));
      localStorage.setItem("studies", JSON.stringify(save));
    }
    navigate("/successexamlist");
  };

  // 언어 로드
  useEffect(() => {
    getLang();
  }, []);

  // 언어 확정되면 주제 목록 로드
  useEffect(() => {
    if (langNo === null) return;

    (async () => {
      const genreNo = getGenreNo();
      if (!genreNo) return;
      const list = await getSubject(genreNo);

      setSubjects(
        list.map((s) => ({
          id: Number(s.studyNo),
          label: s.themeSelected ?? s.themeKo,
          subLabel: s.themeEn ? `(${s.themeEn})` : ""
        }))
      );
    })();
  }, [langNo]);

  // 상세 + 예문 로드
  useEffect(() => {
    if (!studyNo || langNo === null) return;

    (async () => {
      setLoading(true);
      setSubject(await getDailyStudy(Number(studyNo)));
      setExam(await getFirstExam(Number(studyNo)));
      setLoading(false);
    })();
  }, [studyNo, langNo]);

  return (
    <div id="Study" className="homePage">
      {loading && <div className="toast loading">불러오는 중…</div>}

      {!studyNo && (
        <PickerSection title="주제 선택" items={subjects} activeId={null} />
      )}

      {studyNo && subject && (
        <section className="panel detail">
          <div className="mainTheme">
            <h3 className="mainTitle">
              {subject.themeSelected || subject.themeKo || "제목 없음"}
            </h3>
          </div>

          {subject.commenSelected && (
            <p className="mainComment">{subject.commenSelected}</p>
          )}

          {exam && (
            <div className="exam-area">
              {exam.imagePath && (
                <div className="exam-img-box">
                  <img className="exam-img" src={exam.imagePath} alt="" />
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
