import { createSlice, current } from "@reduxjs/toolkit";
import { isEquivalent } from "~/utils/design/utils";
import { createGroup } from "~/components/design/NewComponentsPanel";

import { instructionByCode, lastIndexInArray } from "~/utils/design/utils";
import cloneDeep from "lodash.clonedeep";
import {
  buildValidationDefaultData,
  cleanupValidationData,
  conditionalRelevanceEquation,
  scqSkipEquations,
  validationEquation,
  nextGroupId,
  nextQuestionId,
  reorder,
  buildReferenceInstruction,
} from "./stateUtils";
import { setupOptions } from "~/constants/design";
import {
  createQuestion,
  questionDesignError,
} from "~/components/Questions/utils";

const reservedKeys = ["setup"];

export const designState = createSlice({
  name: "designState",
  initialState: { state: {} },
  reducers: {
    designStateReceived: (state, action) => {
      let keys = Object.keys(state).filter((el) => !reservedKeys.includes(el));
      let newState = action.payload;
      keys = Object.keys(newState);
      keys.forEach((key) => {
        if (!isEquivalent(state[key], newState[key])) {
          state[key] = newState[key];
        }
      });
    },
    setup(state, action) {
      const payload = action.payload;
      // we want to ignore multiple clicks on the same setup button
      // but acknowledge when we highlight or expand a specific section
      if (
        payload.code != state.setup?.code ||
        !isEquivalent(payload.rules, state.setup?.rules) ||
        payload.expanded ||
        payload.highlighted
      ) {
        state.setup = action.payload;
      }
    },
    newVersionReceived(state, action) {
      const payload = action.payload;
      state.versionDto = payload;
    },
    setupToggleExpand(state, action) {
      const key = action.payload;
      if (!state.setup.expanded) {
        state.setup.expanded = [];
      }
      if (!state.setup.expanded.includes(key)) {
        state.setup.expanded.push(key);
      } else {
        state.setup.expanded.splice(state.setup.expanded.indexOf(key), 1);
      }
    },
    changeValidationValue(state, action) {
      let payload = action.payload;
      if (!state[payload.code]["validation"]) {
        state[payload.code]["validation"] = {};
      }
      if (!state[payload.code]["validation"][payload.rule]) {
        state[payload.code]["validation"][payload.rule] =
          buildValidationDefaultData(payload.rule);
      }
      state[payload.code]["validation"][payload.rule][payload.key] =
        payload.value;
      processValidation(
        state,
        payload.code,
        payload.rule,
        payload.rule != "content"
      );
    },
    resetSetup(state) {
      delete state["setup"];
    },
    changeAttribute: (state, action) => {
      let payload = action.payload;
      if (
        action.payload.key == "content" ||
        action.payload.key == "instructionList" ||
        action.payload.key == "relevance" ||
        action.payload.key == "resources"
      ) {
        throw "We are changing attributes way too much than we should";
      }

      state[payload.code][payload.key] = payload.value;
      if (action.payload.key == "maxChars") {
        cleanupValidation(state, payload.code);
      } else if (action.payload.key == "dateFormat") {
        addMaskedValuesInstructions(payload.code, state[payload.code], state);
      } else if (action.payload.key == "fullDayFormat") {
        addMaskedValuesInstructions(payload.code, state[payload.code], state);
      } else if (
        [
          "randomize_questions",
          "randomize_groups",
          "randomize_options",
          "randomize_rows",
          "randomize_columns",
        ].indexOf(action.payload.key) > -1
      ) {
        updateRandomByRule(state[payload.code], action.payload.key);
      } else if (
        [
          "prioritize_questions",
          "prioritize_groups",
          "prioritize_options",
          "prioritize_rows",
          "prioritize_columns",
        ].indexOf(action.payload.key) > -1
      ) {
        if (!payload.value) {
          removeInstruction(state[payload.code], "priority_groups");
        }
      }
    },
    toggleComponentCollapse: (state, action) => {
      let groupCode = action.payload;
      state[groupCode].collapsed = !(state[groupCode].collapsed || false);
    },
    changeRelevance: (state, action) => {
      let payload = action.payload;
      state[payload.code].relevance = payload.value;
      addRelevanceInstructions(state, payload.code, payload.value);
    },
    cloneQuestion: (state, action) => {
      const code = action.payload;
      const survey = state.Survey;
      const group = survey.children
        ?.map((group) => state[group.code])
        ?.filter(
          (group) =>
            group.children &&
            group.children.findIndex((child) => child.code == code) !== -1
        )?.[0];
      if (!group) {
        return;
      }
      const newQuestionId = "Q" + nextQuestionId(state, survey.children);
      const questionChild = group.children.find((el) => el.code == code);
      const newQuestion = {
        type: questionChild.type,
        code: newQuestionId,
        qualifiedCode: newQuestionId,
      };
      creatNewState(state, state[code], newQuestionId, code, newQuestionId);
      group.children.splice(
        group.children.indexOf(questionChild) + 1,
        0,
        newQuestion
      );
      designState.caseReducers.setup(state, {
        payload: { code: newQuestionId, rules: setupOptions(newQuestion.type) },
      });
      cleanupRandomRules(group);
    },
    removeAnswer: (state, action) => {
      const answerQualifiedCode = action.payload;
      const codes = splitQuestionCodes(answerQualifiedCode);
      let question = state[codes[0]];
      question.children = question.children.filter(
        (el) => el.code !== codes[1]
      );
      delete state[answerQualifiedCode];
      // could be otherText
      if (state.setup?.code?.includes(answerQualifiedCode)) {
        designState.caseReducers.resetSetup(state);
      }
      question.designErrors = questionDesignError(question);
      cleanupValidation(state, codes[0]);
      addMaskedValuesInstructions(codes[0], question, state);
      cleanupRandomRules(question);
    },
    addNewAnswer: (state, action) => {
      const lang = state.langInfo.mainLang;
      const payload = action.payload;
      const answer = payload.answer;
      const label = payload.label;
      const instructionList = payload.instructionList;
      const qualifiedCode = answer.qualifiedCode;
      state[qualifiedCode] = {};
      if (!insertAnswer(state, answer)) {
        return;
      }
      if (label) {
        state[qualifiedCode].content = { label: { [lang]: label } };
      }
      if (answer.type) {
        state[qualifiedCode].type = answer.type;
      }
      instructionList?.forEach((instruction) =>
        changeInstruction(state[qualifiedCode], instruction)
      );
    },
    deleteGroup: (state, action) => {
      const groupCode = action.payload;
      if (state.setup?.code == groupCode) {
        designState.caseReducers.resetSetup(state);
      }
      if (state[groupCode].groupType == "END") {
        state.error = {
          message: "There must always be an end group. for an end message ",
        };
        return;
      }
      const survey = state.Survey;
      const index = survey.children?.findIndex((x) => x.code === groupCode);
      survey.children.splice(index, 1);
      delete state[groupCode];
      cleanupRandomRules(survey);
    },
    deleteQuestion: (state, action) => {
      const questionCode = action.payload;
      if (state.setup?.code == questionCode) {
        designState.caseReducers.resetSetup(state);
      }
      const survey = state.Survey;
      const group = survey.children
        ?.map((group) => state[group.code])
        ?.filter(
          (group) =>
            group.children &&
            group.children.findIndex((child) => child.code == questionCode) !==
              -1
        )?.[0];
      if (!group) {
        return;
      }
      const questionIndex = group.children.findIndex(
        (x) => x.code === questionCode
      );
      let children = [...group.children];
      if (children.length === 1) {
        group.children = [];
      } else {
        group.children.splice(questionIndex, 1);
      }
      delete state[questionCode];
      cleanupRandomRules(group);
    },
    onAddComponentsVisibilityChange: (state, action) => {
      state.addComponentsVisibility = action.payload;
    },
    changeContent: (state, action) => {
      let payload = action.payload;
      if (!state[payload.code].content) {
        state[payload.code].content = {};
        state[payload.code].content[payload.key] = {};
      } else if (!state[payload.code].content[payload.key]) {
        state[payload.code].content[payload.key] = {};
      }
      const referenceInstruction = buildReferenceInstruction(
        payload.value,
        payload.key,
        payload.lang
      );
      changeInstruction(state[payload.code], referenceInstruction);
      state[payload.code].content[payload.key][payload.lang] = payload.value;
    },
    changeResources: (state, action) => {
      let payload = action.payload;
      if (!state[payload.code].resources) {
        state[payload.code].resources = {};
      }
      state[payload.code].resources[payload.key] = payload.value;
    },
    updateRandom: (state, action) => {
      const payload = action.payload;
      const componentState = state[payload.code];
      if (payload.groups) {
        const instruction = { code: "random_group", groups: payload.groups };
        changeInstruction(componentState, instruction);
      } else {
        removeInstruction(componentState, "random_group");
      }
    },
    updatePriority: (state, action) => {
      const payload = action.payload;
      const componentState = state[payload.code];
      if (payload.priorities) {
        const instruction = {
          code: "priority_groups",
          priorities: payload.priorities,
        };
        changeInstruction(componentState, instruction);
      } else {
        removeInstruction(componentState, "priority_groups");
      }
    },
    updateRandomByType: (state, action) => {
      const payload = action.payload;
      const componentState = state[payload.code];
      const otherChildrenCodes = state[payload.code]?.children
        ?.filter((el) => el.type !== payload.type)
        ?.map((el) => el.code);
      const randomInstruction = instructionByCode(
        componentState,
        "random_group"
      );
      const otherRandomOrders =
        randomInstruction?.groups?.filter(
          (x) => x.length && x.some((elem) => otherChildrenCodes.includes(elem))
        ) || [];
      const groups = payload.groups.concat(otherRandomOrders);
      if (groups) {
        const instruction = { code: "random_group", groups };
        changeInstruction(componentState, instruction);
      } else {
        removeInstruction(componentState, "random_group");
      }
    },
    updatePriorityByType: (state, action) => {
      const payload = action.payload;
      const componentState = state[payload.code];
      const otherChildrenCodes = state[payload.code]?.children
        ?.filter((el) => el.type !== payload.type)
        ?.map((el) => el.code);
      const priorityInstruction = instructionByCode(
        componentState,
        "priority_groups"
      );
      const otherPriorities =
        priorityInstruction?.priorities?.filter(
          (x) =>
            x && x.weights.some((el) => otherChildrenCodes.includes(el.code))
        ) || [];
      const priorities = payload.priorities.concat(otherPriorities);
      if (priorities) {
        const instruction = { code: "priority_groups", priorities };
        changeInstruction(componentState, instruction);
      } else {
        removeInstruction(componentState, "priority_groups");
      }
    },
    removeSkipDestination: (state, action) => {
      const payload = action.payload;
      delete state[payload.code].skip_logic[payload.answerCode];
      addSkipInstructions(state, payload.code, state[payload.code].skip_logic);
    },
    editSkipDestination: (state, action) => {
      const payload = action.payload;
      if (!state[payload.code].skip_logic) {
        state[payload.code].skip_logic = {};
      }
      if (!state[payload.code].skip_logic[payload.answerCode]) {
        state[payload.code].skip_logic[payload.answerCode] = {};
      }
      if (
        state[payload.code].skip_logic?.[payload.answerCode].skipTo !==
        payload.skipTo
      ) {
        state[payload.code].skip_logic[payload.answerCode] = {
          skipTo: payload.skipTo,
        };
        addSkipInstructions(
          state,
          payload.code,
          state[payload.code].skip_logic
        );
      }
    },
    editSkipToEnd: (state, action) => {
      const payload = action.payload;
      state[payload.code].skip_logic[payload.answerCode].toEnd = payload.toEnd;
      addSkipInstructions(state, payload.code, state[payload.code].skip_logic);
    },
    onBaseLangChanged: (state, action) => {
      state.langInfo.mainLang = action.payload.code;
      state.Survey.defaultLang = action.payload;
      state.Survey.additionalLang = state.Survey.additionalLang?.filter(
        (language) => language.code !== action.payload.code
      );
      state.langInfo.lang = action.payload.code;
      state.langInfo.onMainLang = true;
      state.langInfo.languagesList = [action.payload].concat(
        state.Survey.additionalLang || []
      );
    },
    onAdditionalLangAdded: (state, action) => {
      console.log(action.payload);
      state.Survey.additionalLang = (state.Survey.additionalLang || []).concat(
        action.payload
      );
      state.langInfo.languagesList = [state.Survey.defaultLang].concat(
        state.Survey.additionalLang || []
      );
    },
    onAdditionalLangRemoved: (state, action) => {
      state.Survey.additionalLang = state.Survey.additionalLang.filter(
        (language) => language.code !== action.payload.code
      );
      state.langInfo.languagesList = [state.Survey.defaultLang].concat(
        state.Survey.additionalLang || []
      );
    },
    changeLang: (state, action) => {
      state.langInfo.lang = action.payload;
      state.langInfo.onMainLang =
        state.langInfo.lang == state.langInfo.mainLang;
    },
    onResetLang: (state) => {
      state.langInfo.lang = state.langInfo.mainLang;
      state.langInfo.onMainLang = true;
    },
    setSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    setUpdating: (state, action) => {
      state.isUpdating = action.payload;
    },
    onDrag: (state, action) => {
      const payload = action.payload;
      switch (payload.type) {
        case "reorder_questions":
          reorderQuestions(state, state.Survey, payload);
          break;
        case "reorder_groups":
          reorderGroups(state.Survey, payload);
          break;
        case "reorder_answers":
          reorderAnswers(state, payload);
          break;
        case "reorder_answers_by_type":
          reorderAnswersByType(state, payload);
          break;
        case "new_question":
          newQuestion(state, payload);
          break;
        case "new_group":
          if (payload.groupType == "group") {
            newGroup(state, payload);
          } else if (
            payload.groupType == "end" ||
            payload.groupType == "welcome"
          ) {
            specialGroup(state, payload);
          }
          break;
          // do nothing
          deafult: break;
      }
    },
    collapseAllGroups: (state) => {
      state.Survey.children.forEach(
        (group) => (state[group.code].collapsed = true)
      );
    },
      onError: (state, action) => {
      state.error = action.payload || false;
    },
    onErrorSeen: (state) => {
      state.error.seen = true;
    },
  },
});

