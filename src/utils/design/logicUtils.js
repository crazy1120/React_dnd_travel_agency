export const jsonToJs = (json, nested, getComponentType) => {
  const key = Object.keys(json)[0];
  const value = json[key];
  switch (key) {
    case "and":
      return wrapIfNested(
        nested,
        value.map((el) => jsonToJs(el, true, getComponentType)).join(" && ")
      );
    case "or":
      return wrapIfNested(
        nested,
        value.map((el) => jsonToJs(el, true, getComponentType)).join(" || ")
      );
    case "!":
      return (
        "!" +
        wrapIfNested(
          nested,
          jsonToJs(value, true, getComponentType) + (nested ? ")" : "")
        )
      );
    case "relevance":
      return `${capture(value)}.relevance`;
    case "not_relevance":
      return `!${capture(value)}.relevance`;
    case "is_online":
      return `Survey.mode=="online"`;
    case "is_offline":
      return `Survey.mode=="offline"`;
    case "validity":
      return `${capture(value)}.validity`;
    case "not_validity":
      return `!${capture(value)}.validity`;
    case "is_void":
      return `FrankieScripts.isVoid(${capture(value)}.value)`;
    case "is_not_void":
      return `FrankieScripts.isNotVoid(${capture(value)}.value)`;
    case "is_file_void":
      let qCode = capture(value);
      return wrapIfNested(
        nested,
        `FrankieScripts.isVoid(${qCode}.value) || !${qCode}.value.size || !${qCode}.value.stored_filename`
      );
    case "is_file_not_void":
      let qCode1 = capture(value);
      return wrapIfNested(
        nested,
        `FrankieScripts.isNotVoid(${qCode1}.value) && ${qCode1}.value.size && ${qCode1}.value.stored_filename`
      );
    case "==":
    case "!=":
    case "<":
    case "<=":
    case ">":
    case ">=":
    case "between":
    case "not_between":
      let type = getComponentType(capture(value[0]));
      let leftOperand =
        type == "date" || type == "date_time" || type == "time"
          ? `FrankieScripts.sqlDateTimeToDate(${capture(value[0])}.value)`
          : `${capture(value[0])}.value`;
      if (["==", "!=", "<", "<=", ">", ">="].includes(key)) {
        return `${leftOperand}${key}${capture(value[1], type)}`;
      } else if (key == "between") {
        return wrapIfNested(
          nested,
          `(${leftOperand}>=${capture(
            value[1],
            type
          )} && ${leftOperand}<=${capture(value[2], type)})`
        );
      } else if (key == "not_between") {
        return wrapIfNested(
          nested,
          `(${leftOperand}<${capture(
            value[1],
            type
          )} || ${leftOperand}>${capture(value[2], type)})`
        );
      } else {
        throw "WTF";
      }
    case "startsWith":
      return wrapIfNested(
        nested,
        `(${capture(value[0])}.value && ${capture(
          value[0]
        )}.value.startsWith(${capture(value[1])})`
      );
    case "endsWith":
      return wrapIfNested(
        nested,
        `(${capture(value[0])}.value && ${capture(
          value[0]
        )}.value.endsWith(${capture(value[1])})`
      );
    case "contains":
      return wrapIfNested(
        nested,
        `(${capture(value[0])}.value && ${capture(
          value[0]
        )}.value.contains(${capture(value[1])})`
      );
    case "not_contains":
      return wrapIfNested(
        nested,
        `(${capture(value[0])}.value && !${capture(
          value[0]
        )}.value.contains(${capture(value[1])})`
      );
    case "in":
      const code = capture(value[0]);
      if (code == "survey_lang") {
        return `[${value[1].map(
          (el) => '"' + el + '"'
        )}].indexOf(Survey.lang) !== -1`;
      }
      return `[${value[1].map(
        (el) => '"' + el + '"'
      )}].indexOf(${code}.value) !== -1`;
    case "not_in":
      if (code == "survey_lang") {
        return `[${value[1].map(
          (el) => '"' + el + '"'
        )}].indexOf(Survey.lang) == -1`;
      }
      return `[${value[1].map(
        (el) => '"' + el + '"'
      )}].indexOf(${code}.value) == -1`;
    case "any_in":
      const questionCode = capture(value[0]);
      return `[${value[1].map(
        (el) => questionCode + el + ".value"
      )}].filter(Boolean).length > 0`;
    case "none_in":
      const questionCode1 = capture(value[0]);
      return `[${value[1].map(
        (el) => questionCode1 + el + ".value"
      )}].filter(Boolean).length == 0`;
    default:
      return "";
  }
};

const wrapIfNested = (nested, text) => {
  return (nested ? "(" : "") + text + (nested ? ")" : "");
};

export const capture = (value, type) => {
  if (type == "time") {
    return `FrankieScripts.sqlDateTimeToDate(\"1970-01-01 ${integerToTime(
      value
    )}\")`;
  } else if (
    typeof value === "object" &&
    Object.prototype.toString.call(value) === "[object Date]"
  ) {
    return type == "date_time"
      ? `FrankieScripts.sqlDateTimeToDate(\"${toSqlDateTime(value)}\")`
      : `FrankieScripts.sqlDateTimeToDate(\"${toSqlDateTimeIgnoreTime(
          value
        )}\")`;
  }
  if (typeof value === "object") {
    return value[Object.keys(value)[0]];
  } else if (typeof value === "string") {
    return '"' + value + '"';
  } else {
    return value;
  }
};

const integerToTime = (time) => {
  let hours = Math.floor(time / 3600);
  let hoursString = hours >= 10 && hours <= 23 ? "" + hours : "0" + hours;
  let minutes = (time % 3600) / 60;
  let minutesString =
    minutes >= 10 && minutes <= 59 ? "" + minutes : "0" + minutes;
  return hoursString + ":" + minutesString + ":00";
};

const toSqlDateTime = (date) => {
  return (
    date.getFullYear() +
    "-" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getDate()).slice(-2) +
    " " +
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2)
  );
};

const toSqlDateTimeIgnoreTime = (date) => {
  return (
    date.getFullYear() +
    "-" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getDate()).slice(-2) +
    " 00:00:00"
  );
};
