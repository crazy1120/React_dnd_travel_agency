import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Stack } from "@mui/material";
import SurveyService from "~/services/SurveyService";
import styles from "./Dashboard.module.css";
import { Survey } from "~/components/manage/Survey";
import { PROCESSED_ERRORS, processError } from "~/utils/errorsProcessor";
import ProcessedError from "~/components/manage/ProcessedError";

function Dashboard() {
  const [surveys, setSurveys] = useState([]);
  const [fetchingSurveys, setFetchingSurveys] = useState(true);
  const [processedError, setProcessedError] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {


    const processApirror = (e) => {
      setFetchingSurveys(false);
      const processed = processError(e);
      switch (processed) {
        case PROCESSED_ERRORS.NETWORK_ERR:
        case PROCESSED_ERRORS.BACKEND_DOWN:
          setShowError(true);
          setProcessedError(processed);
          break;
        default:
          break;
      }
    };

    SurveyService.getAllSurveys()
      .then((data) => {
        if (data) {
          setFetchingSurveys(false);
          setSurveys(data);
        }
      })
      .catch((e) => processApirror(e));
  }, []);

  return (
    <Box className={styles.mainContainer}>
      {showError && (
        <ProcessedError
          error={processedError}
          handleClose={() => setShowError(false)}
        />
      )}
      <Box className={styles.content}>
        <Stack flexDirection="row" gap={4} flexWrap="wrap">
          {!fetchingSurveys ? (
            surveys?.map((survey) => {
              return <Survey key={survey.id} survey={survey} />;
            })
          ) : (
            <div className={styles.loadingWrapper}>
              <CircularProgress />
            </div>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

export default Dashboard;
