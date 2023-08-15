import React from "react";
import styles from "./PriorityItemDisplay.module.css";
import { Card, IconButton } from "@mui/material";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteOutlineIcon from "@mui/icons-material/Delete";

export default function PriorityItemDisplay(props) {
  return (
    <Card
      className={`${styles.randomItem} ${
        props.isBeingEdited ? styles.highlighted : ""
      }`}
    >
      <div className={styles.randomHeader}>
        <h4 className={styles.title}>{props.t("prioritise")}</h4>
        <div className={styles.action}>
          <IconButton onClick={() => props.onEditClicked(props.index)}>
            <ModeIcon className={styles.settingIcon} />
          </IconButton>
          <IconButton onClick={() => props.onDeleteClicked(props.index)}>
            <DeleteOutlineIcon className={styles.settingIcon} />
          </IconButton>
        </div>
      </div>
      <div className={styles.randomBody}>
        {props.t("priority_show_limit_from_count", {
          limit: props.data.limit,
          count: props.data.weights?.length,
        })}
        <ul className={styles.list}>
          {props.data &&
            props.data.weights &&
            props.data.weights.map((nestedItem, index) => {
              return (
                <PrioritisedChildDisplay
                  label={props.getChildLabelByCode(nestedItem.code)}
                  code={nestedItem.code}
                  childrenCodes={props.childrenCodes}
                  weight={nestedItem.weight}
                  key={index}
                />
              );
            })}
        </ul>
      </div>
    </Card>
  );
}

function PrioritisedChildDisplay({ code, label, weight, childrenCodes }) {
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
      <div className={styles.weight}>
        <span>{weight}</span>
      </div>
    </li>
  );
}
