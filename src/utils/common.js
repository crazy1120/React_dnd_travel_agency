import createCache from "@emotion/cache";
import CookiesService from "~/services/CookiesService";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

export const rtlLanguage = ["ar"];

export const setLangFromSession = (i18n) => {
  const lang = CookiesService.getValue("lang");
  if (!lang) {
    return;
  }
  lang && i18n.changeLanguage(lang);
  setDocumentLang(lang);
};

export const setDocumentLang = (lang) => {
  const dir = rtlLanguage.includes(lang) ? "rtl" : "ltr";
  document.documentElement.setAttribute("lang", lang);
  document.dir = dir;
};

export const getDirFromSession = () => {
  const lang = CookiesService.getValue("lang");
  return rtlLanguage.includes(lang) ? "rtl" : "ltr";
};

export const cacheRtl = (lang) =>
  createCache({
    key: rtlLanguage.includes(lang) ? "muirtl" : "muiltr",
    stylisPlugins: rtlLanguage.includes(lang) ? [prefixer, rtlPlugin] : null,
  });
