import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

import styles from "./LoadingIndicator.module.css";

export default function LoadingIndicator() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingWrapper}>
        <CircularProgress />
      </div>
    </div>
  );
}
