import React from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { changeAttribute } from "~/state/design/designState";
import CustomPriority from "../CustomPriority";
import styles from "./OrderPrioritySetup.module.css";
import CustomRandom from "../CustomRandom";

export default function OrderPrioritySetup({ t, rule, code }) {
  const dispatch = useDispatch();

  const value = useSelector((state) => {
    return state.designState[code][rule] || "NONE";
  });

  let title = "";
  let labels = [];
  let values = [];

  switch (rule) {
    case "randomize_questions":
      title = t("questions_order");
      labels = [
        t("as_is"),
        t("random_order"),
        t("flip_order"),
        t("custom_random"),
      ];
      values = ["NONE", "RANDOM", "FLIP", "custom"];
      break;
    case "prioritize_questions":
      title = t("questions_priority");
      labels = [t("no_priority"), t("prioritise_questions")];
      values = ["NONE", "prioritize"];
      break;
    case "randomize_groups":
      title = t("groups_order");
      labels = [
        t("as_is"),
        t("random_order"),
        t("flip_order"),
        t("custom_random"),
      ];
      values = ["NONE", "RANDOM", "FLIP", "custom"];
      break;
    case "prioritize_groups":
      title = t("groups_priority");
      labels = [t("no_priority"), t("prioritise_groups")];
      values = ["NONE", "prioritize"];
      break;
    case "randomize_options":
      title = t("options_order");
      labels = [
        t("as_is"),
        t("random_order"),
        t("flip_order"),
        t("sort_by_label"),
        t("custom_random"),
      ];
      values = ["NONE", "RANDOM", "FLIP", "ALPHA", "custom"];
      break;
    case "prioritize_options":
      title = t("options_priority");
      labels = [t("no_priority"), t("prioritise_options")];
      values = ["NONE", "prioritize"];
      break;
    case "randomize_rows":
      title = t("rows_order");
      labels = [
        t("as_is"),
        t("random_order"),
        t("flip_order"),
        t("sort_by_label"),
        t("custom_random"),
      ];
      values = ["NONE", "RANDOM", "FLIP", "ALPHA", "custom"];
      break;
    case "prioritize_rows":
      title = t("rows_priority");
      labels = [t("no_priority"), t("prioritise_rows")];
      values = ["NONE", "prioritize"];
      break;
    case "randomize_columns":
      title = t("columns_order");
      labels = [
        t("as_is"),
        t("random_order"),
        t("flip_order"),
        t("sort_by_label"),
        t("custom_random"),
      ];
      values = ["NONE", "RANDOM", "FLIP", "ALPHA", "custom"];
      break;
    case "prioritize_columns":
      title = t("columns_priority");
      labels = [t("no_priority"), t("prioritise_columns")];
      values = ["NONE", "prioritize"];
      break;
  }

  const onChange = (value) => {
    const finalValue = value == "NONE" ? undefined : value;
    dispatch(changeAttribute({ code, key: rule, value: finalValue }));
  };

  return (
    <>
      <h4>{title}</h4>
      <FormControl className={styles.selectValue} variant="standard" fullWidth>
        <Select
          id="select-value"
          value={value}
          label="Select Value"
          onChange={(e) => {
            onChange(e.target.value);
          }}
        >
          {labels.map((element, index) => {
            return (
              <MenuItem key={element} value={values[index]}>
                {element}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {value == "custom" &&
        [
          "randomize_questions",
          "randomize_options",
          "randomize_groups",
        ].indexOf(rule) !== -1 && <CustomRandom label="" code={code} t={t} />}
      {value == "custom" && "randomize_rows" == rule && (
        <CustomRandom label="" type="row" code={code} t={t} />
      )}
      {value == "prioritize" && "prioritize_rows" == rule && (
        <CustomPriority label="" type="row" code={code} t={t} />
      )}
      {value == "custom" && "randomize_columns" == rule && (
        <CustomRandom label="" type="column" code={code} t={t} />
      )}
      {value == "prioritize" && "prioritize_columns" == rule && (
        <CustomPriority label="" type="column" code={code} t={t} />
      )}
      {value == "prioritize" &&
        [
          "prioritize_questions",
          "prioritize_options",
          "prioritize_groups",
        ].indexOf(rule) !== -1 && <CustomPriority label="" code={code} t={t} />}
    </>
  );
}
