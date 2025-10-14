import "../styles/Study.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// 응답을 배열로 표준화
function asArray(payload) {
  // 만약 문자열(JSON 텍스트)이면 JSON으로 파싱 시도
  if ( typeof payload === "string" ) {
    try {
    payload = JSON.parse( payload ); 
    }catch{

    } 
  } // if end

  if ( Array.isArray( payload ) ) return payload;
  
  if ( payload && typeof payload === "object" ) {
    // 객체라면 자주 쓰는 키(data/list/items/content/result) 중 배열을 찾아 반환
    for ( const k of ["data","list","items","content","result"] ) {
      if ( Array.isArray( payload[k] ) ) return payload[k];
    }
  }
  // 위 조건에 모두 해당 안 되면 빈 배열 리턴
  return [];
}

// ------------------------------------------------------
// 재사용 컴포넌트: 제목 + 버튼 리스트(주제 목록)를 그려주는 섹션
// props:
//   - title: 섹션 제목
//   - items: {id,label,subLabel} 형태의 배열
//   - activeId: 현재 선택된 항목의 id (활성화 표시용)
// ------------------------------------------------------
function PickerSection( { title, items, activeId } ) {
  return (
    <section className="panel"> {/* 패널 UI 래퍼 */}
      <h3 className="panelTitle">{title}</h3> {/* 섹션 제목 */}
      <div className="list"> {/* 버튼 리스트 컨테이너 */}
        {( Array.isArray(items) ? items : [] ).map(( it, idx ) => (
          <Link
            key={`${title}-${it?.id ?? 'noid'}-${idx}`} // 각 항목의 고유 key(중복 방지)
            to={`/study/${it.id}`} // 클릭 시 상세 페이지로 라우팅
            className={`pillBtn ${Number(activeId) === Number(it.id) ? "active" : ""}`} // 활성화 스타일
          >
            <span className="label">{it.label}</span> {/* 기본 라벨(한글 주제 등) */}
            {it.subLabel && <span className="sub">{it.subLabel}</span>} {/* 보조 라벨(영문 주제 등) */}
          </Link>
        ))}
      </div>
    </section>
  );
}


