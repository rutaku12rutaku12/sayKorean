import "../styles/Genre.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useTranslation } from "react-i18next";

// [추가] 장르 번호 → i18n 키 매핑
const GENRE_KEY = {
  1: "genre.name.daily",
  2: "genre.name.society",
  3: "genre.name.media",
  4: "genre.name.kpop",
  5: "genre.name.tradition",
  6: "genre.name.digital",
  7: "genre.name.dialect",
};

export default function Genre(props) {
    
  const navigate = useNavigate();
  const { t } = useTranslation();
    
  const [genres, setGenres] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const saveGenreNo = (selectedGenreNo) => {
    const n = Number(selectedGenreNo?.genreNo ?? selectedGenreNo);
    if (!Number.isFinite(n) || n <= 0) {
      console.warn("Invalid genreNo:", selectedGenreNo);
      return false;
    }
    localStorage.setItem("selectedGenreNo", String(n));
    console.log(selectedGenreNo);
    navigate("/mypage");
    return true;
  };

  const pickGenre = (genreNo) => {
    if (!saveGenreNo(genreNo)) {
      navigate("/mypage");
      return;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("/saykorean/study/getGenre");
        const list = Array.isArray(res.data) ? res.data : [];
        setGenres(list);
      } catch (e) {
        console.error(e);
        setError(t("genre.error.load"));
      } finally {
        setLoading(false);
      }
    })();
  }, [t]); // i18n 변경에도 대응

  return (
    <>
      <div id="Genre" className="homePage">
        <div className="panel">
          <h3 className="panelTitle">{t("genre.title")}</h3>

          {loading && <div className="toast loading">{t("common.loading")}</div>}
          {error && <div className="toast error">{error}</div>}

          <div className="list">
            {genres.map((g) => (
              <button
                key={g.genreNo}
                className="pillBtn"
                onClick={() => pickGenre(g.genreNo)}
              >
                <span className="label">{t(GENRE_KEY[g.genreNo] || "genre.name.fallback")}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
