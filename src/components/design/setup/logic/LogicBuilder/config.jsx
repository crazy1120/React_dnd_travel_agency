import merge from "lodash.merge";
import { MuiConfig } from "@react-awesome-query-builder/mui";
const InitialConfig = MuiConfig;

const wrapField = (field) => {
  return '<span class="logicField">' + field + "</span>";
};

const wrapOperator = (op) => {
  return '<span class="logicOp">' + op + "</span>";
};

const wrapValue = (value, valueTypes) => {
  return (
    '<span class="logicValue">' +
    (valueTypes == "text" ? '"' + value + '"' : value) +
    "</span>"
  );
};

const conjunctions = {
  AND: InitialConfig.conjunctions.AND,
  OR: InitialConfig.conjunctions.OR,
};

const operators = {
  ...InitialConfig.operators,
  less: {
    ...InitialConfig.operators.less,
    formatOp: (
      field,
      op,
      value,
      valueSrcs,
      valueTypes,
      opDef,
      operatorOptions,
      isForDisplay,
      fieldDef
    ) => {
      return `${wrapField(field)} ${wrapOperator("<")} ${wrapValue(
        value,
        valueTypes
      )}`;
    },
  },
  less_or_equal: {
    ...InitialConfig.operators.less_or_equal,
    formatOp: (
      field,
      op,
      value,
      valueSrcs,
      valueTypes,
      opDef,
      operatorOptions,
      isForDisplay,
      fieldDef
    ) => {
      return `${wrapField(field)} ${wrapOperator("<=")} ${wrapValue(
        value,
        valueTypes
      )}`;
    },
  },
  greater: {
    ...InitialConfig.operators.greater,
    formatOp: (
      field,
      op,
      value,
      valueSrcs,
      valueTypes,
      opDef,
      operatorOptions,
      isForDisplay,
      fieldDef
    ) => {
      return `${wrapField(field)} ${wrapOperator(">")} ${wrapValue(
        value,
        valueTypes
      )}`;
    },
  },
  greater_or_equal: {
    ...InitialConfig.operators.greater_or_equal,
    formatOp: (
      field,
      op,
      value,
      valueSrcs,
      valueTypes,
      opDef,
      operatorOptions,
      isForDisplay,
      fieldDef
    ) => {
      return `${wrapField(field)} ${wrapOperator(">=")} ${wrapValue(
        value,
        valueTypes
      )}`;
    },
  },

  equal: {
    ...InitialConfig.operators.equal,
    label: "Equals",
    jsonLogic: "==",
    formatOp: (
      field,
      op,
      value,
      valueSrcs,
      valueTypes,
      opDef,
      operatorOptions,
      isForDisplay,
      fieldDef
    ) => {
      const opStr = isForDisplay ? "equals" : opDef.label;
      return `${wrapField(field)} ${wrapOperator(opStr)} ${wrapValue(
        value,
        valueTypes
      )}`;
    },
  },
  not_equal: {
    ...InitialConfig.operators.not_equal,
    label: "Not Equals",
    jsonLogic: "!=",
    formatOp: (
      field,
      op,
      value,
      valueSrcs,
      valueTypes,
      opDef,
      operatorOptions,
      isForDisplay,
      fieldDef
    ) => {
      const opStr = isForDisplay ? "not equals" : opDef.label;
      return `${wrapField(field)} ${wrapOperator(opStr)} ${wrapValue(
        value,
        valueTypes
      )}`;
    },
  },
  starts_with: {
    ...InitialConfig.operators.starts_with,
    jsonLogic: "startsWith",
    formatOp: (
      field,
      op,
      value,
      valueSrcs,
      valueTypes,
      opDef,
      operatorOptions,
      isForDisplay,
      fieldDef
    ) => {
      const opStr = isForDisplay ? "starts with" : opDef.label;
      return `${wrapField(field)} ${wrapOperator(opStr)} ${wrapValue(
        value,
        valueTypes
      )}`;
    },
  },
  ends_with: {
    ...InitialConfig.operators.ends_with,
    jsonLogic: "endsWith",
    formatOp: (
      field,
      op,
      value,
      valueSrcs,
      valueTypes,
      opDef,
      operatorOptions,
      isForDisplay,
      fieldDef
    ) => {
      const opStr = isForDisplay ? "ends with" : opDef.label;
      return `${wrapField(field)} ${wrapOperator(opStr)} ${wrapValue(
        value,
        valueTypes
      )}`;
    },
  },
  between: {
    ...InitialConfig.operators.between,
    label: "Between",
    jsonLogic: "between",
    formatOp: (
      field,
      op,
      values,
      valueSrcs,
      valueTypes,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      let valFrom = values.first();
      let valTo = values.get(1);
      if (isForDisplay)
        return `${wrapField(field)} ${wrapOperator("between")} ${wrapValue(
          valFrom,
          valueTypes
        )} ${wrapOperator("and")} ${wrapValue(valTo, valueTypes)}`;
      else return `${field} >= ${valFrom} && ${field} <= ${valTo}`;
    },
  },
  not_between: {
    ...InitialConfig.operators.not_between,
    label: "Not Between",
    jsonLogic: "not_between",
    formatOp: (
      field,
      op,
      values,
      valueSrcs,
      valueTypes,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      let valFrom = values.first();
      let valTo = values.get(1);
      if (isForDisplay)
        return `${wrapField(field)} ${wrapOperator("not between")} ${wrapValue(
          valFrom,
          valueTypes
        )} ${wrapOperator("and")} ${wrapValue(valTo, valueTypes)}`;
      else return `${field} >= ${valFrom} && ${field} <= ${valTo}`;
    },
  },
  like: {
    ...InitialConfig.operators.like,
    label: "Contains",
    jsonLogic: "contains",
    _jsonLogicIsRevArgs: false,
    formatOp: (
      field,
      op,
      value,
      valueSrcs,
      valueTypes,
      opDef,
      operatorOptions,
      isForDisplay,
      fieldDef
    ) => {
      const opStr = isForDisplay ? "contains" : opDef.label;
      return `${wrapField(field)} ${wrapOperator(opStr)} ${wrapValue(
        value,
        valueTypes
      )}`;
    },
  },
  not_like: {
    ...InitialConfig.operators.not_like,
    label: "Not Contains",
    jsonLogic: "not_contains",
    formatOp: (
      field,
      op,
      value,
      valueSrcs,
      valueTypes,
      opDef,
      operatorOptions,
      isForDisplay,
      fieldDef
    ) => {
      const opStr = isForDisplay ? "does not containends with" : opDef.label;
      return `${wrapField(field)} ${wrapOperator(opStr)} ${wrapValue(
        value,
        valueTypes
      )}`;
    },
  },
  select_any_in: {
    ...InitialConfig.operators.select_any_in,
    label: "Any In",
    jsonLogic: "in",
    formatOp: (
      field,
      op,
      values,
      valueSrc,
      valueType,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      let formattedValues = values.join(", ");
      return `${wrapField(field)} ${wrapOperator("in")} (${wrapValue(
        formattedValues,
        ""
      )})`;
    },
  },
  select_not_any_in: {
    ...InitialConfig.operators.select_not_any_in,
    label: "None In",
    jsonLogic: "not_in",
    formatOp: (
      field,
      op,
      values,
      valueSrc,
      valueType,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      let formattedValues = values.join(", ");
      return `${wrapField(field)} ${wrapOperator("not in")} (${wrapValue(
        formattedValues,
        ""
      )})`;
    },
  },
  multiselect_equals: {
    ...InitialConfig.operators.multiselect_equals,
    label: "Any In",
    jsonLogic: "any_in",
    formatOp: (
      field,
      op,
      values,
      valueSrc,
      valueType,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      let formattedValues = values.join(", ");
      return `${wrapOperator("Any of")} (${wrapValue(
        formattedValues,
        ""
      )}) in ${wrapField(field)} ${wrapOperator("is selected")}`;
    },
  },
  multiselect_not_equals: {
    ...InitialConfig.operators.multiselect_not_equals,
    label: "None In",
    jsonLogic: "none_in",
    formatOp: (
      field,
      op,
      values,
      valueSrc,
      valueType,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      let formattedValues = values.join(", ");
      return `${wrapOperator("None of")} (${wrapValue(
        formattedValues,
        ""
      )}) in ${wrapField(field)} ${wrapOperator("is selected")}`;
    },
  },
  is_relevant: {
    label: "Is Displayed",
    jsonLogic: "relevance",
    cardinality: 0,
    formatOp: (
      field,
      op,
      values,
      valueSrc,
      valueType,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      return `${wrapField(field)} ${wrapValue("is shown")}`;
    },
  },
  is_not_relevant: {
    label: "Is Hidden",
    jsonLogic: "not_relevance",
    cardinality: 0,
    formatOp: (
      field,
      op,
      values,
      valueSrc,
      valueType,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      return `${wrapField(field)} ${wrapValue("is not shown")}`;
    },
  },
  is_valid: {
    label: "Is Valid",
    jsonLogic: "validity",
    cardinality: 0,
    formatOp: (
      field,
      op,
      values,
      valueSrc,
      valueType,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      return `${wrapField(field)} ${wrapValue("is valid")}`;
    },
  },
  is_not_valid: {
    label: "Is Not Valid",
    jsonLogic: "not_validity",
    cardinality: 0,
    formatOp: (
      field,
      op,
      values,
      valueSrc,
      valueType,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      return `${wrapField(field)} ${wrapValue("is not valid")}`;
    },
  },
  is_void: {
    cardinality: 0,
    label: "Is Empty",
    jsonLogic: "is_void",
    formatOp: (
      field,
      op,
      values,
      valueSrc,
      valueType,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      return `${wrapField(field)} ${wrapValue("is empty")}`;
    },
  },
  is_online: {
    cardinality: 0,
    label: "Is Online",
    jsonLogic: "is_online",
    formatOp: (
      field,
      op,
      values,
      valueSrc,
      valueType,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      return `${wrapField(field)} ${wrapValue("is online")}`;
    },
  },
  is_offline: {
    cardinality: 0,
    label: "Is Offline",
    jsonLogic: "is_offline",
    formatOp: (
      field,
      op,
      values,
      valueSrc,
      valueType,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      return `${wrapField(field)} ${wrapValue("is Offline")}`;
    },
  },
  is_not_void: {
    cardinality: 0,
    label: "Is not Empty",
    jsonLogic: "is_not_void",
    formatOp: (
      field,
      op,
      values,
      valueSrc,
      valueType,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      return `${wrapField(field)} ${wrapValue("is not empty")}`;
    },
  },
  is_file_void: {
    cardinality: 0,
    label: "Is Empty",
    jsonLogic: "is_file_void",
    formatOp: (
      field,
      op,
      values,
      valueSrc,
      valueType,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      return `${wrapField(field)} ${wrapValue("is empty")}`;
    },
  },
  is_file_not_void: {
    cardinality: 0,
    label: "Is not Empty",
    jsonLogic: "is_file_not_void",
    formatOp: (
      field,
      op,
      values,
      valueSrc,
      valueType,
      opDef,
      operatorOptions,
      isForDisplay
    ) => {
      return `${wrapField(field)} ${wrapValue("is not empty")}`;
    },
  },
};

