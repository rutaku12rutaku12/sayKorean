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
    } catch { }
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
  const audioRef = useRef(null);

  // [*] UI 언어 번역
  const { t } = useTranslation();

  // langNo 초기값을 localStorage에서 바로 읽어오기
  const [langNo, setLangNo] = useState(() => {
    const stored = Number(localStorage.getItem("selectedLangNo"));
    return Number.isFinite(stored) && stored > 0 ? stored : 1;
  });

  // getLang 대체
  // function getLang() {
  //   const stored = Number(localStorage.getItem("selectedLangNo"));
  //   setLangNo(Number.isFinite(stored) && stored > 0 ? stored : 1);
  // }

  // 오디오
  const playAudio = (path) => {
    if (!path) return;
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(path);
    audioRef.current = audio;
    audio.play().catch(() => { });
  };

  function getGenreNo() {
    const n = Number(localStorage.getItem("selectedGenreNo"));
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  // [*] API 호출 :  langNo ?? 1을 langNo로 통일
  async function getSubject(genreNo) {
    const res = await axios.get("/saykorean/study/getSubject", {
      params: { genreNo, langNo } // ?? 1 제거
    });
    return asArray(res.data);
  }

  async function getDailyStudy(studyNo) {
    const res = await axios.get("/saykorean/study/getDailyStudy", {
      params: { studyNo, langNo } // ?? 1 제거
    });
    return res.data;
  }

  async function getFirstExam(studyNo) {
    const res = await axios.get("/saykorean/study/exam/first", {
      params: { studyNo, langNo } // ?? 1 제거
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

  // [*] 언어 로드 : 조건 수정
  useEffect(() => {
    // getLang();
    if (!langNo) return; // null 대신 falsy 체크

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

  // 언어 확정되면 주제 목록 로드
  useEffect(() => {
    // 1️⃣ 가드 조건: langNo가 null이면 실행하지 않음
    if (langNo === null) return;

    // 2️⃣ 즉시 실행 비동기 함수 (IIFE 패턴)
    (async () => {
      // 3️⃣ localStorage에서 장르 번호 가져오기
      const genreNo = getGenreNo();
      if (!genreNo) return;// 장르가 없으면 중단
      // 4️⃣ 백엔드 API 호출 (장르와 언어에 맞는 주제 목록 조회)
      const list = await getSubject(genreNo);

      // 5️⃣ 받아온 데이터를 UI용 형태로 변환
      setSubjects(
        list.map((s) => ({
          id: Number(s.studyNo),                      // 주제 번호
          label: s.themeSelected ?? s.themeKo,        // 선택된 언어의 주제명 (없으면 한국어)
          subLabel: s.themeEn ? `(${s.themeEn})` : "" // 영어 부제목 (있으면 괄호 안에)
        }))
      );
    })();
  }, [langNo]);   // langNo가 변경될 때마다 실행

  // 상세 + 예문 로드
  useEffect(() => {
    if (!studyNo || !langNo) return;  // null 대신 !langNo 체크

    (async () => {
      setLoading(true);
      setSubject(await getDailyStudy(Number(studyNo)));
      setExam(await getFirstExam(Number(studyNo)));
      setLoading(false);
    })();
  }, [studyNo, langNo]);

  return (
    <div id="Study" className="homePage">
      {loading && <div className="toast loading">{t("common.loading")}</div>}

      {!studyNo && (
        <PickerSection title={t("study.theme")} items={subjects} activeId={null} />
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
                  🔊 {t("study.korAudio")}
                </button>
              )}
              {exam.enAudioPath && (
                <button className="audio-btn" onClick={() => playAudio(exam.enAudioPath)}>
                  🔊 {t("study.engAudio")}
                </button>
              )}

              <div className="exam-btns">
                <button className="btn-prev" onClick={getPrevExam}>{t("study.prev")}</button>
                <button className="btn-next" onClick={getNextExam}>{t("study.next")}</button>
              </div>
            </div>
          )}

          <button className="goExampleBtn" onClick={successBtn}>
            {t("study.eduEnd")}
          </button>
        </section>
      )}
    </div>
  );
}
