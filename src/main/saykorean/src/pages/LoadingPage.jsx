import "../styles/LoadingPage.css";
export default function LoadingPage( props ){

    return (
    <div id="loading-frame">
      <div className="image-container">
        <h1>"숭레문"</h1>
        <img width="410px" src="/img/loading_img/1_loading_img.png" />
        <div className="text-on-image">
          <h3>남대문이라고도 불립니다.</h3>
        </div>
      </div>

      <div id="loading-footer">
        <h3>토돌이 당근 수집하는중</h3>
      </div>
    </div>
  );


    
}


