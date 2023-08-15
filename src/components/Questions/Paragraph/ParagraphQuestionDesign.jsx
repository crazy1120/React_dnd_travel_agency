import React from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";

import styles from "./ParagraphQuestionDesign.module.css";
import { useSelector } from "react-redux";

function ParagraphQuestionDesign({ code, t }) {
  const state = useSelector((state) => {
    return state.designState[code];
  });

  const lang = useSelector((state) => {
    return state.designState.langInfo.lang;
  });

  return (
    <div className={styles.questionItem}>
      <TextareaAutosize
        disabled
        className={styles.paragraph}
        required={
          state.validation?.validation_required?.isActive ? true : false
        }
        placeholder={state.showHint && (state.content?.hint?.[lang] || "")}
        minRows={state.minRows || 2}
        value={""}
      />
      {state.showWordCount ? (
        <div className={styles.wordCount}>
          <span>{t("word_count", { lng: lang, count: 0 })}</span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ParagraphQuestionDesign;