export const {
  newVersionReceived,
  designStateReceived,
  onBaseLangChanged,
  onAdditionalLangAdded,
  onAdditionalLangRemoved,
  changeLang,
  onResetLang,
  onAddComponentsVisibilityChange,
  changeAttribute,
  changeTimeFormats,
  changeContent,
  changeResources,
  deleteQuestion,
  cloneQuestion,
  deleteGroup,
  addNewAnswer,
  removeAnswer,
  setup,
  setupToggleExpand,
  resetSetup,
  changeValidationValue,
  updateRandom,
  updatePriority,
  updateRandomByType,
  updatePriorityByType,
  removeSkipDestination,
  editSkipDestination,
  editSkipToEnd,
  changeRelevance,
  onDrag,
  collapseAllGroups,
  toggleComponentCollapse,
  setSaving,
  setUpdating,
  onError,
  onErrorSeen,
} = designState.actions;

export default designState.reducer;

const changeInstruction = (componentState, instruction) => {
  if (typeof componentState.instructionList === "undefined") {
    componentState.instructionList = [];
  }
  if (instruction.remove) {
    removeInstruction(componentState, instruction.code);
  } else {
    editInstruction(componentState, instruction);
  }
};

// there is always an assumption that instructionList exists!!!
const removeInstruction = (componentState, code) => {
  if (componentState.instructionList.length) {
    const index = componentState.instructionList.findIndex(
      (el) => el.code === code
    );
    if (index < 0) {
      return;
    } else if (componentState.instructionList.length == 1) {
      componentState.instructionList = [];
    } else {
      componentState.instructionList.splice(index, 1);
    }
  }
};

