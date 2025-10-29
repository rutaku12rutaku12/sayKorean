import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/LoadingPage.css";

export default function Page404(props) {

    // navigate, dispatch 함수 가져오기
    const navigate = useNavigate();
    // [*] UI 번역
    const { t } = useTranslation();
    return (<>

        <div id="loading-frame">
            <img style={{ width: '410px' }} src="/img/404Error.png" />

            <div className="homePage__actions"><button onClick={() => navigate("/login")} > {t("page404.toLogin")}</button>
            </div>
        </div>
    </>)

}