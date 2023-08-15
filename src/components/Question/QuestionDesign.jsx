import React from "react";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";

import TextQuestionDesign from "~/components/Questions/Text/TextQuestionDesign";
import EmailQuestionDesign from "~/components/Questions/Email/EmailQuestionDesign";
import NumberQuestionDesign from "~/components/Questions/Number/NumberQuestionDesign";
import ParagraphQuestionDesign from "~/components/Questions/Paragraph/ParagraphQuestionDesign";

import styles from "./QuestionDesign.module.css";
import { nextId } from "~/utils/design/utils";
import ContentEditor from "~/components/design/ContentEditor";
import FileUploadQuestionDesign from "~/components/Questions/FileUpload/FileUploadQuestionDesign";
import DateTimeQuestionDesign from "~/components/Questions/DateTime/DateTimeQuestionDesign";
import TimeQuestionDesign from "~/components/Questions/DateTime/TimeQuestionDesign";
import SCQArray from "~/components/Questions/SCQArray/SCQArrayDesign";
import { Box, Collapse } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ErrorDisplay from "~/components/design/ErrorDisplay";
import { useSelector } from "react-redux";
import {
  addNewAnswer,
  cloneQuestion,
  deleteQuestion,
  setup,
  toggleComponentCollapse,
} from "~/state/design/designState";
import { useDispatch } from "react-redux";
import { setupOptions } from "~/constants/design";
import ActionToolbar from "~/components/design/ActionToolbar";
import VideoDisplayDesign from "~/components/Questions/VideoDisplay/VideoDisplayDesign";
import SignatureDesign from "~/components/Questions/Signature/SignatureDesign";
import ImageDisplayDesign from "~/components/Questions/ImageDisplay/ImageDisplayDesign";
import NPSDesign from "~/components/Questions/NPS/NPSDesign";
import PhotoCaptureDesign from "../Questions/PhotoCapture/PhotoCaptureDesign";
import VideoCaptureDesign from "../Questions/VideoCapture/VideoCaptureDesign";
import BarcodeDesign from "../Questions/Barcode/BarcodeDesign";
import ChoiceQuestion from "../Questions/Choice/ChoiceDesign";
import ImageChoiceQuestion from "../Questions/Imagechoice/ImageChoiceDesign";

