import { ThemeProvider, createTheme } from "@mui/material";
import CookiesService from "~/services/CookiesService";
import React, { useEffect } from "react";
import { cacheRtl, rtlLanguage, setLangFromSession } from "~/utils/common";
import { CacheProvider } from "@emotion/react";
import { useTranslation } from "react-i18next";

export const ManagePageWrapper = ({ children }) => {
  const lang = CookiesService.getValue("lang");

  const { i18n } = useTranslation("manage");

  const rtlTheme = React.useCallback(
    createTheme({
      direction: rtlLanguage.includes(lang) ? "rtl" : "ltr",
    }),
    [lang]
  );

  useEffect(() => {
    document.body.style.overflow = "visible";
    setLangFromSession(i18n);
  }, [lang]);

  return (
    <CacheProvider value={cacheRtl(lang)}>
      <ThemeProvider theme={rtlTheme}>{children}</ThemeProvider>
    </CacheProvider>
  );
};
