import React, { useState } from "react";
import styles from "./RandomItemSetup.module.css";
import {
  Button,
  Card,
  Checkbox,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";

export default function RandomItemSetup(props) {
  const t = props.t;

  const [checked, setChecked] = useState(props.checked);
  const [randomOption, setRandomOption] = useState(props.randomOption);

  const isSubmitEnabled = () => {
    return checked.filter((x) => x).length >= 2;
  };

  const labels = [t("random_order"), t("flip_order"), t("sort_by_label")];
  const values = ["RANDOM", "FLIP", "ALPHA"];

  const onSubmit = () => {
    const selected = checked.filter((x) => x).length;
    if (selected < 2) {
      return false;
    }

    const submitList = checked.reduce((sum, el, i) => {
      if (el) {
        sum.push(props.data[i]);
      }
      return sum;
    }, []);
    props.onSubmit(submitList, randomOption);
  };

  const handleCheckboxChange = (e, i) => {
    const cloneChecked = [...checked];
    cloneChecked[i] = e;
    setChecked([...cloneChecked]);
  };

  return (
    <Card className={styles.randomItem}>
      <h4 className={styles.title}>{props.title}</h4>

      <FormControl variant="standard" fullWidth>
        <Select
          id="select-value"
          value={randomOption}
          label="Select Value"
          onChange={(e) => {
            setRandomOption(e.target.value);
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

      <ul className={styles.list}>
        {props.data &&
          props.data.map((code, index) => (
            <RandomisedChildDisplay
              key={index}
              code={code}
              handleChange={(checked) => handleCheckboxChange(checked, index)}
              checked={checked?.[index] || false}
              label={props.getChildLabelByCode(code)}
            />
          ))}
      </ul>

      <div className={styles.randomAction}>
        <Button variant="text" onClick={(e) => props.onCancel()}>
          {t("cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={(e) => onSubmit(checked, randomOption)}
          disabled={!isSubmitEnabled()}
        >
          {t("submit")}
        </Button>
      </div>
    </Card>
  );
}

function RandomisedChildDisplay({ code, label, checked, handleChange }) {
  return (
    <li className={styles.listItem}>
      <Checkbox
        checked={checked}
        onChange={(e) => handleChange(e.target.checked)}
      />
      {code}: {label}
    </li>
  );
}