const cleanupRandomRules = (componentState) => {
  if (componentState["randomize_questions"]) {
    updateRandomByRule(componentState, "randomize_questions");
  } else if (componentState["randomize_groups"]) {
    updateRandomByRule(componentState, "randomize_groups");
  } else if (componentState["randomize_options"]) {
    updateRandomByRule(componentState, "randomize_options");
  } else if (componentState["randomize_rows"]) {
    updateRandomByRule(componentState, "randomize_rows");
  } else if (componentState["randomize_columns"]) {
    updateRandomByRule(componentState, "randomize_columns");
  }
};

const updateRandomByRule = (componentState, randomRule) => {
  console.log(current(componentState));
  if (
    ["randomize_questions", "randomize_groups", "randomize_options"].indexOf(
      randomRule
    ) > -1 &&
    componentState[randomRule] !== "custom"
  ) {
    const childCodes = componentState.children
      ?.filter(
        (it) =>
          it.groupType?.toLowerCase() != "end" &&
          it.groupType?.toLowerCase() != "welcome"
      )
      ?.map((it) => it.code);
    if (childCodes.length == 0 || !componentState[randomRule]) {
      componentState[randomRule] = false;
      removeInstruction(componentState, "random_group");
      return;
    }
    const instruction = {
      code: "random_group",
      groups: [{ codes: childCodes, randomOption: componentState[randomRule] }],
    };
    changeInstruction(componentState, instruction);
  } else if (
    ["randomize_rows"].indexOf(randomRule) > -1 &&
    componentState[randomRule] !== "custom"
  ) {
    const childCodes = componentState.children
      ?.filter((child) => child.type == "row")
      ?.map((it) => it.code);
    if (childCodes.length == 0 || !componentState[randomRule]) {
      componentState[randomRule] = false;
      removeInstruction(componentState, "random_group");
      return;
    }
    const instruction = {
      code: "random_group",
      groups: [{ codes: childCodes, randomOption: componentState[randomRule] }],
    };
    changeInstruction(componentState, instruction);
  } else if (
    ["randomize_columns"].indexOf(randomRule) > -1 &&
    componentState[randomRule] !== "custom"
  ) {
    const childCodes = componentState.children
      ?.filter((child) => child.type == "column")
      ?.map((it) => it.code);
    if (childCodes.length == 0 || !componentState[randomRule]) {
      componentState[randomRule] = false;
      removeInstruction(componentState, "random_group");
      return;
    }
    const instruction = {
      code: "random_group",
      groups: [{ codes: childCodes, randomOption: componentState[randomRule] }],
    };
    changeInstruction(componentState, instruction);
  }
};

