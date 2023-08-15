import TokenService from "~/services/TokenService";

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  SURVEY_ADMIN: "survey_admin",
  SURVEYOR: "surveyor",
  ANALYST: "analyst",
};

export const isSurveyAdmin = () => {
  const roles = TokenService.getUser().roles;
  return (
    roles.indexOf(ROLES.SUPER_ADMIN) != -1 ||
    roles.indexOf(ROLES.SURVEY_ADMIN) != -1
  );
};

export const isSurveyor = (user) => {
  const roles = user.roles;
  return (
    roles.indexOf(ROLES.SUPER_ADMIN) != -1 ||
    roles.indexOf(ROLES.SURVEYOR) != -1
  );
};

export const isAnalyst = (user) => {
  const roles = user.roles;
  return (
    roles.indexOf(ROLES.SUPER_ADMIN) != -1 || roles.indexOf(ROLES.ANALYST) != -1
  );
};

export const isSurveyorOnly = (user) => {
  const roles = user.roles;
  return roles.length == 1 && roles.indexOf(ROLES.SURVEYOR) != -1;
};
