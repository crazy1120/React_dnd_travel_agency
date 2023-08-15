import React from "react";
import Switch from "@mui/material/Switch";
import styles from "./ToggleValue.module.css";
import { useDispatch } from "react-redux";
import { changeAttribute, changeTimeFormats } from "~/state/design/designState";
import { useSelector } from "react-redux";

function ToggleValue({ label, code, rule }) {
  const dispatch = useDispatch();

  const value = useSelector((state) => {
    return state.designState[code][rule] || false;
  });

  const onChange = (value) => {
    dispatch(changeAttribute({ code, key: rule, value }));
  };

  const swithLabel = { inputProps: { "aria-label": "Switch demo" } };

  return (
    <div className={styles.toggleValue}>
      <h4>{label}</h4>
      <Switch
        {...swithLabel}
        checked={value}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
      />
    </div>
  );
}

export default ToggleValue;
