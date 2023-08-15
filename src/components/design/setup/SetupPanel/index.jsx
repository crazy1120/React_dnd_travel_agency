import FieldSize from "~/components/design/setup/FieldSize";
import ShowHint, { ContentEditor } from "~/components/design/setup/ShowHint";
import ValidationSetupItem from "~/components/design/setup/validation/ValidationSetupItem";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ToggleValue from "../ToggleValue";
import SelectValue from "../SelectValue";
import SelectDate from "../SelectDate";
import Theming from "../Theming";
import Relevance from "../logic/Relevance";
import SkipLogic from "../SkipLogic";
import styles from "./SetupPanel.module.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { resetSetup, setupToggleExpand } from "~/state/design/designState";
import OrderPrioritySetup from "../random/OrderPrioritySetup";
import { NavigationMode } from "~/components/manage/NavigationMode";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";

function SetupPanel({ t, passedref }) {
  const dispatch = useDispatch();
  const toggleExpand = (key) => {
    dispatch(setupToggleExpand(key));
  };

  const setupInfo = useSelector((state) => {
    return state.designState.setup || {};
  });

  const isSingleRule = setupInfo.rules?.length === 1;

  const generateSetupSection = (rule) => {
    return (
      <Accordion
        expanded={
          setupInfo.expanded?.includes(rule.key) || isSingleRule || false
        }
        key={setupInfo.code + rule.title}
        TransitionProps={{ unmountOnExit: true }}
      >
        <AccordionSummary
          sx={{ backgroundColor: "#ECECEC", margin: 0 }}
          onClick={() => toggleExpand(rule.key)}
          className={styles.setupHeader}
          expandIcon={isSingleRule ? null : <ExpandMoreIcon />}
        >
          <span className={styles.sectionTitle}>{t(rule.title)}</span>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            backgroundColor:
              rule.key == setupInfo.highlighted ? "beige" : "background.paper",
          }}
        >
          {rule.rules.map((rule) => generateSetupcomponent(rule))}
        </AccordionDetails>
      </Accordion>
    );
  };

  const generateSetupcomponent = (rule) => {
    if (rule.startsWith("validation_")) {
      return (
        <ValidationSetupItem
          t={t}
          rule={rule}
          key={setupInfo.code + rule}
          code={setupInfo.code}
        />
      );
    }

    switch (rule) {
      case "theme":
        return <Theming t={t} key={setupInfo.code + rule} />;
      case "maxChars":
        return (
          <FieldSize
            label={t("text_field_size")}
            rule={rule}
            lowerBound={1}
            upperBound={500}
            defaultValue={20}
            code={setupInfo.code}
            key={setupInfo.code + rule}
          />
        );
      case "minRows":
        return (
          <FieldSize
            label={t("textarea_lines")}
            lowerBound={1}
            upperBound={500}
            code={setupInfo.code}
            defaultValue={20}
            key={setupInfo.code + rule}
          />
        );
      case "hideText":
        return (
          <ToggleValue
            key={setupInfo.code + rule}
            label={t("hide_text")}
            rule={rule}
            code={setupInfo.code}
          />
        );
        case "showDescription":
          return (
            <ToggleValue
              key={setupInfo.code + rule}
              label={t("show_description")}
              rule={rule}
              code={setupInfo.code}
            />
          );
      case "showWordCount":
        return (
          <ToggleValue
            key={setupInfo.code + rule}
            label={t("show_word_count")}
            rule={rule}
            code={setupInfo.code}
          />
        );
      case "navigationMode":
        return <NavigationMode key={setupInfo.code + rule} />;
      case "allowPrevious":
        return (
          <ToggleValue
            key={setupInfo.code + rule}
            label={t("allow_previous")}
            rule={rule}
            code={setupInfo.code}
          />
        );
      case "allowIncomplete":
        return (
          <ToggleValue
            key={setupInfo.code + rule}
            label={t("allow_incomplete")}
            rule={rule}
            code={setupInfo.code}
          />
        );
      case "allowJump":
        return (
          <ToggleValue
            key={setupInfo.code + rule}
            label={t("allow_jump")}
            rule={rule}
            code={setupInfo.code}
          />
        );
      case "skipInvalid":
        return (
          <ToggleValue
            key={setupInfo.code + rule}
            label={t("skip_invalid")}
            rule={rule}
            code={setupInfo.code}
          />
        );
      case "hint":
        return (
          <ShowHint t={t} key={setupInfo.code + rule} code={setupInfo.code} />
        );
      case "lower_bound_hint":
        return (
          <ContentEditor
            title={t("lower_bound_hint")}
            objectName="lower_bound_hint"
            key={setupInfo.code + rule}
            code={setupInfo.code}
          />
        );
      case "higher_bound_hint":
        return (
          <ContentEditor
            title={t("upper_bound_hint")}
            objectName="higher_bound_hint"
            key={setupInfo.code + rule}
            code={setupInfo.code}
          />
        );

      case "loop":
        return (
          <ToggleValue
            key={setupInfo.code + rule}
            rule={rule}
            code={setupInfo.code}
            label={t("loop_video")}
          />
        );
      case "audio_only":
        return (
          <ToggleValue
            key={setupInfo.code + rule}
            rule={rule}
            code={setupInfo.code}
            label={t("audio_only")}
          />
        );
      case "fullDayFormat":
        return (
          <ToggleValue
            key={setupInfo.code + rule}
            rule={rule}
            code={setupInfo.code}
            label={t("fullday_format")}
          />
        );
      case "randomize_questions":
      case "prioritize_questions":
      case "randomize_options":
      case "prioritize_options":
      case "randomize_groups":
      case "prioritize_groups":
      case "randomize_rows":
      case "prioritize_rows":
      case "randomize_columns":
      case "prioritize_columns":
        return (
          <OrderPrioritySetup
            t={t}
            key={setupInfo.code + rule}
            rule={rule}
            code={setupInfo.code}
          />
        );
      case "maxDate":
        return (
          <SelectDate
            lowerBound={1}
            code={setupInfo.code}
            key={setupInfo.code + rule}
            label={t("max_date")}
            rule={rule}
          />
        );
      case "minDate":
        return (
          <SelectDate
            key={setupInfo.code + rule}
            label={t("min_date")}
            rule={rule}
            code={setupInfo.code}
          />
        );
      case "dateFormat":
        const listDateFormat = [
          "DD.MM.YYYY",
          "MM.DD.YYYY",
          "YYYY.MM.DD",
          "DD/MM/YYYY",
          "MM/DD/YYYY",
          "YYYY/MM/DD",
        ];
        return (
          <SelectValue
            values={listDateFormat}
            key={setupInfo.code + rule}
            defaultValue="DD.MM.YYYY"
            label={t("date_format")}
            rule={rule}
            code={setupInfo.code}
          />
        );
      case "imageAspectRatio":
        const aspectLabels = [
          "1:1",
          "16:9",
          "4:3",
          "3:2",
          "9:16",
          "3:4",
          "2:3",
        ];
        const aspectValues = [1, 1.7778, 1.3333, 1.5, 0.562, 0.75, 0.6667];
        return (
          <SelectValue
            values={aspectValues}
            labels={aspectLabels}
            key={setupInfo.code + rule}
            defaultValue="1:1"
            label={t("image_aspect_ratio")}
            rule={rule}
            code={setupInfo.code}
          />
        );
      case "columns":
        const columnsOptions = ["1", "2", "3", "4", "6"];
        return (
          <SelectValue
            values={columnsOptions}
            key={setupInfo.code + rule}
            defaultValue="2"
            label={t("columns_number")}
            rule={rule}
            code={setupInfo.code}
          />
        );
      case "imageHeight":
        return (
          <FieldSize
            label={t("image_height")}
            lowerBound={50}
            upperBound={500}
            code={setupInfo.code}
            defaultValue={250}
            rule={rule}
            key={setupInfo.code + rule}
          />
        );

      case "spacing":
        return (
          <FieldSize
            label={t("spacing")}
            lowerBound={2}
            upperBound={32}
            code={setupInfo.code}
            defaultValue={8}
            rule={rule}
            key={setupInfo.code + rule}
          />
        );
      case "skip_logic":
        return (
          <SkipLogic t={t} key={setupInfo.code + rule} code={setupInfo.code} />
        );
      case "relevance":
        return (
          <Relevance t={t} key={setupInfo.code + rule} code={setupInfo.code} />
        );
      default:
        return "";
    }
  };

  return (
    <div ref={passedref} className={styles.leftContent}>
      <div className={styles.close}>
        <IconButton onClick={() => dispatch(resetSetup())}>
          <CloseIcon />
        </IconButton>
      </div>
      {setupInfo.rules?.map((rule, index) => generateSetupSection(rule, index))}
    </div>
  );
}

export default SetupPanel;