// there is always an assumption that instructionList exists!!!
const editInstruction = (componentState, instruction) => {
  const index = componentState.instructionList.findIndex(
    (el) => el.code === instruction.code
  );
  if (index < 0) {
    componentState.instructionList.push(instruction);
  } else {
    componentState.instructionList[index] = instruction;
  }
};

const reorderQuestions = (state, survey, payload) => {
  let index = buildIndex(state, survey.children);
  const sourceGroup = state[payload.source];
  const destinationGroup = state[payload.destination];
  const sourceQuestionIndex = sourceGroup.children.findIndex(
    (question) => question.code == payload.id
  );
  const destinationQuestionIndex =
    payload.toIndex - index.indexOf(payload.destination) - 1;
  const question = sourceGroup.children[sourceQuestionIndex];
  sourceGroup.children.splice(sourceQuestionIndex, 1);
  if (!destinationGroup.children) {
    destinationGroup.children = [];
  }
  destinationGroup.children.splice(destinationQuestionIndex, 0, question);
  cleanupRandomRules(destinationGroup);
  cleanupRandomRules(sourceGroup);
};

const newQuestion = (state, payload) => {
  const survey = state.Survey;
  let index = buildIndex(state, survey.children);
  let questionId = nextQuestionId(state, survey.children);
  const questionObject = createQuestion(
    payload.questionType,
    questionId,
    state.langInfo.mainLang
  );
  const destinationGroup = state[payload.destination];
  const destinationQuestionIndex =
    payload.toIndex - index.indexOf(payload.destination) - 1;
  if (!destinationGroup.children) {
    destinationGroup.children = [];
  }
  Object.keys(questionObject)
    .filter((key) => key != "question")
    .forEach((key) => {
      state[key] = questionObject[key];
    });
  const newCode = `Q${questionId}`;
  addMaskedValuesInstructions(newCode, questionObject[newCode], state);
  destinationGroup.children.splice(
    destinationQuestionIndex,
    0,
    questionObject.question
  );
  cleanupRandomRules(destinationGroup);
};

