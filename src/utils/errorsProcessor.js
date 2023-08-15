export const PROCESSED_ERRORS = {
  NETWORK_ERR: "network_err",
  BACKEND_DOWN: "backend_down",
  WRONG_CREDENTIALS: "wrong_credentials",
  DUPLICATE_EMAIL: "duplicate_email",
  DUPLICATE_SURVEY_NAME: "duplicate_survey_name",
  EXPIRED_RESET_TOKEN: "expired_reset_token",
  WRONG_RESET_TOKEN: "wrong_reset_token",
  USED_CONFIRMATION_TOKEN: "used_confirmation_token",
  EXPIRED_CONFIRMATION_TOKEN: "expired_confirmation_token",
  USER_NOT_FOUND: "user_not_found",
  MISSING_CREDENTIALS: "missing_credentials",
  SURVEY_DESIGN_ERROR: "survey_design_error",
  SURVEY_NOT_ACTIVE: "survey_not_active",
  SURVEY_CLOSED: "survey_closed",
  SURVEY_SCHEDULED: "survey_scheduled",
  SURVEY_EXPIRED: "survey_expired",
  INVALID_SURVEY_DATES: "invalid_survey_dates",
  GOOGLE_AUTH_ERROR: "google_auth_error",
  UNIDENTIFIED_ERROR: "unidentified_error",
};

export const processError = (e) => {
  console.log(e);
  if (e.code == "ERR_NETWORK" && navigator.onLine) {
    return PROCESSED_ERRORS.BACKEND_DOWN;
  } else if (e.code == "ERR_NETWORK" && !navigator.onLine) {
    return PROCESSED_ERRORS.NETWORK_ERR;
  } else if (e.response?.data?.error) {
    switch (e.response?.data?.error) {
      case "WrongCredentialsException":
        return PROCESSED_ERRORS.WRONG_CREDENTIALS;
      case "DuplicateEmailException":
        return PROCESSED_ERRORS.DUPLICATE_EMAIL;
      case "ExpiredResetTokenException":
        return PROCESSED_ERRORS.EXPIRED_RESET_TOKEN;
      case "WrongResetTokenException":
        return PROCESSED_ERRORS.WRONG_RESET_TOKEN;
      case "UsedConfirmationTokenException":
        return PROCESSED_ERRORS.USED_CONFIRMATION_TOKEN;
      case "ExpiredConfirmationTokenException":
        return PROCESSED_ERRORS.EXPIRED_CONFIRMATION_TOKEN;
      case "UserNotFoundException":
        return PROCESSED_ERRORS.USER_NOT_FOUND;
      case "DuplicateEmailException":
        return PROCESSED_ERRORS.DUPLICATE_EMAIL;
      case "MissingCredentialsException":
        return PROCESSED_ERRORS.MISSING_CREDENTIALS;
      case "SurveyDesignWithErrorException":
        return PROCESSED_ERRORS.SURVEY_DESIGN_ERROR;
      case "DuplicateSurveyException":
        return PROCESSED_ERRORS.DUPLICATE_SURVEY_NAME;
      case "SurveyIsNotActiveException":
        return PROCESSED_ERRORS.SURVEY_NOT_ACTIVE;
      case "SurveyExpiredException":
        return PROCESSED_ERRORS.SURVEY_EXPIRED;
      case "SurveyNotStartedException":
        return PROCESSED_ERRORS.SURVEY_SCHEDULED;
      case "SurveyIsClosedException":
        return PROCESSED_ERRORS.SURVEY_CLOSED;
      case "InvalidSurveyDates":
        return PROCESSED_ERRORS.INVALID_SURVEY_DATES;
      case "GoogleAuthError":
        return PROCESSED_ERRORS.GOOGLE_AUTH_ERROR;
      default:
        return PROCESSED_ERRORS.UNIDENTIFIED_ERROR;
    }
  }
};
