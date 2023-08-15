import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { onErrorSeen } from "~/state/design/designState";
import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function ErrorWrapper() {
  const dispatch = useDispatch();

  const error = useSelector((state) => {
    const error = state.designState.error || false;
    return error;
  });

  const setErrorSeen = () => {
    dispatch(onErrorSeen());
  };

  return (
    error &&
    !error.seen && (
      <Dialog
        open={true}
        onClose={() => setErrorSeen()}
        aria-labelledby="alert-dialog-title-error"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title-error">Error</DialogTitle>
        <DialogContent>{error.message || ""}</DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorSeen()}>OK</Button>
        </DialogActions>
      </Dialog>
    )
  );
}

export default ErrorWrapper;
