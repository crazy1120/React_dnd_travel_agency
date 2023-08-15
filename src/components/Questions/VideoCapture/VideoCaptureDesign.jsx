import { Box } from "@mui/material";
import React from "react";

import styles from "./VideoCaptureDesign.module.css";
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";

function VideoCaptureDesign({ code }) {
  const theme = useTheme();

  const state = useSelector((state) => {
    return state.designState[code];
  });

  const lang = useSelector((state) => {
    return state.designState.langInfo.lang;
  });

  return (
    <Box className={styles.container}>
      <img
        src="/video.png"
        style={{
          maxHeight: "200px",
        }}
      />
      <br />
      {state.showHint && <span>{state.content?.hint?.[lang] || ""}</span>}
    </Box>
  );
}

export default VideoCaptureDesign;
