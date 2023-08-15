import React from "react";
import styles from "./NewComponentsItem.module.css";

function NewComponentsItem({
  item,
  t,
  draggableProps,
  dragHandleProps,
  snapshot,
  providedref,
}) {
  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      snapshot={snapshot}
      ref={providedref}
      className={styles.leftPannelItem}
    >
      <div className={styles.icon}>{item.icon}</div>
      <span className={styles.title}>
        {t("component_" + item.type + "_title")}
      </span>
      {item.offlineOnly && (
        <span className={styles.offlineOnly}>{t("offline_only")}</span>
      )}
    </div>
  );
}

export default NewComponentsItem;
