import { accessibleDependencies } from "~/utils/design/access/dependencies";
import { isGroup, isQuestion, stripTags } from "~/utils/design/utils";

export const buildFields = (componentIndices, code, state, mainLang, langList) => {
  let dependencies = accessibleDependencies(componentIndices, code);
  let returnResult = {
    mode: {
      label: "Mode",
      type: "text",
      valueSources: ["value"],
      operators: ["is_offline", "is_online"],
    },
    survey_lang: {
      label: "Language",
      type: "select",
      valueSources: ["value"],
      operators: ["select_any_in", "select_not_any_in"],
      fieldSettings: {
        listValues: langList,
      }
    }
  };
  dependencies.forEach((el) => {
    if (state[el] && (isQuestion(el) || isGroup(el))) {
      returnResult = {
        ...returnResult,
        ...buildField(el, state[el], state, mainLang),
      };
    }
  });
  return returnResult;
};

const buildField = (code, component, state, mainLang) => {
  const label = code + ". " + stripTags(component.content?.label?.[mainLang]);
  if (isGroup(code)) {
    return {
      [code]: {
        label: label,
        type: "text",
        valueSources: ["value"],
        operators: [
          "is_relevant",
          "is_not_relevant",
          "is_valid",
          "is_not_valid",
        ],
      },
    };
  }
  switch (component.type) {
    case "text":
    case "barcode":
    case "email":
      return {
        [code]: {
          label: label,
          type: "text",
          valueSources: ["value"],
          operators: [
            "is_relevant",
            "is_not_relevant",
            "is_valid",
            "is_not_valid",
            "is_void",
            "is_not_void",
            "equal",
            "not_equal",
            "like",
            "not_like",
            "starts_with",
            "ends_with",
          ],
        },
      };
    case "paragraph":
      return {
        [code]: {
          label: label,
          type: "text",
          valueSources: ["value"],
          operators: [
            "is_relevant",
            "is_not_relevant",
            "is_valid",
            "is_not_valid",
            "is_void",
            "is_not_void",
            "like",
            "not_like",
            "starts_with",
            "ends_with",
          ],
        },
      };
    case "number":
      return {
        [code]: {
          label: label,
          type: "number",
          valueSources: ["value"],
          operators: [
            "is_relevant",
            "is_not_relevant",
            "is_valid",
            "is_not_valid",
            "is_void",
            "is_not_void",
            "equal",
            "not_equal",
            "less",
            "less_or_equal",
            "greater",
            "greater_or_equal",
            "between",
            "not_between",
          ],
        },
      };
    case "file_upload":
      return {
        [code]: {
          label: label,
          type: "text",
          valueSources: ["value"],
          operators: [
            "is_relevant",
            "is_not_relevant",
            "is_valid",
            "is_not_valid",
            "is_file_void",
            "is_file_not_void",
          ],
        },
      };
    case "signature":
    case "photo_capture":
    case "video_capture":
      return {
        [code]: {
          label: label,
          type: "text",
          valueSources: ["value"],
          operators: [
            "is_relevant",
            "is_not_relevant",
            "is_valid",
            "is_not_valid",
            "is_file_void",
            "is_file_not_void",
          ],
        },
      };
    case "date":
      return {
        [code]: {
          label: label,
          type: "date",
          valueSources: ["value"],
          operators: [
            "is_relevant",
            "is_not_relevant",
            "is_valid",
            "is_not_valid",
            "is_void",
            "is_not_void",
            "greater_or_equal",
            "less_or_equal",
            "between",
          ],
        },
      };
    case "time":
      return {
        [code]: {
          label: label,
          type: "time",
          valueSources: ["value"],
          operators: [
            "is_relevant",
            "is_not_relevant",
            "is_valid",
            "is_not_valid",
            "is_void",
            "is_not_void",
            "greater_or_equal",
            "less_or_equal",
            "between",
          ],
        },
      };
    case "date_time":
      return {
        [code]: {
          label: label,
          type: "datetime",
          valueSources: ["value"],
          operators: [
            "is_relevant",
            "is_not_relevant",
            "is_valid",
            "is_not_valid",
            "is_void",
            "is_not_void",
            "greater_or_equal",
            "less_or_equal",
            "between",
          ],
        },
      };
    case "image_scq":
    case "scq":
      let scqReturnList = {};
      let scqListValues = {};
      component.children?.forEach((element) => {
        scqListValues[element.code] = stripTags(
          state[element.qualifiedCode].content?.label?.[mainLang]
        );
      });
      scqReturnList[code] = {
        label: label,
        fieldSettings: {
          listValues: scqListValues,
        },

        type: "select",
        valueSources: ["value"],
        operators: [
          "is_relevant",
          "is_not_relevant",
          "is_valid",
          "is_not_valid",
          "is_void",
          "is_not_void",
          "select_any_in",
          "select_not_any_in",
        ],
      };
      let scqOther = component.children?.find((el) => el.code === "Aother");
      if (
        scqOther &&
        state[scqOther.qualifiedCode].children?.find(
          (el) => el.code === "Atext"
        )
      ) {
        scqReturnList[code + "AotherAtext"] = {
          label: `${label} [${
            state[scqOther.qualifiedCode].content?.label?.[mainLang]
          }]`,
          type: "text",
          valueSources: ["value"],
          operators: [
            "is_relevant",
            "is_not_relevant",
            "is_valid",
            "is_not_valid",
            "is_void",
            "is_not_void",
            "equal",
            "not_equal",
            "like",
            "not_like",
            "starts_with",
            "ends_with",
          ],
        };
      }
      return scqReturnList;
    case "image_mcq":
    case "mcq":
      let mcqReturnList = {};
      let mcqListValues = {};
      component.children?.forEach((element) => {
        mcqListValues[element.code] = stripTags(
          state[element.qualifiedCode].content?.label?.[mainLang]
        );
      });
      mcqReturnList[code] = {
        label: label,
        fieldSettings: {
          listValues: mcqListValues,
        },
        type: "multiselect",
        valueSources: ["value"],
        operators: [
          "is_relevant",
          "is_not_relevant",
          "is_valid",
          "is_not_valid",
          "multiselect_equals",
          "multiselect_not_equals",
        ],
      };
      let mcqOther = component.children?.find((el) => el.code === "Aother");
      if (
        mcqOther &&
        state[mcqOther.qualifiedCode].children?.find(
          (el) => el.code === "Atext"
        )
      ) {
        mcqReturnList[code + "AotherAtext"] = {
          label: `${label} [${
            state[mcqOther.qualifiedCode].content?.label?.[mainLang]
          }]`,
          type: "text",
          valueSources: ["value"],
          operators: [
            "is_relevant",
            "is_not_relevant",
            "is_valid",
            "is_not_valid",
            "is_void",
            "is_not_void",
            "equal",
            "not_equal",
            "like",
            "not_like",
            "starts_with",
            "ends_with",
          ],
        };
      }
      return mcqReturnList;
    case "nps":
      let npsReturnList = {};
      component.children?.forEach((element) => {
        mcqListValues[element.code] = stripTags(
          state[element.qualifiedCode].content?.label?.[mainLang]
        );
      });
      npsReturnList[code] = {
        label: label,
        fieldSettings: {
          min: 0,
          max: 10,
        },
        type: "number",
        valueSources: ["value"],
        operators: [
          "is_void",
          "is_not_void",
          "equal",
          "not_equal",
          "less",
          "less_or_equal",
          "greater",
          "greater_or_equal",
          "between",
          "not_between",
        ],
      };
      return npsReturnList;
    case "scq_array":
      let scqArrayReturnList = {};
      let scqArrayListValues = {};
      component.children
        ?.filter((el) => el.type == "column")
        .forEach((element) => {
          scqArrayListValues[element.code] = stripTags(
            state[element.qualifiedCode].content?.label?.[mainLang]
          );
        });

      scqArrayReturnList[code] = {
        label: label,
        type: "text",
        valueSources: ["value"],
        operators: [
          "is_relevant",
          "is_not_relevant",
          "is_valid",
          "is_not_valid",
        ],
      };

      component.children
        ?.filter((el) => el.type == "row")
        .forEach((element) => {
          scqArrayReturnList[code + element.code] = {
            label:
              label +
              " - " +
              stripTags(
                state[element.qualifiedCode].content?.label?.[mainLang]
              ),
            type: "select",
            valueSources: ["value"],
            fieldSettings: { listValues: scqArrayListValues },
            operators: ["select_any_in", "select_not_any_in"],
          };
        });
      return scqArrayReturnList;
    case "ranking":
    case "image_ranking":
      let rankingReturnList = {};
      component.children?.forEach((element) => {
        rankingReturnList[code + element.code] = {
          label:
            label +
            " - " +
            stripTags(state[element.qualifiedCode].content?.label?.[mainLang]),
          type: "number",
          fieldSettings: {
            min: 1,
            max: component.children.length,
          },
          valueSources: ["value"],
          operators: [
            "is_void",
            "is_not_void",
            "equal",
            "not_equal",
            "less",
            "less_or_equal",
            "greater",
            "greater_or_equal",
            "between",
            "not_between",
          ],
        };
      });
      return rankingReturnList;
    default:
      return [];
  }
};