const widgets = {
  ...InitialConfig.widgets,
  // examples of  overriding
  text: {
    ...InitialConfig.widgets.text,
  },
  slider: {
    ...InitialConfig.widgets.slider,
    customProps: {
      width: "300px",
    },
  },
  rangeslider: {
    ...InitialConfig.widgets.rangeslider,
    customProps: {
      width: "300px",
    },
  },
  date: {
    ...InitialConfig.widgets.date,
    dateFormat: "DD.MM.YYYY",
    valueFormat: "YYYY-MM-DD",
  },
  time: {
    ...InitialConfig.widgets.time,
    timeFormat: "HH:mm",
    valueFormat: "HH:mm:ss",
  },
  datetime: {
    ...InitialConfig.widgets.datetime,
    timeFormat: "HH:mm",
    dateFormat: "DD.MM.YYYY",
    valueFormat: "YYYY-MM-DD HH:mm:ss",
  },
  func: {
    ...InitialConfig.widgets.func,
    customProps: {
      showSearch: true,
    },
  },
  treeselect: {
    ...InitialConfig.widgets.treeselect,
    customProps: {
      showSearch: true,
    },
  },
};

const types = {
  ...InitialConfig.types,
  boolean: merge(InitialConfig.types.boolean, {
    widgets: {
      boolean: {
        widgetProps: {
          hideOperator: true,
          operatorInlineLabel: "is",
        },
      },
    },
  }),
};

