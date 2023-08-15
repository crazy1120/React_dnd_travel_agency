import { IconButton, Tooltip } from "@mui/material";
import styles from "./ActionToolbar.module.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import BuildIcon from "@mui/icons-material/Build";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VerifiedIcon from "@mui/icons-material/Verified";
import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setupOptions } from "~/constants/design";
import { setup } from "~/state/design/designState";

function ActionToolbar({
  code,
  isGroup,
  parentCode,
  collapsed,
  toggleCollapse,
  disableDelete,
  onDelete,
  onClone,
  t,
}) {
  const dispatch = useDispatch();

  const type = useSelector((state) => {
    return isGroup
      ? state.designState[code].groupType?.toLowerCase() || "group"
      : state.designState[code].type;
  });

  const hasRelevance = useSelector((state) => {
    let instruction = state.designState[code]?.instructionList?.find(
      (el) => el.code == "conditional_relevance"
    );
    return typeof instruction !== "undefined" && !instruction.errors;
  });

  const hasValidation = useSelector((state) => {
    return (
      !isGroup &&
      state.designState[code]?.instructionList?.filter(
        (el) => el.code.startsWith("validation_") && !el.errors
      )?.length > 0
    );
  });

  const setSetup = () => {
    dispatch(setup({ code, rules: setupOptions(type) }));
  };

  const expandRelevance = () => {
    dispatch(
      setup({
        code,
        rules: setupOptions(type),
        highlighted: "relevance",
        expanded: ["relevance"],
      })
    );
  };

  const expandValidation = () => {
    dispatch(
      setup({
        code,
        rules: setupOptions(type),
        highlighted: "validation",
        expanded: ["validation"],
      })
    );
  };

  const expandSkipLogic = () => {
    dispatch(
      setup({
        code,
        rules: setupOptions(type),
        highlighted: "skip_logic",
        expanded: ["skip_logic"],
      })
    );
  };

  const expandParentRandom = () => {
    if (isGroup) {
      dispatch(setup({ ...surveySetup, highlighted: "random" }));
    } else {
      dispatch(
        setup({
          code: parentCode,
          rules: setupOptions("group"),
          highlighted: "random",
          expanded: ["random"],
        })
      );
    }
  };

  const hasSkip = useSelector((state) => {
    let skipInstructions = state.designState[code]?.instructionList?.filter(
      (el) => el.code.startsWith("skip_to")
    );
    return skipInstructions?.filter((el) => !el.errors)?.length >= 1;
  });

  const isRandomized = useSelector((state) => {
    let indexObj = state.designState.componentIndex?.find(
      (el) => el.code == code
    );
    return indexObj && indexObj.minIndex != indexObj.maxIndex;
  });

  const isPrioritised = useSelector((state) => {
    let indexObj = state.designState.componentIndex?.find(
      (el) => el.code == code
    );
    return indexObj?.prioritisedSiblings?.length > 0;
  });

  return (
    <div
      className={styles.actionControl}
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {
        <IconButton onClick={toggleCollapse}>
          {collapsed ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
        </IconButton>
      }
      {hasRelevance && (
        <Tooltip title="Has show/Hide Condition">
          <IconButton
            className={styles.statusIcon}
            onClick={() => expandRelevance()}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      )}
      {hasValidation && (
        <Tooltip title="Has Validation">
          <IconButton
            className={styles.statusIcon}
            onClick={() => expandValidation()}
          >
            <VerifiedIcon />
          </IconButton>
        </Tooltip>
      )}
      {isRandomized && (
        <Tooltip title="Is part of a valid Random Group (within parent)">
          <IconButton
            className={styles.statusIcon}
            onClick={() => expandParentRandom()}
          >
            <ShuffleIcon />
          </IconButton>
        </Tooltip>
      )}
      {isPrioritised && (
        <Tooltip title="Is part of a valid Priority Group (within parent)">
          <IconButton
            className={styles.statusIcon}
            onClick={() => expandParentRandom()}
          >
            <LowPriorityIcon />
          </IconButton>
        </Tooltip>
      )}
      {hasSkip && (
        <Tooltip title="Has active Skip Logic">
          <IconButton
            className={styles.statusIcon}
            onClick={() => expandSkipLogic()}
          >
            <MoveDownIcon />
          </IconButton>
        </Tooltip>
      )}

      <IconButton onClick={() => setSetup()}>
        <BuildIcon className={styles.settingIcon} />
      </IconButton>
      {!isGroup && (
        <IconButton onClick={() => onClone()}>
          <ContentCopyIcon className={styles.actionIcon} />
        </IconButton>
      )}
      <IconButton
        onClick={() => {
          if (window.confirm(t("are_you_sure"))) {
            onDelete();
          }
        }}
        disabled={disableDelete}
      >
        <DeleteOutlineIcon className={styles.deleteIcon} />
      </IconButton>
    </div>
  );
}

export default ActionToolbar;
