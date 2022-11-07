import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import common from "./locales/en/common.json";
import signin from "./locales/en/signin.json";
import permit from "./locales/en/permit.json";
import common_tr from "./locales/tr/common.json";
import signin_tr from "./locales/tr/signin.json";

export const defaultNS = "common";
export const resources = {
  en: {
    common,
    signin,
    permit
  },
  tr: {
    common: common_tr,
    signin: signin_tr
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: window.localStorage.defaultLanguage || "en",
    ns: ["common", "signin", "permit"],
    defaultNS,
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
