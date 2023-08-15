import React from "react";

import styles from "./Page404.module.css";

function Page404() {
  return (
    <div className={styles.pageWarper}>
      <div className={styles.pageTitle}>404</div>
      <div className={styles.pageSubTitle}>Page not found</div>
    </div>
  );
}

export default Page404;