function QuestionDesign({ code, type, parentCode, dragHandleProps, t, onMainLang }) {
  console.log(code);
  const dispatch = useDispatch();
  const theme = useTheme();

  const isInSetup = useSelector((state) => {
    return state.designState.setup?.code == code;
  });

  const question = useSelector((state) => {
    return state.designState[code];
  });

  const children = question.children;

  const collapsed = useSelector((state) => {
    return state.designState[code].collapsed;
  });

  const toggleCollapse = () => {
    dispatch(toggleComponentCollapse(code));
  };

  const showQuestion = () => {
    switch (type) {
      case "video_display":
        return <VideoDisplayDesign key={code} code={code} t={t} onMainLang={onMainLang} />;
      case "image_display":
        return <ImageDisplayDesign key={code} code={code} t={t} onMainLang={onMainLang} />;
      case "signature":
        return <SignatureDesign />;
      case "photo_capture":
        return <PhotoCaptureDesign code={code} />;
      case "video_capture":
        return <VideoCaptureDesign code={code} />;
      case "date_time":
        return <DateTimeQuestionDesign key={code} code={code} />;
      case "date":
        return <DateTimeQuestionDesign key={code} code={code} />;
      case "time":
        return <TimeQuestionDesign key={code} code={code} />;
      case "scq":
        return (
          <ChoiceQuestion
            key={code}
            t={t}
            onMainLang={onMainLang}
            addNewAnswer={addAnswer}
            code={code}
            type="radio"
          />
        );
      case "image_mcq":
      case "image_scq":
      case "image_ranking":
        return (
          <ImageChoiceQuestion
            key={code}
            t={t}
            onMainLang={onMainLang}
            addNewAnswer={addAnswer}
            code={code}
          />
        );
      case "scq_array":
        return (
          <SCQArray onMainLang={onMainLang} key={code} addNewAnswer={addAnswer} code={code} t={t} />
        );
      case "file_upload":
        return <FileUploadQuestionDesign key={code} code={code} />;
      case "mcq":
        return (
          <ChoiceQuestion
            key={code}
            addNewAnswer={addAnswer}
            code={code}
            t={t}
            type="checkbox"
          />
        );
      case "ranking":
        return (
          <ChoiceQuestion
            key={code}
            addNewAnswer={addAnswer}
            code={code}
            t={t}
            type="ranking"
          />
        );
      case "nps":
        return <NPSDesign key={code} code={code} />;
      case "number":
        return <NumberQuestionDesign key={code} code={code} />;
      case "text":
        return <TextQuestionDesign key={code} code={code} />;
      case "paragraph":
        return <ParagraphQuestionDesign t={t} key={code} code={code} />;
      case "barcode":
        return <BarcodeDesign t={t} key={code} code={code} />;
      case "email":
        return <EmailQuestionDesign key={code} code={code} />;
      default:
        return "";
    }
  };

  const addAnswer = (questionCode, questionType, type) => {
    const answers = children || [];
    let nextAnswerIndex = 1;
    let code = "";
    let qualifiedCode = "";
    let label = "";

    const valueInstruction = {
      code: "value",
      isActive: false,
      returnType: {
        name:
          questionType == "ranking" ||
          questionType == "nps" ||
          questionType == "image_ranking"
            ? "Int"
            : "Boolean",
      },
      text: "",
    };

    switch (type) {
      case "column":
        nextAnswerIndex = nextId(answers.filter((el) => el.type === "column"));
        label = "Col" + nextAnswerIndex;
        code = "Ac" + nextAnswerIndex;
        qualifiedCode = questionCode + code;
        dispatch(
          addNewAnswer({ label, answer: { code, qualifiedCode, type } })
        );
        break;
      case "row":
        nextAnswerIndex = nextId(answers.filter((el) => el.type === "row"));
        code = "A" + nextAnswerIndex;
        label = "Row" + nextAnswerIndex;
        qualifiedCode = questionCode + code;
        dispatch(
          addNewAnswer({
            label,
            instructionList: [valueInstruction],
            answer: { code, qualifiedCode, type },
          })
        );
        break;
      case "other":
        code = "Aother";
        label = "Other";
        qualifiedCode = questionCode + code;
        const instructionListForText = [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "String",
            },
            text: "",
          },
          {
            code: "conditional_relevance",
            isActive: true,
            returnType: {
              name: "Boolean",
            },
            text:
              questionType === "scq"
                ? `${questionCode}.value === 'Aother'`
                : `${questionCode}Aother.value === true`,
          },
        ];
        dispatch(
          addNewAnswer({
            label,
            answer: { code, qualifiedCode, type },
            instructionList: questionType == "mcq" ? [valueInstruction] : [],
          })
        );
        dispatch(
          addNewAnswer({
            instructionList: instructionListForText,
            answer: {
              code: "Atext",
              qualifiedCode: qualifiedCode + "Atext",
              type: "other_text",
            },
          })
        );
        break;
      default:
        nextAnswerIndex = nextId(answers);
        code = "A" + nextAnswerIndex;
        label = "Option" + nextAnswerIndex;
        qualifiedCode = questionCode + code;
        dispatch(
          addNewAnswer({
            label,
            answer: { code, qualifiedCode },
            instructionList:
              questionType == "mcq" ||
              questionType == "image_mcq" ||
              questionType == "ranking" ||
              questionType == "image_ranking"
                ? [valueInstruction]
                : [],
          })
        );
        break;
    }
  };

  const setSetup = React.useCallback(() => {
    dispatch(setup({ code, rules: setupOptions(type) }));
  });

  return (
    <div
      onClick={(e) => {
        console.log(e)
        e.preventDefault();
        e.stopPropagation();
        setSetup();
      }}
      style={{
        backgroundColor: isInSetup ? "beige": theme.palette.background.paper,
        borderColor: "#9e9e9e",
      }}
      className={`${styles.groupQuestion}`}
    >
      <div className={styles.questionWrapper}>
        <>
          {onMainLang && (
            <div className={styles.moveBox} {...dragHandleProps}>
              <ViewCompactIcon />
            </div>
          )}

          {onMainLang && (
            <ActionToolbar
              t={t}
              isGroup={false}
              code={code}
              parentCode={parentCode}
              toggleCollapse={toggleCollapse}
              collapsed={collapsed}
              onClone={() => dispatch(cloneQuestion(code))}
              onDelete={() => dispatch(deleteQuestion(code))}
              disableDelete={false}
            />
          )}
        </>

        <div
          className={styles.titleQuestion}
          style={{
            fontFamily: theme.textStyles.question.font,
            color: theme.textStyles.question.color,
            fontSize: theme.textStyles.question.size,
          }}
        >
          <ContentEditor
            code={code}
            extended={false}
            placeholder={t("content_editor_placeholder_title")}
            contentKey="label"
          />
        </div>
        {question.showDescription && (
          <Box className={styles.textDescriptionContent}>
            <ContentEditor
              code={code}
              extended={true}
              placeholder={t("content_editor_placeholder_description")}
              contentKey="description"
            />
          </Box>
        )}
      </div>

      <Collapse in={collapsed !== true} timeout="auto" unmountOnExit>
        {showQuestion()}
      </Collapse>
      <ErrorDisplay code={code} />
    </div>
  );
}

export default React.memo(QuestionDesign);
