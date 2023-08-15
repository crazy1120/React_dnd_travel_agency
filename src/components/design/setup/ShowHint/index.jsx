import React from "react";
import Switch from "@mui/material/Switch";
import styles from "./ShowHint.module.css";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { changeAttribute, changeContent } from "~/state/design/designState";

function ShowHint({ code, t }) {
  const dispatch = useDispatch();

  const showHint = useSelector((state) => {
    return state.designState[code].showHint || false;
  });

  const setCheckedHint = (value) => {
    dispatch(changeAttribute({ code, key: "showHint", value }));
  };

  return (
    <>
      <div className={styles.showHint}>
        <h4>{t("show_question_hint")}</h4>
        <Switch
          checked={showHint}
          onChange={(event) => setCheckedHint(event.target.checked)}
        />
      </div>
      {showHint && <ContentEditor code={code} objectName="hint" />}
    </>
  );
}

export function ContentEditor({ code, objectName, title }) {
  const dispatch = useDispatch();
  const setContentValue = (lang, value) => {
    dispatch(changeContent({ code, key: objectName, lang, value }));
  };

  const languagesList = useSelector((state) => {
    return state.designState.langInfo.languagesList;
  });

  const hintObj = useSelector((state) => {
    return state.designState[code].content?.[objectName];
  });

  return (
    <>
      {title && <h4>{title}</h4>}
      {languagesList.map((lang) => {
        return (
          <div className={styles.inputValue} key={lang.code}>
            <TextField
              label={lang.name}
              variant="standard"
              type="text"
              value={hintObj?.[lang.code] || ""}
              onChange={(event) =>
                setContentValue(lang.code, event.target.value)
              }
            />
          </div>
        );
      })}
    </>
  );
}

export default ShowHint;
