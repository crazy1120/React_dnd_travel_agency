import React from "react";
import Collapse from "@mui/material/Collapse";
import { Draggable, Droppable } from "react-beautiful-dnd";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import QuestionDesign from "~/components/Question/QuestionDesign";

import styles from "./GroupDesign.module.css";
import ContentEditor from "~/components/design/ContentEditor";
import { Box, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ErrorDisplay from "~/components/design/ErrorDisplay";
import { useDispatch } from "react-redux";
import {
  collapseAllGroups,
  deleteGroup,
  setup,
  toggleComponentCollapse,
} from "~/state/design/designState";
import { useSelector } from "react-redux";
import { setupOptions } from "~/constants/design";
import ActionToolbar from "~/components/design/ActionToolbar";
import { groupIconByType, questionIconByType } from "../Questions/utils";

function GroupDesign(props) {
  console.log(props.code);

  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  const collapsed = useSelector((state) => {
    return state.designState[props.code].collapsed;
  });

  const langInfo = useSelector((state) => {
    return state.designState.langInfo;
  });

  const onMainLang = langInfo.onMainLang;

  const isInSetup = useSelector((state) => {
    return state.designState.setup?.code == props.code;
  });

  const group = useSelector((state) => {
    return state.designState[props.code];
  });

  const children = group.children;
  const toggleCollapse = () => {
    dispatch(toggleComponentCollapse(props.code));
  };

  const setSetup = React.useCallback(() => {
    dispatch(setup({ code: props.code, rules: setupOptions("group") }));
  });

  const theme = useTheme();

  return (
    <React.Fragment>
      <Draggable
        isDragDisabled={props.isDragDisabled}
        draggableId={props.code}
        index={props.dragIndex}
        key={props.code}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSetup();
            }}
          >
            <div className={styles.groupType}>
              {groupIconByType(group.groupType.toLowerCase(), "small")}&nbsp;
              {props.t("component_" + group.groupType.toLowerCase() + "_title")}
            </div>
            <Box
              className={styles.groupCard}
              sx={{
                borderColor: "grey.500",
                boxShadow: 1,
                backgroundColor: isInSetup ? "beige" : "background.paper",
              }}
            >
              <Box
                sx={{ backgroundColor: "primary.main", height: "8px" }}
                className={styles.groupHeader}
              ></Box>

              {onMainLang ? (
                <div
                  {...provided.dragHandleProps}
                  className={styles.moveBox}
                  onMouseDown={(event) => {
                    if (props.isDragDisabled) {
                      event.preventDefault();
                      setOpen(true);
                    }
                  }}
                >
                  <ViewCompactIcon />
                </div>
              ) : (
                <br />
              )}
              {onMainLang && (
                <ActionToolbar
                  code={props.code}
                  t={props.t}
                  isGroup={true}
                  toggleCollapse={toggleCollapse}
                  collapsed={collapsed}
                  onDelete={() => dispatch(deleteGroup(props.code))}
                  disableDelete={children && children.length > 0}
                />
              )}
              <div className={styles.titleRow}>
                <div
                  className={styles.textHeader}
                  style={{
                    fontFamily: theme.textStyles.group.font,
                    color: theme.textStyles.group.color,
                    fontSize: theme.textStyles.group.size,
                  }}
                >
                  <ContentEditor
                    code={props.code}
                    extended={false}
                    contentKey="label"
                    placeholder={props.t("content_editor_placeholder_title")}
                  />
                </div>
                {group.showDescription && <Box className={styles.textDescription}>
                  <ContentEditor
                    code={props.code}
                    extended={true}
                    contentKey="description"
                    placeholder={props.t(
                      "content_editor_placeholder_description"
                    )}
                  />
                </Box>}
              </div>
              {onMainLang && <ErrorDisplay type="group" code={props.code} />}
            </Box>
            <Collapse
              className={styles.questionsOuterContainer}
              in={collapsed !== true || !onMainLang}
              sx={{ backgroundColor: isInSetup ? "beige" : "background.paper" }}
              timeout="auto"
              unmountOnExit
            >
              <Droppable droppableId={props.code} type="questions">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={styles.questionsInnerContainer}
                    sx={{ backgroundColor: "background.default" }}
                  >
                    {children?.map((quest, index) => {
                      return (
                        <Draggable
                          parentIndex={props.dragIndex}
                          key={quest.code}
                          draggableId={quest.code}
                          index={props.dragIndex + index + 1}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              snapshot={snapshot}
                              {...provided.draggableProps}
                            >
                              <div className={styles.type}>
                                {questionIconByType(quest.type, "small")}&nbsp;
                                {props.t("component_" + quest.type + "_title")}
                              </div>
                              <QuestionDesign
                                t={props.t}
                                dragHandleProps={provided.dragHandleProps}
                                key={quest.code}
                                parentCode={props.code}
                                index={index}
                                type={quest.type}
                                code={quest.code}
                                onMainLang={onMainLang}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {!children && onMainLang && (
                      <div className={styles.groupEmptyHint}>
                        <span>{props.t("empty_group_hint")}</span>
                      </div>
                    )}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Collapse>
          </div>
        )}
      </Draggable>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title-collapse-all"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title-collapse-all">
          {
            "All Groups Must be collapsed first before you can drag them... Collapse All?"
          }
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              dispatch(collapseAllGroups());
              setOpen(false);
            }}
          >
            Collapse
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default React.memo(GroupDesign);
