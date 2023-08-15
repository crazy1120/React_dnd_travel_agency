import React from "react";
import styles from "./RandomItemDisplay.module.css";
import { Card, IconButton } from "@mui/material";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteOutlineIcon from "@mui/icons-material/Delete";

export const randomOptionToText = (randomOption, t) => {
  switch (randomOption) {
    case "ALPHA":
      return t("sort_by_label");
    case "RANDOM":
      return t("random_order");
    case "FLIP":
      return t("flip_order");
  }
  throw "unidentified randomOption: " + randomOption;
};

export default function RandomItemDisplay(props) {
  const t = props.t;

  return (
    <Card
      className={`${styles.randomItem} ${
        props.isBeingEdited ? styles.highlighted : ""
      }`}
    >
      <div className={styles.randomHeader}>
        <h4 className={styles.title}>
          {randomOptionToText(props.randomOption, t)}
        </h4>
        <div className={styles.action}>
          <IconButton onClick={() => props.onEditClicked(props.index)}>
            <ModeIcon className={styles.settingIcon} />
          </IconButton>
          <IconButton onClick={() => props.onDeleteClicked(props.index)}>
            <DeleteOutlineIcon className={styles.settingIcon} />
          </IconButton>
        </div>
      </div>

      <ul className={styles.list}>
        {props.data &&
          props.data.map((code, index) => {
            return (
              <RandomisedChildDisplay
                label={props.getChildLabelByCode(code)}
                code={code}
                childrenCodes={props.childrenCodes}
                key={index}
              />
            );
          })}
      </ul>
    </Card>
  );
}

function RandomisedChildDisplay({ code, label, childrenCodes }) {
  return (
    <li
      className={
        childrenCodes.indexOf(code) !== -1
          ? styles.listItem
          : styles.listItemError
      }
    >
      <div className={`${styles.content} ${styles.label}`}>
        {code}: {label}
      </div>
    </li>
  );
}