const newGroup = (state, payload) => {
  const survey = state.Survey;
  let index = buildIndex(state, survey.children);
  const toIndex = survey.children?.findIndex(
    (group) => group.code == index[payload.toIndex]
  );
  const group = createGroup(
    "GROUP",
    nextGroupId(survey.children),
    state.langInfo.mainLang
  );
  if (!survey.children) {
    survey.children = [];
  }
  if (toIndex == -1) {
    survey.children.push(group.newGroup);
  } else {
    survey.children.splice(toIndex, 0, group.newGroup);
  }
  state[group.newGroup.code] = group.state;
  cleanupRandomRules(survey);
};

const specialGroup = (state, payload) => {
  const survey = state.Survey;
  if (!survey.children) {
    survey.children = [];
  }
  const index = survey.children.findIndex(
    (group) => state[group.code].groupType?.toLowerCase() === payload.groupType
  );
  if (index !== -1) {
    state.error = {
      message:
        "cannot have duplicate " +
        (payload.groupType == "welcome" ? "Welcome groups" : "End groups"),
    };
    return;
  }
  if (payload.groupType == "welcome") {
    const group = createGroup(
      "WELCOME",
      nextGroupId(survey.children),
      state.langInfo.mainLang
    );
    survey.children.splice(0, 0, group.newGroup);
    state[group.newGroup.code] = group.state;
  } else if (payload.groupType == "end") {
    const group = createGroup(
      "END",
      nextGroupId(survey.children),
      state.langInfo.mainLang
    );
    survey.children.push(group.newGroup);
    state[group.newGroup.code] = group.state;
  }
};

