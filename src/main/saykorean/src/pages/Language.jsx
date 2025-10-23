import axios from "axios";
import { useEffect, useState } from "react"

export default function Language( props ){

    // 상태 정의
    const [language, setLanguage] = useState([]);
    const [loading, setLoading] = useState(false);
    const[error, setError] = useState("");

    // localStorage에 안전하게 저장하기 위한 함수
    const saveLangNo = ( selectedLangNo ) => {
        const n = Number( selectedLangNo?.langNo??selectedLangNo );
        if( !Number.isFinite(n) || n <= 0 ){
            console.warn("Invaild langNo: ", selectedLangNo );
            return false;
        }
        localStorage.setItem( "selectedLangNo" , String(n) );
        return true;
    ;}
    
    // 사용
    const saved = Number( localStorage.getItem( "selectedLangNo" ) );
    console.log( saved );
    const pickLangNo = ( langNo ) => {
        if( !saveLangNo( langNo ) ) return;
    };

    useEffect( () => {
        (async() => {
            try{
                setLoading( true );
                setError("");
                const res = await axios.get("/saykorean/test/getLang");
                const list = Array.isArray( res.data ) ? res.data : [];
                setLanguage(list);
            }catch( e ){
                console.error( e );
                setError( "언어 목록을 받지 못했어요." );
            }finally{
                setLoading(false);
            }
        })();
    }, []);
    

    return(<>
    <div id="Language">
        <div className="panel">
            <h3 className="panelTitle">언어 선택</h3>

            {loading && <div className="toast loading">불러오는 중...</div>}
            {error && <div className="toast error">{error}</div>}

            <div className="list">
                {language.map( (l) => {
                    <button
                    key={l.langNo}
                    className="pillBtn"
                    onClick={ () => pickLangNo(l.langNo) }>
                        <span className="lable">{l.langName}</span>
                    </button>
                })}
            </div>
        </div>
    </div>
    
    
    </>)
}