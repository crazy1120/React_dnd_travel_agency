import React, { useEffect, useRef, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { ThemeProvider, createTheme } from "@mui/material";

import styles from "./DesignSurvey.module.css";
import ContentPanel from "~/components/design/ContentPanel";
import { onDragEnd } from "~/utils/design/dragBehavior";

import { defualtTheme } from "~/constants/theme";
import { I18nextProvider, useTranslation } from "react-i18next";
import { rtlLanguage } from "~/utils/common";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useDispatch, useSelector } from "react-redux";
import { onDrag } from "~/state/design/designState";
import LeftPanel from "~/components/design/LeftPanel";
import RightPanel from "~/components/design/RightPanel";

function DesignSurvey({ hidden }) {
  const { t, i18n } = useTranslation(["design", "run"]);
  const childI18n = i18n.cloneInstance();
  const dispatch = useDispatch();
  const contentRef = useRef(null);

  const headerImage = useSelector((state) => {
    return state.designState["Survey"]?.resources?.headerImage;
  });

  const groups = useSelector((state) => {
    return state.designState["Survey"]?.children;
  });

  const langInfo = useSelector((state) => {
    return state.designState.langInfo;
  });

  const lang = langInfo?.lang;

  const onMainLang = langInfo && langInfo?.onMainLang;

  const theme = useSelector((state) => {
    return state.designState["Survey"]?.theme;
  });

  function changeLanguage(lang) {
    return new Promise((resolve, reject) => {
      const dir = rtlLanguage.includes(lang) ? "rtl" : "ltr";
      const contentPanel = contentRef.current;
      if (contentPanel.dir != dir) {
        contentPanel.dir = dir;
      }
      contentPanel.scrollTop = 0;
      if (lang) {
        childI18n.changeLanguage(lang);
      }
      resolve();
    });
  }

  useEffect(() => {
    if (lang && childI18n && lang != childI18n.language) {
      childI18n.changeLanguage(lang);
    }
  }, [lang, childI18n]);

  useEffect(() => {
    if (contentRef.current) {
      changeLanguage(lang);
    }
  }, [lang, contentRef]);

  const cacheRtl = createCache({
    key: rtlLanguage.includes(lang) ? "muirtl" : "muiltr",
    stylisPlugins: rtlLanguage.includes(lang) ? [prefixer, rtlPlugin] : null,
  });

  const surveyTheme = React.useCallback(
    createTheme({
      ...defualtTheme(theme),
      direction: rtlLanguage.includes(lang) ? "rtl" : "ltr",
    }),
    [theme]
  );
  return (
    <div hidden={hidden} className={styles.mainContainer}>
      <DragDropContext
        onDragEnd={(event) => {
          onDragEnd(event, (payload) => {
            dispatch(onDrag(payload));
          });
        }}
      >
        {onMainLang && <LeftPanel t={t} />}
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={surveyTheme}>
            <I18nextProvider i18n={childI18n}>
              <ContentPanelMemo
                ref={contentRef}
                className={styles.contentPanel}
                headerImage={headerImage}
                groups={groups}
              />
            </I18nextProvider>
          </ThemeProvider>
        </CacheProvider>
        {onMainLang && <RightPanel t={t} />}
      </DragDropContext>
    </div>
  );
}

const ContentPanelMemo = React.memo(ContentPanel);

export default DesignSurvey;
