import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { rtlLanguage } from "~/utils/common";

export default function ProcessedError({ error, variant, handleClose }) {
  const [dir, setDir] = useState("ltr");
  const { t, i18n } = useTranslation("manage");

  useEffect(() => {
    if (rtlLanguage.includes(i18n.language)) {
      setDir("rtl");
    } else {
      setDir("ltr");
    }
  }, [i18n.language]);

  if (variant === "toast") {
    return (
      <Snackbar open={true} autoHideDuration={2000} onClose={handleClose}>
        <Alert
          variant="standard"
          severity="error"
          onClose={handleClose}
          dir={dir}
        >
          {t(`processed_errors.${error}`)}
        </Alert>
      </Snackbar>
    );
  } else {
    return (
      <Dialog
        open={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title-error"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title-error">Error</DialogTitle>
        <DialogContent>{t(`processed_errors.${error}`)}</DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>OK</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