// ------------------------------------------------------
// 메인 컴포넌트: Study
//  - 1) 내 장르를 서버에서 읽어옴
//  - 2) 그 장르의 '주제 목록'을 보여줌
//  - 3) 특정 주제가 선택되면(URL에 studyNo) '주제 상세 + 예문'을 로드해서 표시
// ------------------------------------------------------
export default function Study() {
  const navigate = useNavigate();
  const { studyNo } = useParams(); // URL에서 /study/:studyNo 의 값을 읽음 

  // 상태 정의
  const [ selectedGenreNo, setSelectedGenreNo ] = useState(null); // 내 장르 (DB에서 조회)
  const [ subjects, setSubjects ] = useState( [] );                 // 주제 목록
  const [ subject, setSubject ] = useState( null );                 // 주제 상세
  const [ examples, setExamples ] = useState( [] );                 // 예문
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState( "" );

  // --------------------------
  // API: 내 장르 조회 (세션 기반)
  //  - 백엔드: GET /saykorean/me/genre
  //  - 숫자 또는 { genreNo: n } 형태 모두 호환
  // --------------------------
  async function fetchMyGenreNo() {
    const res = await axios.get( "/saykorean/me/genre" ); // ← 백엔드 경로와 일치
    const g = res.data;
    return ( typeof g === "number" ) ? g : g?.genreNo ?? null;
  }

  // --------------------------
  // API: 장르별 주제 목록 조회
  //  - 백엔드: GET /saykorean/study/getSubject?genreNo=...
  //  - 배열/객체 등 응답을 asArray로 표준화
  // --------------------------
  async function fetchSubjectsByGenre( genreNo ) {
    const res = await axios.get(
       "/saykorean/study/getSubject",
       { params: { genreNo } }
       );
    return asArray( res.data );
  }

  // --------------------------
  // API: 주제 상세 조회
  //  - 백엔드: GET /saykorean/study/getDailyStudy?studyNo=...
  // --------------------------
  async function fetchSubject(studyNoValue) {
    const res = await axios.get(
       "/saykorean/study/getDailyStudy",
       { params: { studyNo: studyNoValue } }
       );
    return res.data;
  }


  // ------------------------------------------------------
  // 마운트 시 1회 실행:
  //  - 내 장르 번호를 서버에서 가져오고
  //  - 그 장르의 주제 목록을 불러와서 subjects 상태에 세팅
  // ------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        setLoading(true); // 로딩 시작
        setError(""); // 에러 초기화

        // 세션 기반으로 내 장르 가져오기
        const myGenre = await fetchMyGenreNo(); 


        // 장르번호가 유효하지 않으면 에러
        if ( !Number.isFinite( Number( myGenre ) ) ) { 
          setError("로그인이 필요하거나 선호 장르가 설정되지 않았습니다.");
          return;
        }

        // 장르번호 상태 저장
        setSelectedGenreNo( myGenre ); 

        // 장르에 해당하는 주제 목록 조회
        const list = await fetchSubjectsByGenre( myGenre) ; 

        //  서버에서 내려준 주제 목록을 화면에 맞는 형태로 정규화
        //    - id: 숫자(PK)로 통일
        //    - label: 표시에 쓸 문자열(한글/영문)
        //    - subLabel: 보조 표기(영문 제목 등)
        const seen = new Set(); // 중복 id 방지
        const normalized = [];
        for ( const s of (Array.isArray(list) ? list : []) ) {
          // 여러 이름 가능성 대비: studyNo 또는 id/대문자/과거명(themeNo)까지 커버
          const rawId = s?.studyNo ?? s?.id ?? s?.STUDY_NO ?? s?.themeNo;
          const id = Number(rawId); // 숫자로 변환
          // 유효하지 않은 id(비숫자/0/음수)나 중복은 건너뛰기
          if ( !Number.isFinite(id) || id <= 0 || seen.has(id) ) continue;
          seen.add(id);
          normalized.push({
            id,  // 클릭 시 라우팅에 사용
            // 한글 없으면 영문, 그래도 없으면 번호로 표시
            label: s.themeKo || s.themeEn || `주제 #${id}`,
            // 영문이 있으면 괄호로 보조표시
            subLabel: s.themeEn ? `(${s.themeEn})` : ""
          });
        }
         // 주제 목록 상태 업데이트
        setSubjects( normalized );
      } catch (e) {
        // 인증 실패(세션 없음)일 경우 사용자에게 로그인 안내
        if ( e?.response?.status === 401 ) setError( "로그인이 필요합니다." );
        else {
          console.error( e );
          // 사용자 메시지
          setError( "초기 데이터를 불러오는 중 문제가 발생했어요." );
        }
      } finally {
        // 로딩 종료
        setLoading( false );
      }
    })();
    // 의존성 배열 빈 값 → 컴포넌트 마운트 시 1회만 실행
  }, []);

  // ------------------------------------------------------
  // URL이 /study/:studyNo 형태일 때만 상세/예문 로드
  //  - 목록 화면(/study)에서는 상세 비움
  // ------------------------------------------------------
  useEffect(() => {
    if ( !studyNo ) // URL에 studyNo가 없으면(=목록 화면)
      { setSubject( null ); // 상세 초기화
        setExamples( [] ); // 예문 초기화
        return; 
      }

       // URL 파라미터를 숫자로 변환
    const n = Number( studyNo );  
    // 유효하지 않은 숫자이면 에러
    if (!Number.isFinite( n )) {
      setError( "잘못된 학습 번호입니다." ); 
      return; 
    }

    (async () => { // 비동기 즉시실행으로 상세/예문 요청
      try {
        setLoading( true );  // 로딩 시작
        setError( "" );      // 에러 초기화
        const s = await fetchSubject( n ); // 주제 상세 가져오기
        setSubject( s ); // 상세 상태 저장
      } catch ( e ) {
        console.error( e );
        setError( "학습 데이터를 불러오는 중 문제가 발생했어요." ); // 사용자 메시지
      } finally {
        setLoading( false ); // 로딩 종료
      }
    })(); 
    // URL의 studyNo가 바뀔 때마다 다시 실행
  }, [ studyNo ]); 



  // ------------------------------------------------------
  // 렌더링
  //  - 상단: 로딩/에러 토스트
  //  - 좌측(또는 상단): 주제 목록(클릭 → /study/:id 로 이동)
  //  - 우측(또는 하단): studyNo 있을 때만 주제 상세 + 예문
  // ------------------------------------------------------
  return (
    <div id="Study">
      { loading && <div className="toast loading">불러오는 중…</div> } {/* 로딩 표시 */}
      { error && <div className="toast error">{error}</div> } {/* 에러 표시 */}

      {/* 내 장르로 주제 목록만 먼저 보여주고, 클릭 시 상세 페이지로 이동 */}
      <PickerSection
        title={ selectedGenreNo ? `주제 선택 (장르 #${selectedGenreNo})` : "주제 선택" }
        items={subjects}
        activeId={ Number(studyNo) || null }
      />

      {/* 주제 상세 + 예문: studyNo 있을 때만 */}
      {studyNo && subject && (
        <section className="panel detail">
          <div className="mainTheme">
            <img className="studyImg" src="/img/rabbit.png" alt="rabbit" /> {/* 썸네일 이미지 */}
            <h3>{subject?.themeKo ?? subject?.themeEn ?? "제목 없음"}</h3>
          </div>

          { /*  주제 해설 영역 추가 */ }
          {subject?.commenKo && (
            <div className="commenKo">
              <p>{subject.commenKo}</p>
            </div>
          )}


          { /* 예문 페이지로 이동하는 버튼 */ }
          <button
            className="goExampleBtn"
            onClick={() => navigate(`/exampleList/${studyNo}`)} >
              다음
          </button>


        </section>
      )}
    </div>
  );
}