const localeSettings = {
  valueLabel: "Value",
  valuePlaceholder: "Value",
  fieldLabel: "Field",
  operatorLabel: "Operator",
  fieldPlaceholder: "Select field",
  operatorPlaceholder: "Select operator",
  deleteLabel: null,
  addGroupLabel: "Add group",
  addRuleLabel: "Add rule",
  addSubRuleLabel: "Add sub rule",
  delGroupLabel: null,
  notLabel: "Not",
  valueSourcesPopupTitle: "Select value source",
  removeRuleConfirmOptions: {
    title: "Are you sure delete this rule?",
    okText: "Yes",
    okType: "danger",
  },
  removeGroupConfirmOptions: {
    title: "Are you sure delete this group?",
    okText: "Yes",
    okType: "danger",
  },
};

const settings = {
  ...InitialConfig.settings,
  ...localeSettings,

  valueSourcesInfo: {
    value: {
      label: "Value",
    },
    field: {
      label: "Field",
      widget: "field",
    },
    func: {
      label: "Function",
      widget: "func",
    },
  },
  canReorder: false,
  showNot: false,
  maxNesting: 1,
  canLeaveEmptyGroup: false, //after deletion
};

const funcs = {};

const config = {
  conjunctions,
  operators,
  widgets,
  types,
  settings,
  funcs,
};

export default config;
