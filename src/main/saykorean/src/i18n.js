
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

// 언어 코드는 DB의 langNo와 매핑
i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: "/saykorean/i18n/{{lng}}", // 백엔드가 리턴하는 번역 JSON
    },
    lng: localStorage.getItem("lang") || "ko",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
