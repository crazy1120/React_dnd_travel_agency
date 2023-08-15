import React from "react";
import styles from "./ChoiceDesign.module.css";
import { Droppable } from "react-beautiful-dnd";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import SortIcon from "@mui/icons-material/Sort";
import { Button } from "@mui/material";
import ChoiceItemDesign from "~/components/Questions/Choice/ChoiceItemDesign";

import { useTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { useSelector } from "react-redux";

function ChoiceQuestion(props) {
  const theme = useTheme();
  const t = props.t;

  const children = useSelector((state) => {
    return state.designState[props.code].children;
  });

  const questionType = useSelector((state) => {
    return state.designState[props.code].type;
  });

  const isOther =
    (questionType == "mcq" || questionType == "scq") &&
    (!children || !children.some((el) => el.code === "Aother"));

  return (
    <div className={styles.questionItem}>
      <Droppable
        droppableId={`option-${props.code}`}
        type={`option-${props.code}`}
      >
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {children &&
              children.length > 0 &&
              children.map((item, index) => (
                <ChoiceItemDesign
                  key={item.code}
                  code={item.code}
                  t={props.t}
                  label={item.code}
                  qualifiedCode={item.qualifiedCode}
                  index={index}
                  type={props.type}
                />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {props.onMainLang && (
        <div className={styles.answerAdd}>
          {props.type === "checkbox" ? (
            <CheckBoxOutlineBlankIcon
              style={{ fontSize: 18, color: grey[600] }}
              className={styles.answerIcon}
            />
          ) : props.type === "radio" ? (
            <RadioButtonUncheckedIcon
              style={{ fontSize: 18, color: grey[600] }}
              className={styles.answerIcon}
            />
          ) : (
            <SortIcon
              style={{ fontSize: 18, color: grey[600] }}
              className={styles.answerIcon}
            />
          )}
          <Button
            size="small"
            style={{
              fontFamily: theme.textStyles.text.font,
              fontSize: theme.textStyles.text.size,
            }}
            onClick={() => props.addNewAnswer(props.code, questionType)}
          >
            {t("add_option")}
          </Button>
          {isOther && (
            <>
              <span>{t("or")}</span>
              <Button
                style={{
                  fontFamily: theme.textStyles.text.font,
                  fontSize: theme.textStyles.text.size,
                }}
                size="small"
                className={styles.answerIcon}
                onClick={() =>
                  props.addNewAnswer(props.code, questionType, "other")
                }
              >
                {t("add_other")}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ChoiceQuestion;
