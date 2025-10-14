import "../styles/Genre.css";
import { useEffect, useState } from "react";
import axios from "axios";





export default function Genre(props) {

    // 상태 정의 : 무조건 안에 있어야힘
    const [genres, setGenres] = useState([]);                 // 주제 목록
    const [genre, setGenre] = useState(null);                 // 주제 상세
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // 장르 선택 시: localStorage 저장 후 /study 로 이동
    const pickGenre = (genreNo) => {
        // localStorage 저장
        localStorage.setItem("selectedGenreNo", String(genreNo));
        navigate("/study"); // 여기서 주제 목록 페이지로 이동
    };




    // 장르 목록 불러오기
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
                setError("장르 목록을 불러오지 못했어요.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);


    return (<>
        <div className="panel">
            <h3 className="panelTitle">장르 선택</h3>

            {loading && <div className="toast loading">불러오는 중…</div>}
            {error && <div className="toast error">{error}</div>}

            <div className="list">
                {genres.map((g) => (
                    <button
                        key={g.genreNo}                 // 고유 key
                        className="pillBtn"
                        onClick={() => pickGenre(g.genreNo)}  // 이벤트 핸들러 안에서는 훅 호출 금지
                    >
                        <span className="label">{g.genreName}</span>
                    </button>
                ))}
            </div>
        </div>
    </>)

}