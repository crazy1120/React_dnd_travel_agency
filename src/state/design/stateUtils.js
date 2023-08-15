import { current } from "@reduxjs/toolkit";
import { fileTypesToMimesArray } from "~/constants/validation";
import { jsonToJs } from "~/utils/design/logicUtils";

export const validationEquation = (
  qualifiedCode,
  component,
  key,
  validation
) => {
  if (
    !validation.isActive ||
    (key == "validation_not_contains" && !validation.not_contains)
  ) {
    return { code: key, remove: true };
  }
  let instructionText = "";
  switch (key) {
    case "validation_required":
      instructionText = requiredText(qualifiedCode, component);
      return booleanActiveInstruction(key, instructionText);
    case "validation_min_char_length":
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&& ${qualifiedCode}.value.length < ${validation.min_length || 0}`;
    case "validation_one_response_per_col":
      console.log(current(component));
      instructionText = `FrankieScripts.hasDuplicates([${component.children
        .filter((el) => el.type == "row")
        .map((el) => el.qualifiedCode + ".value")}].filter(Boolean))`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_max_char_length":
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&& ${qualifiedCode}.value.length > ${validation.max_length || 0}`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_contains":
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&& !${qualifiedCode}.value.includes("${validation.contains || ""}")`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_not_contains":
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&& ${qualifiedCode}.value.includes("${validation.not_contains}")`;
    case "validation_file_types":
      const mimes = fileTypesToMimesArray(validation.fileTypes);
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&& ![${mimes
          .map((el) => '"' + el + '"')
          .join(",")}].includes(${qualifiedCode}.value.type)`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_max_file_size":
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&& ${qualifiedCode}.value.size > ${validation.max_size}`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_pattern":
      if (!isValidRegex(validation.pattern)) {
        return { code: key, remove: true };
      }
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&& !RegExp("${validation.pattern}").test(${qualifiedCode}.value)`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_pattern_email":
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&&  !/^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$/.test(${qualifiedCode}.value)`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_max_word_count":
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&&  FrankieScripts.wordCount(${qualifiedCode}.value) > ${
          validation.max_count || 0
        }`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_min_word_count":
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&&  FrankieScripts.wordCount(${qualifiedCode}.value) < ${
          validation.min_count || 0
        }`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_between":
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&& (${qualifiedCode}.value < ${validation.lower_limit || 0} ` +
        `|| ${qualifiedCode}.value > ${validation.upper_limit || 0})`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_not_between":
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&& (${qualifiedCode}.value >= ${validation.lower_limit || 0} ` +
        `&& ${qualifiedCode}.value <= ${validation.upper_limit || 0})`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_lt":
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&& ${qualifiedCode}.value >= ${validation.number || 0}`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_lte":
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&& ${qualifiedCode}.value > ${validation.number || 0}`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_gt":
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&& ${qualifiedCode}.value <= ${validation.number || 0}`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_gte":
      instructionText =
        `FrankieScripts.isNotVoid(${qualifiedCode}.value) ` +
        `&& ${qualifiedCode}.value < ${validation.number || 0}`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_equals":
      instructionText =
        `FrankieScripts.isVoid(${qualifiedCode}.value) ` +
        `&& ${qualifiedCode}.value != ${validation.number || 0}`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_not_equal":
      instructionText =
        `FrankieScripts.isVoid(${qualifiedCode}.value) ` +
        `&& ${qualifiedCode}.value == ${validation.number || 0}`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_min_option_count":
      instructionText =
        `[${component.children.map(
          (answer) => answer.qualifiedCode + ".value"
        )}].filter(Boolean).length ` + `< ${validation.min_count || 0}`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_max_option_count":
      instructionText =
        `[${component.children.map(
          (answer) => answer.qualifiedCode + ".value"
        )}].filter(Boolean).length ` + `> ${validation.max_count || 0}`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_option_count":
      instructionText =
        `[${component.children.map(
          (answer) => answer.qualifiedCode + ".value"
        )}].filter(Boolean).length ` + `!== ${validation.count || 0}`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_min_ranking_count":
      instructionText =
        `[${component.children.map(
          (answer) => answer.qualifiedCode + ".value"
        )}].filter(Boolean).length ` + `< ${validation.min_count || 0}`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_max_ranking_count":
      instructionText =
        `[${component.children.map(
          (answer) => answer.qualifiedCode + ".value"
        )}].filter(Boolean).length ` + `> ${validation.max_count || 0}`;
      return booleanActiveInstruction(key, instructionText);
    case "validation_ranking_count":
      instructionText =
        `[${component.children.map(
          (answer) => answer.qualifiedCode + ".value"
        )}].filter(Boolean).length ` + `!== ${validation.count || 0}`;
      return booleanActiveInstruction(key, instructionText);
    default:
      break;
  }
};

const booleanActiveInstruction = (key, instructionText) => {
  return {
    code: key,
    text: instructionText,
    isActive: true,
    returnType: { name: "Boolean" },
  };
};

const requiredText = (qualifiedCode, component) => {
  if (
    component.type == "file_upload" ||
    component.type == "signature" ||
    component.type == "photo_capture" ||
    component.type == "video_capture"
  ) {
    return `FrankieScripts.isVoid(${qualifiedCode}.value) || !${qualifiedCode}.value.size || !${qualifiedCode}.value.stored_filename`;
  } else if (component.type == "scq_array") {
    const rows = component.children.filter((child) => child.type == "row");
    return (
      `[${rows.map(
        (answer) => answer.qualifiedCode + ".value"
      )}].filter(Boolean).length ` +
      ` < ` +
      rows.length
    );
  } else {
    return `FrankieScripts.isVoid(${qualifiedCode}.value)`;
  }
};

const isValidRegex = (regex) => {
  if (!regex) {
    return false;
  }
  try {
    new RegExp(regex);
  } catch (e) {
    return false;
  }
  return true;
};

export const cleanupValidationData = (component, key, validation) => {
  switch (key) {
    case "validation_required":
    case "validation_one_response_per_col":
    case "validation_pattern_email":
    case "validation_contains":
    case "validation_not_contains":
    case "validation_pattern":
    case "validation_max_word_count":
    case "validation_min_word_count":
    case "validation_between":
    case "validation_not_between":
    case "validation_lt":
    case "validation_lte":
    case "validation_gt":
    case "validation_gte":
    case "validation_equals":
    case "validation_not_equal":
      return validation;
    case "validation_min_char_length":
      return {
        ...validation,
        min_length: Math.min(component.maxChars || 30, validation.min_length),
      };
    case "validation_max_char_length":
      return {
        ...validation,
        max_length: Math.max(component.maxChars || 30, validation.max_length),
      };
    case "validation_min_ranking_count":
    case "validation_min_option_count":
      return {
        ...validation,
        min_count: Math.min(component.children.length, validation.min_count),
      };
    case "validation_max_ranking_count":
    case "validation_max_option_count":
      return {
        ...validation,
        max_count: Math.min(component.children.length, validation.max_count),
      };
    case "validation_ranking_count":
    case "validation_option_count":
      return {
        ...validation,
        count: Math.min(component.children.length, validation.count),
      };
    default:
      return validation;
  }
};

export const buildValidationDefaultData = (rule) => {
  switch (rule) {
    case "validation_required":
    case "validation_one_response_per_col":
    case "validation_pattern_email":
      return {};
    case "validation_min_char_length":
      return {
        min_length: 2,
      };
    case "validation_max_char_length":
      return {
        max_length: 30,
      };
    case "validation_contains":
      return {
        contains: "",
      };
    case "validation_not_contains":
      return {
        not_contains: "",
      };
    case "validation_pattern":
      return {
        pattern: "",
      };
    case "validation_max_word_count":
      return {
        max_count: 300,
      };
    case "validation_min_word_count":
      return {
        min_count: 300,
      };
    case "validation_between":
      return {
        lower_limit: 20,
        upper_limit: 100,
      };
    case "validation_not_between":
      return {
        lower_limit: 20,
        upper_limit: 100,
      };
    case "validation_lt":
      return {
        number: 20,
      };
    case "validation_lte":
      return {
        number: 20,
      };
    case "validation_gt":
      return {
        number: 20,
      };
    case "validation_gte":
      return {
        number: 20,
      };
    case "validation_equals":
      return {
        number: 20,
      };
    case "validation_not_equal":
      return {
        number: 20,
      };
    case "validation_min_ranking_count":
    case "validation_min_option_count":
      return {
        min_count: 1,
      };
    case "validation_max_ranking_count":
    case "validation_max_option_count":
      return {
        max_count: 1,
      };
    case "validation_ranking_count":
    case "validation_option_count":
      return {
        count: 1,
      };
    case "validation_file_types":
      return {
        fileTypes: ["image"],
      };
    case "validation_max_file_size":
      return {
        max_size: 250,
      };
    default:
      throw "unrecognized rule " + rule;
  }
};

export const scqSkipEquations = (qualifiedCode, component, skipLogic) => {
  const instructionList = [];
  component.children.forEach((el) => {
    const key = el.code;
    const skipObj = skipLogic[key];
    const instructionCode = "skip_to_on_" + key;
    if (!skipObj || !skipObj.skipTo || skipObj.skipTo == "proceed") {
      instructionList.push({ code: instructionCode, remove: true });
    } else {
      const originalInstruction = component.instructionList.find(
        (el) => el.code == instructionCode
      );
      const instruction = {
        code: instructionCode,
        condition: qualifiedCode + '.value == "' + key + '"',
        isActive: true,
        toEnd: skipObj.toEnd || false,
        skipToComponent: skipObj.skipTo,
      };
      instructionList.push(instruction);
    }
  });
  return instructionList;
};

export const conditionalRelevanceEquation = (logic, rule, state) => {
  const code = "conditional_relevance";
  if (rule == "show_always") {
    return { code, remove: true };
  } else if (rule == "hide_always") {
    return {
      code,
      text: "false",
      isActive: false,
      returnType: { name: "Boolean" },
    };
  }
  const text = jsonToJs(logic, false, (code) => state[code].type);
  if (rule == "show_if") {
    return { code, text, isActive: true, returnType: { name: "Boolean" } };
  } else if (rule == "hide_if") {
    return {
      code,
      text: `!${text}`,
      isActive: true,
      returnType: { name: "Boolean" },
    };
  } else {
    throw "WTF";
  }
};

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const nextGroupId = (groups) => {
  if (groups && groups.length) {
    return (
      groups
        .map((group) => parseInt(group.code.replace("G", "")))
        .sort(function (a, b) {
          return a - b;
        })[groups.length - 1] + 1
    );
  }
  return 1;
};

export const nextQuestionId = (state, groups) => {
  if (groups.length) {
    let questions = [];
    groups.forEach((group) => {
      let groupObj = state[group.code];
      if (groupObj.children) {
        groupObj.children.forEach((question) => {
          questions.push(parseInt(question.code.replace("Q", "")));
        });
      }
    });
    if (questions.length) {
      return (
        questions.sort(function (a, b) {
          return a - b;
        })[questions.length - 1] + 1
      );
    }
  }
  return 1;
};

export const buildReferenceInstruction = (content, name, key) => {
  const allMatches = getAllMatches(content);
  if (allMatches.length) {
    return {
      code: `reference_${name}_${key}`,
      references: allMatches,
      lang: key,
    };
  } else {
    return {
      code: `reference_${name}_${key}`,
      remove: true,
    };
  }
};

const getAllMatches = (inputString) => {
  const regex = /data-instruction=(\"|\')([\w\.!\"!\']+)(\"|\')/g;
  var m;
  var returnList = [];

  do {
    m = regex.exec(inputString);
    if (m) {
      returnList.push(m[2]);
    }
  } while (m);
  return returnList;
};
