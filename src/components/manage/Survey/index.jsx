import { Link } from "react-router-dom";
import { Box, Typography, IconButton, Card } from "@mui/material";
import { Edit, Palette, Preview } from "@mui/icons-material";

import styles from "./Survey.module.css";
import {
  dayMonthUeatFormat,
  serverDateTimeToLocalDateTime,
} from "~/utils/DateUtils";
import { useTranslation } from "react-i18next";
import { isSurveyAdmin } from "~/constants/roles";

const STATUS = {
  DRAFT: "draft",
  CLOSED: "closed",
  ACTIVE: "active",
  EXPIRED: "expired",
  SCHEDULED: "schedules",
};

const BG = {
  LIGHTBLUE: "lightblue",
  RED: "red",
  GREEN: "green",
  ORANGE: "orange",
  GRAY: "gray",
};

const status = (survey) => {
  switch (survey.status) {
    case "draft":
      return STATUS.DRAFT;
    case "closed":
      return STATUS.CLOSED;
    case "active":
      if (
        survey.endDate &&
        serverDateTimeToLocalDateTime(survey.endDate) < Date.now()
      ) {
        return STATUS.EXPIRED;
      } else if (
        survey.startDate &&
        serverDateTimeToLocalDateTime(survey.startDate) > Date.now()
      ) {
        return STATUS.SCHEDULED;
      } else {
        return STATUS.ACTIVE;
      }
    default:
      return STATUS.DRAFT;
  }
};

const bgHeader = (status) => {
  switch (status) {
    case STATUS.DRAFT:
      return BG.LIGHTBLUE;
    case STATUS.CLOSED:
      return BG.RED;
    case STATUS.EXPIRED:
      return BG.ORANGE;
    case STATUS.SCHEDULED:
      return BG.GRAY;
    case STATUS.ACTIVE:
      return BG.GREEN;
    default:
      return;
  }
};

export const Survey = ({ survey }) => {
  const { t } = useTranslation("manage");
  const surveyStatus = status(survey);
  return (
    <Card sx={{ borderRadius: "10px" }}>
      <Box
        className={styles.surveyHeader}
        sx={{ background: bgHeader(surveyStatus) }}
      >
        {surveyStatus}
      </Box>
      <Box className={styles.contentCard}>
        <Link to={`/manage-survey/${survey.id}`} title="Design">
          <Typography variant="h5">{survey.name}</Typography>
        </Link>
        <Box sx={{ mt: "5px" }}>
          {t("added")}
          {dayMonthUeatFormat(
            serverDateTimeToLocalDateTime(survey.creationDate)
          )}
        </Box>
        <Box>
          {t("last_modified")}{" "}
          {dayMonthUeatFormat(
            serverDateTimeToLocalDateTime(survey.lastModified)
          )}
        </Box>
        {t("responses_count")} {survey?.responsesCount}
        {survey?.latestVersion?.published === false && (
          <>
            {" "}
            <br /> <span>Unpublished Changes</span>{" "}
          </>
        )}
      </Box>
    </Card>
  );
};
