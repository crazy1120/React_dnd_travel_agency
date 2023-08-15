import { Box } from "@mui/material";
import React from "react";

import styles from "./SignatureDesign.module.css";

function SignatureDesign() {
  return (
    <Box
      className={styles.signatureCanvas}
      sx={{ backgroundColor: "background.default" }}
    >
      <img
        src="/signature.png"
        style={{
          backgroundColor: "rgba(255,255,255,255)",
          width: "80%",
          maxWidth: "500px",
          height: "200px",
        }}
      />
    </Box>
  );
}

export default SignatureDesign;