const reorderGroups = (survey, payload) => {
  survey.children = reorder(
    survey.children,
    payload.fromIndex,
    payload.toIndex
  );
};
const reorderAnswers = (state, payload) => {
  const codes = splitQuestionCodes(payload.id);
  const parentCode = codes.slice(0, codes.length - 1).join("");
  const component = state[parentCode];
  component.children = reorder(
    component.children,
    payload.fromIndex,
    payload.toIndex
  );
};
const reorderAnswersByType = (state, payload) => {
  const codes = splitQuestionCodes(payload.id);
  const parentCode = codes.slice(0, codes.length - 1).join("");
  const component = state[parentCode];
  const type = state[payload.id].type;
  const filteredChildren = component.children.filter(
    (child) => child.type == type
  );
  const fromIndex = component.children.indexOf(
    filteredChildren[payload.fromIndex]
  );
  const toIndex = component.children.indexOf(filteredChildren[payload.toIndex]);
  component.children = reorder(component.children, fromIndex, toIndex);
};

const insertAnswer = (state, answer) => {
  const codes = splitQuestionCodes(answer.qualifiedCode);
  const parentCode = codes.slice(0, codes.length - 1).join("");
  const component = state[parentCode];
  if (component) {
    if (!component.children) {
      component.children = [];
    }
    const insertIndex = lastIndexInArray(
      component.children,
      (child) => child.type == answer.type || !child.type
    );
    component.children.splice(insertIndex + 1, 0, answer);
    component.designErrors = questionDesignError(component);
    cleanupValidation(state, parentCode);
    addMaskedValuesInstructions(parentCode, component, state);
    cleanupRandomRules(component);
    return true;
  } else {
    return false;
  }
};

