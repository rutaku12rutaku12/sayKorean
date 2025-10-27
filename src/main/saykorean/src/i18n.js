import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    // API에서 받는다 (단일 JSON)
    backend: {
      loadPath: "http://localhost:8080/saykorean/i18n/{{lng}}"
    },
    // 네임스페이스 방식을 쓸 거면:
    // backend: { loadPath: "/saykorean/i18n/{{lng}}/{{ns}}" },
    // ns: ["common", "home"],
    // defaultNS: "common",

    lng: localStorage.getItem("lang") || "ko",
    fallbackLng: "en",
    interpolation: { escapeValue: false },

    // 개발 중 디버깅 도움
    debug: false,
  });

export default i18n;
