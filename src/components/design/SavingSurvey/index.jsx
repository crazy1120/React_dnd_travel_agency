import { Alert, Snackbar, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import styles from "./SavingSurvey.module.css";

function SavingSurvey() {
  const isSaving = useSelector((state) => {
    return state.designState.isSaving || state.editState.isSaving;
  });

  return (
    <Snackbar open={isSaving}>
      <Alert severity="warning">
        Saving Survey...{" "}
        <CircularProgress className={styles.savingProgress} color="warning" />
      </Alert>
    </Snackbar>
  );
}

export default SavingSurvey;