export const buildIndex = (state, groups) => {
  let retrunRestult = [];
  groups?.forEach((group) => {
    retrunRestult.push(group.code);
    let groupObj = state[group.code];
    if (groupObj.children && !groupObj.collapsed) {
      groupObj.children.forEach((question) => {
        retrunRestult.push(question.code);
      });
    }
  });
  return retrunRestult;
};

const splitQuestionCodes = (code) => {
  return code.split(/(A[a-z_0-9]+|Q[a-z_0-9]+)/).filter(Boolean);
};

const addValidationEquation = (state, qualifiedCode, rule) => {
  const component = state[qualifiedCode];
  const validationInstruction = validationEquation(
    qualifiedCode,
    component,
    rule,
    component["validation"][rule]
  );
  changeInstruction(component, validationInstruction);
};

const processValidation = (state, code, rule, modifyEquation) => {
  const component = state[code];
  if (component.designErrors && component.designErrors.length) {
    component.validation[rule].isActive = false;
    removeInstruction(component, rule);
    return;
  }
  component.validation[rule] = cleanupValidationData(
    component,
    rule,
    component.validation[rule]
  );
  // we have this special situation that the SCQ array validation is copied to its children
  // This is specifically important when an SCQ array is implemented at SCQ in smaller screens
  if (component.type == "scq_array" && rule == "validation_required") {
    component.children
      .filter((child) => child.type == "row")
      .forEach((row) => {
        const child = state[row.qualifiedCode];
        if (!child.validation) {
          child.validation = {};
        }
        child.validation[rule] = component.validation[rule];
        addValidationEquation(state, row.qualifiedCode, rule);
      });
    return;
  }
  if (modifyEquation) {
    addValidationEquation(state, code, rule);
  }
};

const cleanupValidation = (state, code) => {
  const component = state[code];
  if (!component.validation) {
    return;
  }
  const ruleKeys = Object.keys(component["validation"]);
  ruleKeys.forEach((key) => processValidation(state, code, key, true));
};

const addSkipInstructions = (state, code, skipLogic) => {
  const component = state[code];
  if (component.type != "scq" && component.type != "image_scq") {
    return;
  }
  const instructions = scqSkipEquations(code, component, skipLogic);
  instructions.forEach((instruction) => {
    changeInstruction(state[code], instruction);
  });
};

const addRelevanceInstructions = (state, code, relevance) => {
  const instruction = conditionalRelevanceEquation(
    relevance.logic,
    relevance.rule,
    state
  );
  changeInstruction(state[code], instruction);
};

