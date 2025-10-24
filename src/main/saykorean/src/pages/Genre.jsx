import "../styles/Genre.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;




export default function Genre(props) {
    
    const navigate = useNavigate();
    

    // 상태 정의 : 무조건 안에 있어야힘
    const [genres, setGenres] = useState([]);  // 장르 목록;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // 장르번호 localStorage에 안전하게 저장하기 위한 함수
    const saveGenreNo = (selectedGenreNo) => {
        const n = Number( selectedGenreNo?.genreNo ?? selectedGenreNo );  // 객체면 .genreNo, 아니면 그대로
        if (!Number.isFinite(n) || n <= 0) { // n이 음수면
            console.warn("Invalid genreNo:", selectedGenreNo);
            return false;
        }
        localStorage.setItem("selectedGenreNo", String(n)); // 항상 문자열로

        return true;
    };

    // 사용
    const saved = Number(localStorage.getItem("selectedGenreNo"));
    console.log( saved );
    const pickGenre = (genreNo) => {
        if (!saveGenreNo( genreNo ))
            navigate("/mypage");
            return;
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
        <div id="Genre">
            <div className="panel">
                <h3 className="panelTitle">장르 선택</h3>

                {loading && <div className="toast loading">불러오는 중…</div>}
                {error && <div className="toast error">{error}</div>}

                <div className="list">
                    {genres.map((g) => (
                        <button
                            key={g.genreNo}                 // 고유 key
                            className="pillBtn"
                            onClick={() => pickGenre(g.genreNo)}
                        >
                            <span className="label">{g.genreName}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </>)

}