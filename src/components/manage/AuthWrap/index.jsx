import { Box } from "@mui/material";
import LoadingIndicator from "~/components/common/LoadingIndicator";
import styles from "./AuthWrap.module.css";
import ProcessedError from "~/components/manage/ProcessedError";

export const AuthWrap = ({
  children,
  loading,
  showError,
  processedError,
  handleClose,
}) => {
  return (
    <Box className={styles.mainContainer}>
      {loading && <LoadingIndicator />}
      {showError && (
        <ProcessedError error={processedError} handleClose={handleClose} />
      )}
      {children}
    </Box>
  );
};
