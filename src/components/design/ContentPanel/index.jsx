import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styles from "./ContentPanel.module.css";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { buildIndex, resetSetup } from "~/state/design/designState";
import { buildResourceUrl } from "~/networking/common";
import { Box, CardMedia, Paper } from "@mui/material";
import { isEquivalent } from "~/utils/design/utils";
import ErrorDisplay from "~/components/design/ErrorDisplay";
import GroupDesign from "~/components/Group/GroupDesign";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ContentEditor from "../ContentEditor";

function ContentPanel(props, ref) {
  const { t } = useTranslation(["design", "run"]);
  const theme = useTheme();
  const dispatch = useDispatch();

  let isDragDisabled = false;

  const codeIndex = useSelector((state) => {
    return buildIndex(state.designState, props.groups);
  }, isEquivalent);

  const collapseInfo = useSelector((state) => {
    const info = {};
    props.groups?.forEach((element) => {
      info[element.code] = state.designState[element.code].collapsed;
    });
    return info;
  }, isEquivalent);

  props.groups?.forEach((group) => {
    if (group && !collapseInfo[group.code]) {
      isDragDisabled = true;
    }
  });

  const groupsEmpty = !props.groups;

  const langInfo = useSelector((state) => {
    return state.designState.langInfo;
  });

  const onMainLang = langInfo.onMainLang;

  return (
    <Box
      onClick={(e) => {
        dispatch(resetSetup());
      }}
      ref={ref}
      id={props.id}
      className={styles.contentPanel}
      sx={{ backgroundColor: "background.default", color: "text.primary" }}
      style={{
        fontFamily: theme.textStyles.text.font,
        color: theme.textStyles.text.color,
        fontSize: theme.textStyles.text.size,
      }}
    >
      <Paper
        elevation={3}
        style={{
          display: "flex",
          fontSize: "32px",
          lineHeight: "1.334",
          fontWeight: "400",
          padding: "16px",
          color: theme.palette.primary.contrastText,
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <ContentEditor
          code="Survey"
          extended={false}
          contentKey="label"
          placeholder="Survey Title"
        />
      </Paper>
      <ErrorDisplay code="Survey" />
      <Droppable sty droppableId="content-panel" type="groups">
        {(provided) => (
          <div
            className={styles.surveyGroups}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.headerImage && (
              <CardMedia
                className={styles.cardImage}
                component="img"
                image={buildResourceUrl(props.headerImage)}
                height="140"
              />
            )}
            {props.groups &&
              props.groups.map((group) => {
                const groupDesign = (
                  <GroupDesign
                    key={group.code}
                    t={t}
                    code={group.code}
                    dragIndex={codeIndex.indexOf(group.code)}
                    isDragDisabled={isDragDisabled}
                  />
                );
                return groupDesign;
              })}
            {groupsEmpty && onMainLang && (
              <div className={styles.groupEmptyHint}>
                <span>{t("empty_survey_hint")}</span>
              </div>
            )}
            {provided.placeholder}

            <div className={styles.footer} />
          </div>
        )}
      </Droppable>
    </Box>
  );
}

export default React.forwardRef(ContentPanel);