export const addMaskedValuesInstructions = (
  qualifiedCode,
  component,
  state
) => {
  if (
    !component.type ||
    ![
      "mcq",
      "image_mcq",
      "scq",
      "image_scq",
      "scq_array",
      "date",
      "date_time",
      "time",
    ].includes(component.type)
  ) {
    return;
  }
  switch (component.type) {
    case "date":
      if (component.dateFormat) {
        changeInstruction(component, {
          code: "masked_value",
          isActive: true,
          returnType: {
            name: "String",
          },
          text: `FrankieScripts.formatSqlDate(${qualifiedCode}.value, "${component.dateFormat}")`,
        });
      } else {
        changeInstruction(component, { code: "masked_value", remove: true });
      }
      break;
    case "time":
      changeInstruction(component, {
        code: "masked_value",
        isActive: true,
        returnType: {
          name: "String",
        },
        text: `FrankieScripts.formatTime(${qualifiedCode}.value, ${
          component.fullDayFormat || false
        })`,
      });
      break;
    case "date_time":
      if (component.dateFormat) {
        changeInstruction(component, {
          code: "masked_value",
          isActive: true,
          returnType: {
            name: "String",
          },
          text: `FrankieScripts.formatSqlDate(${qualifiedCode}.value, "${
            component.dateFormat
          }") + " " + FrankieScripts.formatTime(${qualifiedCode}.value, ${
            component.fullDayFormat || false
          })`,
        });
      } else {
        changeInstruction(component, { code: "masked_value", remove: true });
      }
      break;
    case "image_scq":
    case "scq":
      if (component.children && component.children.length) {
        let objText =
          "{" +
          component.children
            .map((el) =>
              el.type == "other"
                ? `${el.code}: ${el.qualifiedCode}Atext.value`
                : `${el.code}: ${el.qualifiedCode}.label`
            )
            .join(",") +
          "}";
        const instruction = {
          code: "masked_value",
          isActive: true,
          returnType: {
            name: "String",
          },
          text: `${qualifiedCode}.value ? ${objText}[${qualifiedCode}.value] : ''`,
        };
        changeInstruction(component, instruction);
      } else {
        changeInstruction(component, { code: "masked_value", remove: true });
      }
      break;
    case "image_mcq":
    case "mcq":
      if (component.children && component.children.length) {
        let text =
          "[" +
          component.children
            .map((answer) => {
              return (
                `{ value:${answer.qualifiedCode}.value,` +
                ` label:${
                  answer.type == "other"
                    ? answer.qualifiedCode + "Atext.value"
                    : answer.qualifiedCode + ".label"
                } }`
              );
            })
            .join(", ") +
          "]";
        const instruction = {
          code: "masked_value",
          isActive: true,
          returnType: {
            name: "String",
          },
          text: `FrankieScripts.listStrings(${text}.filter(function(elem){return elem.value}).map(function(elem){return elem.label}), Survey.lang)`,
        };
        changeInstruction(component, instruction);
      } else {
        changeInstruction(component, { code: "masked_value", remove: true });
      }
      break;
    case "scq_array":
      if (
        component.children &&
        component.children.length &&
        component.children.filter((el) => el.type == "column").length &&
        component.children.filter((el) => el.type === "row").length
      ) {
        let objText =
          "{" +
          component.children
            .filter((el) => el.type == "column")
            .map((el) => `${el.code}: ${el.qualifiedCode}.label`)
            .join(",") +
          "}";

        component.children
          .filter((el) => el.type === "row")
          .forEach((el) => {
            const instruction = {
              code: "masked_value",
              isActive: true,
              returnType: {
                name: "String",
              },
              text: `${el.qualifiedCode}.value ? ${objText}[${el.qualifiedCode}.value] : ''`,
            };
            changeInstruction(state[el.qualifiedCode], instruction);
          });
      } else if (
        component.children &&
        component.children.filter((el) => el.type === "row").length
      ) {
        component.children
          .filter((el) => el.type === "row")
          .forEach((el) => {
            changeInstruction(state[el.qualifiedCode], {
              code: "masked_value",
              remove: true,
            });
          });
      }
  }
  return component;
};

const creatNewState = (
  state,
  toBeCopied,
  newStateCode,
  oldQuestionCode,
  newQuestionCode
) => {
  const newState = cloneDeep(toBeCopied);
  if (newState.relevance) {
    delete newState.relevance;
    const index = newState.instructionList?.findIndex(
      (instruction) => instruction.code == "conditional_relevance"
    );
    if (index) {
      newState.instructionList?.splice(index, 1);
    }
  }
  if (newState.skip_logic) {
    delete newState.skip_logic;
    newState.instructionList = newState.instructionList.filter(
      (eq) => !eq.code.startsWith("skip_to_on_")
    );
  }
  newState.instructionList?.forEach((eq) => {
    eq.text = eq.text.replaceAll(oldQuestionCode, newQuestionCode);
  });
  state[newStateCode] = newState;
  state[newStateCode]?.children?.forEach((child) => {
    let oldChildCode = child.qualifiedCode;
    let newChildCode = child.qualifiedCode.replaceAll(
      oldQuestionCode,
      newQuestionCode
    );
    child.qualifiedCode = newChildCode;
    creatNewState(
      state,
      state[oldChildCode],
      newChildCode,
      oldQuestionCode,
      newQuestionCode
    );
  });
};
