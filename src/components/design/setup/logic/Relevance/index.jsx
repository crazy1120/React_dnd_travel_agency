import { FormControl, MenuItem, Select, Button } from "@mui/material";
import LogicBuilder from "~/components/design/setup/logic/LogicBuilder";
import { changeRelevance } from "~/state/design/designState";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { buildFields } from "../LogicBuilder/buildFields";
import styles from "./Relevance.module.css";
import { Trans } from "react-i18next";

function Relevance({ code, t }) {
  const dispatch = useDispatch();

  const [logicDialogOpen, setLogicDialogOpen] = useState(false);
  const langInfo = useSelector((state) => {
    return state.designState.langInfo;
  });
  const state = useSelector((state) => {
    return state.designState[code];
  });
  console.log(langInfo);
  const fields = useSelector((state) => {
    return buildFields(
      state.designState.componentIndex,
      code,
      state.designState,
      langInfo.mainLang,
      langInfo.languagesList.map((lang) => lang.code)
    );
  });

  const instruction = state.instructionList?.find(
    (instruction) => instruction.code == "conditional_relevance"
  );
  const errors = instruction?.errors || [];
  const hasErrors = errors.length > 0;
  const logic = state.relevance?.logic;
  const logicDisabled = !hasErrors && Object.keys(fields).length > 0;

  const [rule, setRule] = useState(state.relevance?.rule || "show_always");
  const shouldHaveLogic = rule == "show_if" || rule == "hide_if";

  const onRuleChange = (rule) => {
    setRule(rule);
    switch (rule) {
      case "show_always":
        reset();
        return;
      case "hide_always":
        dispatch(
          changeRelevance({
            code,
            key: "relevance",
            value: { logic: undefined, rule: rule },
          })
        );
        return;
      case "show_if":
      case "hide_if":
        if (logic?.rule != "show_if" && logic?.rule != "hide_if") {
          setLogicDialogOpen(true);
        }
        if (logic) {
          dispatch(
            changeRelevance({
              code,
              key: "relevance",
              value: { logic: logic, rule: rule },
            })
          );
        }
        return;
      default:
        break;
    }
  };

  const reset = () =>
    dispatch(
      changeRelevance({
        code,
        key: "relevance",
        value: { logic: undefined, rule: "show_always" },
      })
    );

  const onLogicChange = (logic) => {
    setLogicDialogOpen(false);
    if (shouldHaveLogic) {
      dispatch(
        changeRelevance({
          code,
          key: "relevance",
          value: { logic: logic, rule: rule },
        })
      );
    }
  };

  return (
    <div className={`${hasErrors ? styles.relevanceError : ""}`}>
      <FormControl variant="standard" fullWidth>
        <Select
          id="show-hide-select"
          value={rule}
          label="Age"
          onChange={(e) => onRuleChange(e.target.value)}
        >
          <MenuItem disabled={hasErrors} key="show_always" value="show_always">
            {t("show_always")}
          </MenuItem>
          <MenuItem disabled={!logicDisabled} key="show_if" value="show_if">
            {t("show_if")}
          </MenuItem>
          <MenuItem disabled={!logicDisabled} key="hide_if" value="hide_if">
            {t("hide_if")}
          </MenuItem>
          <MenuItem disabled={hasErrors} key="hide_always" value="hide_always">
            {t("hide_always")}
          </MenuItem>
        </Select>
      </FormControl>
      {!hasErrors && shouldHaveLogic && (
        <LogicBuilder
          title={
            rule == "show_if" ? t("condition_to_show") : t("condition_to_hide")
          }
          onChange={onLogicChange}
          onDialogStateChanged={(state) => setLogicDialogOpen(state)}
          fields={fields}
          t={t}
          dialogOpen={logicDialogOpen}
          logic={logic}
        />
      )}

      {hasErrors ? (
        <div className={styles.errorContainer}>
          <Trans t={t} i18nKey="wrong_logic_err" />
          <Button variant="contained" onClick={() => reset()}>
            OK
          </Button>
        </div>
      ) : (
        ""
      )}
      {shouldHaveLogic && !logic ? (
        <div>
          <Trans t={t} i18nKey="no_logic_err" />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
export default Relevance;
