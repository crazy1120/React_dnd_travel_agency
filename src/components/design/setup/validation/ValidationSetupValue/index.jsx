import { TextField } from "@mui/material";
import styles from "./ValidationSetupValue.module.css";
import { useDispatch } from "react-redux";
import { changeValidationValue } from "~/state/design/designState";
import { useSelector } from "react-redux";
import FileType from "../../FileType";

function ValidationSetupValue({ code, validation, rule, t }) {
  const bounds = useSelector((state) => {
    switch (rule) {
      case "validation_min_char_length":
        return [1, Number.MAX_VALUE];
      case "validation_max_file_size":
        return [1, Number.MAX_VALUE];
      case "validation_max_char_length":
        return [1, Number.MAX_VALUE];
      case "validation_max_word_count":
        return [1, Number.MAX_VALUE];
      case "validation_min_word_count":
        return [1, Number.MAX_VALUE];
      case "validation_min_ranking_count":
      case "validation_min_option_count":
        return [1, state.designState[code].children?.length || 0];
      case "validation_max_ranking_count":
      case "validation_max_option_count":
        return [1, state.designState[code].children?.length || 0];
      case "validation_ranking_count":
      case "validation_option_count":
        return [1, state.designState[code].children?.length || 0];
      default:
        return undefined;
    }
  });

  const dispatch = useDispatch();

  const onChange = (key, value) => {
    dispatch(changeValidationValue({ rule, code, key, value }));
  };

  const onValuesUpdate = (key, value) => {
    onChange(
      key,
      typeof bounds === "undefined"
        ? value
        : Math.max(bounds[0], Math.min(bounds[1], value))
    );
  };

  let keys = validationAttributes(validation);

  const hasSubtitle =
    rule != "validation_required" &&
    rule != "validation_one_response_per_col" &&
    rule != "validation_pattern_email" &&
    rule != "validation_file_types";

  return (
    <div className={styles.valueValidationItemsContainer}>
      {keys && hasSubtitle && <div>{t(rule + "_subtitle")}</div>}
      <div className={styles.valueValidationItems}>
        {rule == "validation_file_types" ? (
          <FileType
            value={validation.fileTypes}
            onValueChanged={(value) => onValuesUpdate("fileTypes", value)}
          />
        ) : (
          keys.map((i) => {
            const isInError =
              typeof bounds !== "undefined" &&
              (validation[i] < bounds[0] || validation[i] > bounds[1]);
            return (
              <TextField
                key={i}
                error={isInError}
                value={validation[i]}
                variant="outlined"
                size="small"
                type={typeof validation[i] === "number" ? "number" : "text"}
                onChange={(event) =>
                  onValuesUpdate(
                    i,
                    typeof validation[i] === "number"
                      ? parseInt(event.target.value)
                      : event.target.value
                  )
                }
                style={{ maxWidth: "150px", marginLeft: "8px" }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

const validationAttributes = (validation) => {
  return Object.keys(validation).filter(
    (el) =>
      ![
        "content",
        "isActive",
        "isCustomErrorActive",
        "bounds",
        "fileTypes",
      ].includes(el)
  );
};

export default ValidationSetupValue;
