import { Box } from "@mui/material";
import { memo } from "react";
import styles from "./ErrorDisplay.module.css";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import { isGroup, isQuestion } from "~/utils/design/utils";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { surveySetup, setupOptions } from "~/constants/design";
import { setup } from "~/state/design/designState";
import { Trans, useTranslation } from "react-i18next";

function ErrorDisplay(props) {
  const { t } = useTranslation("design");
  const dispatch = useDispatch();
  const state = useSelector((state) => {
    return state.designState[props.code] || {};
  });

  const errors = state.errors;
  const designErrors = state.designErrors;
  const instructions = state.instructionList?.filter(
    (instructions) => instructions.errors
  );

  const hasErrors =
    errors?.length > 0 || designErrors?.length > 0 || instructions?.length > 0;

  const type = useSelector((state) => {
    return props.code == "Survey"
      ? ""
      : isGroup(props.code)
      ? state.designState[props.code].groupType?.toLowerCase() || "group"
      : state.designState[props.code].type;
  });

  const onErrClick = (instruction) => {
    if (instruction.code === "conditional_relevance") {
      dispatch(
        setup({
          code: props.code,
          rules: setupOptions(type),
          highlighted: "relevance",
          expanded: ["relevance"],
        })
      );
    } else if (
      instruction.code === "random_group" ||
      instruction.code === "priority_groups"
    ) {
      if (props.code == "Survey") {
        dispatch(setup({ ...surveySetup, highlighted: "random" }));
      } else {
        dispatch(
          setup({
            code: props.code,
            rules: setupOptions(type),
            highlighted: "random",
            expanded: ["random"],
          })
        );
      }
    } else if (instruction.code.startsWith("skip_to")) {
      dispatch(
        setup({
          code: props.code,
          rules: setupOptions(type),
          highlighted: "skip_logic",
          expanded: ["skip_logic"],
        })
      );
    }
    return "";
  };

  const isClickable = (instruction) => {
    return (
      instruction.code === "conditional_relevance" ||
      instruction.code === "random_group" ||
      instruction.code === "priority_groups" ||
      instruction.code.startsWith("skip_to")
    );
  };

  return hasErrors ? (
    <Box className={styles.errorDisplay}>
      {errors &&
        errors.map((el) => {
          return (
            <div key={el}>
              <CloseIcon style={{ verticalAlign: "middle" }} />
              {mapComponentError(props.code, el, t)}
            </div>
          );
        })}
      {designErrors &&
        designErrors.map((el) => {
          return (
            <div key={el.code}>
              <CloseIcon style={{ verticalAlign: "middle" }} />
              {el.message}
            </div>
          );
        })}
      {instructions &&
        instructions.map((el) => {
          return (
            <div
              className={isClickable(el) ? styles.clickable : ""}
              onClick={() => onErrClick(el)}
              key={el.code}
            >
              <ErrorOutlineIcon style={{ verticalAlign: "middle" }} />
              {mapInstructionError(el, t)}
            </div>
          );
        })}
    </Box>
  ) : (
    ""
  );
}

const mapComponentError = (code, error, t) => {
  if (error === "EMPTY_PARENT") {
    return t("err_empty_parent", {
      component_name: componentName(code, t),
      child_name: componentChildName(code, t),
    });
  } else if (error === "DUPLICATE_CODE") {
    return t("err_duplicate_code"), { component_name: componentName(code, t) };
  } else if (error === "NO_END_GROUP") {
    return t("err_no_end_group");
  } else if (error === "MISPLACED_END_GROUP") {
    return t("err_misplaced_end_group");
  } else if (error === "MISPLACED_WELCOME_GROUP") {
    return t("err_misplaced_welcome_group");
  }
  return "";
};

const mapInstructionError = (instruction, t) => {
  if (
    instruction.code === "value" &&
    instruction.errors[0].name == "InvalidInstructionInEndGroup"
  ) {
    return t("err_value_in_end_group");
  } else if (instruction.code === "conditional_relevance") {
    return t("err_relevance");
  } else if (instruction.code === "random_group") {
    return t("err_random");
  } else if (instruction.code === "priority_groups") {
    return t("err_priority");
  } else if (instruction.code.startsWith("reference")) {
    return (
      <Trans
        t={t}
        values={{
          codes: instruction.errors
            .map((error) => error.reference.split(".")[0])
            .join(", "),
          lang: instruction.lang,
        }}
        i18nKey="err_reference"
      />
    );
  } else if (instruction.code.startsWith("skip_to")) {
    return t("err_skip");
  }
  return "";
};

const componentName = (code, t) => {
  if (code == "Survey") {
    return t("survey");
  } else if (isQuestion(code)) {
    return t("question");
  } else if (isGroup(code)) {
    return t("group");
  }
  return t("option");
};

const componentChildName = (code, t) => {
  if (isGroup(code)) {
    return t("question");
  } else if (code == "Survey") {
    return t("group");
  }
  return t("option");
};

export default memo(ErrorDisplay);
