import React from "react";
import { useTranslation } from "react-i18next";
import { FormControl, MenuItem, InputLabel, Select } from "@mui/material";
import { NAVIGATION_MODE } from "~/constants/survey";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { changeAttribute } from '~/state/design/designState';

export const NavigationMode = () => {
  const { t } = useTranslation("design");

  const dispatch = useDispatch();

  const value = useSelector((state) => {
    return (
      state.designState.Survey.navigationMode || NAVIGATION_MODE.GROUP_BY_GROUP
    );
  });

  const onNavigationModeChanged = (event) => {
    dispatch(
      changeAttribute({
        code: "Survey",
        key: "navigationMode",
        value: event.target.value,
      })
    );
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="navigation-mode-label">{t("navigation_mode")}</InputLabel>
      <Select
        labelId="navigation-mode-label"
        id="demo-simple-select"
        value={value}
        label={t("label.navigation_mode")}
        onChange={onNavigationModeChanged}
      >
        <MenuItem value={NAVIGATION_MODE.GROUP_BY_GROUP}>
          {t("group_by_group")}
        </MenuItem>
        <MenuItem value={NAVIGATION_MODE.QUESTION_BY_QUESTION}>
          {t("question_by_question")}
        </MenuItem>
        <MenuItem value={NAVIGATION_MODE.ALL_IN_ONE}>
          {t("all_in_one")}
        </MenuItem>
      </Select>
    </FormControl>
  );
};
