import { Draggable } from "react-beautiful-dnd";
import styles from "./ChoiceItemDesign.module.css";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { Box, TextField } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { changeContent, removeAnswer, setup } from "~/state/design/designState";
import { setupOptions } from "~/constants/design";
import { rtlLanguage } from "~/utils/common";

function ChoiceItemDesign(props) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const langInfo = useSelector((state) => {
    return state.designState.langInfo;
  });

  const answer = useSelector((state) => {
    return state.designState[props.qualifiedCode];
  });
  const onMainLang = langInfo.lang === langInfo.mainLang;
  const lang = langInfo.lang;

  const isRtl = rtlLanguage.includes(lang);

  const isInSetup = useSelector((state) => {
    return (
      answer.type === "other" &&
      state.designState.setup?.code == props.qualifiedCode + "Atext"
    );
  });

  const content = useSelector((state) => {
    return state.designState[props.qualifiedCode].content?.["label"]?.[lang];
  });

  const mainContent = useSelector((state) => {
    return state.designState[props.qualifiedCode].content?.["label"]?.[
      langInfo.mainLang
    ];
  });

  const renderIconByType = (type) => {
    switch (type) {
      case "radio":
        return (
          <RadioButtonUncheckedIcon
            className={styles.answerIcon}
            sx={{ fontSize: 18, color: grey[600] }}
          />
        );
      case "checkbox":
        return (
          <CheckBoxOutlineBlankIcon
            className={styles.answerIcon}
            sx={{ fontSize: 18, color: grey[600] }}
          />
        );
      case "numberOrder":
        return (
          <div
            className={styles.answerNumberOrder}
            style={{
              fontFamily: theme.textStyles.text.font,
              color: theme.textStyles.text.color,
              fontSize: 18,
            }}
          >
            {props.code}
          </div>
        );
      default:
        break;
    }
  };

  return (
    <Draggable draggableId={props.qualifiedCode} index={props.index}>
      {(provided) => (
        <Box
          sx={{ backgroundColor: isInSetup ? "beige" : "inherit" }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styles.answerItem}
        >
          {onMainLang && (
            <DragIndicatorIcon
              className={styles.answerIcon}
              sx={{ fontSize: 18, color: grey[600] }}
            />
          )}
          {renderIconByType(props.type)}
          {props.label ? <b>{props.label}</b> : ""}
          <TextField
            variant="standard"
            className={
              answer.type === "other" && isRtl
                ? styles.answerControlOtherRtl
                : answer.type === "other"
                ? styles.answerControlOther
                : isRtl
                ? styles.answerControlRtl
                : styles.answerControl
            }
            value={content || ""}
            onChange={(e) =>
              dispatch(
                changeContent({
                  code: props.qualifiedCode,
                  key: "label",
                  lang: lang,
                  value: e.target.value,
                })
              )
            }
            placeholder={
              onMainLang
                ? props.t("content_editor_placeholder_option")
                : mainContent || props.t("content_editor_placeholder_option")
            }
            InputProps={{
              sx: {
                fontFamily: theme.textStyles.text.font,
                color: theme.textStyles.text.color,
                fontSize: theme.textStyles.text.size,
              },
            }}
          />
          {answer.type === "other" && (
            <BuildIcon
              key="setup"
              sx={{ fontSize: 18, color: grey[600] }}
              className={styles.answerIconOther}
              onClick={() => {
                dispatch(
                  setup({
                    code: props.qualifiedCode + "Atext",
                    rules: setupOptions("other_text"),
                  })
                );
              }}
            />
          )}

          {onMainLang && (
            <CloseIcon
              key="close"
              sx={{ fontSize: 18, color: grey[600] }}
              className={styles.answerIcon}
              onClick={(e) => dispatch(removeAnswer(props.qualifiedCode))}
            />
          )}
        </Box>
      )}
    </Draggable>
  );
}

export default ChoiceItemDesign;
