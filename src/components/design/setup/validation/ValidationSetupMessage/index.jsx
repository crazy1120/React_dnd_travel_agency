import React from "react";
import Switch from "@mui/material/Switch";
import { TextField } from "@mui/material";
import styles from "./ValidationSetupMessage.module.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { changeValidationValue } from "~/state/design/designState";

function ValidationSetupMessage({ validationRule, code, rule, t }) {
  const dispatch = useDispatch();

  const isCustomErrorActive = validationRule.isCustomErrorActive || false;

  const languagesList = useSelector((state) => {
    return state.designState.langInfo.languagesList;
  });

  let content = validationRule.content || {};

  const checkedCustomError = (checked) => {
    dispatch(
      changeValidationValue({
        code,
        rule: rule,
        key: "isCustomErrorActive",
        value: checked,
      })
    );
  };

  const onContentUpdate = (key, value) => {
    const newContent = { ...content, [key]: value };
    dispatch(
      changeValidationValue({
        code,
        rule: rule,
        key: "content",
        value: newContent,
      })
    );
  };

  const label = { inputProps: { "aria-label": "Switch validation" } };
  return (
    <>
      <h4>{t("standard_error")}</h4>
      <div className={styles.errorWrapper}>
        <div className={styles.errorLabelWrapper}>
          {languagesList.map((l) => (
            <div
              className={`${styles.errorItem} ${styles.uppercase}`}
              key={l.code}
            >
              {l.code}:
            </div>
          ))}
        </div>
        <div>
          {languagesList.map((l) => (
            <div className={styles.errorItem} key={l.code}>
              {t(rule, { ns: "run", lng: l.code, ...validationRule })}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.title}>
        <h4 className={styles.mt10}>{t("custom_error")}</h4>
        <Switch
          {...label}
          checked={isCustomErrorActive}
          onChange={(event) => checkedCustomError(event.target.checked)}
        />
      </div>
      {isCustomErrorActive ? (
        <div className={styles.errorWrapper}>
          <div className={styles.errorLabelWrapper}>
            {languagesList.map((l) => (
              <div
                className={`${styles.errorItem} ${styles.uppercase}`}
                key={l.code}
              >
                {l.code}:
              </div>
            ))}
          </div>
          <div className={styles.errorItemContainer}>
            {languagesList.map((l) => (
              <div className={styles.errorItem} key={l.code}>
                <TextField
                  size="small"
                  variant="standard"
                  value={content[l.code] || ""}
                  onChange={(event) =>
                    onContentUpdate(l.code, event.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default ValidationSetupMessage;
