import { accessibleDependencies } from "~/utils/design/access/dependencies";
import { isQuestion, stripTags } from "~/utils/design/utils";

export const buildReferences = (componentIndices, code, state, mainLang) => {
  let dependencies = accessibleDependencies(componentIndices, code);
  let returnResult = [];
  dependencies.forEach((el) => {
    if (isQuestion(el)) {
      const reference = buildReference(el, state[el], state, mainLang);
      if (reference.length) {
        returnResult = returnResult.concat(reference);
      }
    }
  });
  return returnResult;
};

const buildReference = (code, component, state, mainLang) => {
  const label = code + ". " + stripTags(component.content?.label?.[mainLang]);
  let instruction = "";
  let type = component.type;
  switch (component.type) {
    case "scq_array":
      return component.children
        .filter((el) => el.type == "row")
        .map((element) => {
          return {
            value:
              label +
              " - " +
              code +
              ". " +
              stripTags(
                state[element.qualifiedCode].content?.label?.[mainLang]
              ),
            id: code + element.code,
            type: "SCQ Array Row",
            instruction: code + element.code + ".masked_value",
          };
        });
    case "text":
      type = "Short Text";
      instruction = `${code}.value`;
      break;
    case "nps":
      type = "NPS";
      instruction = `${code}.value`;
      break;
    case "email":
      type = "Email";
      instruction = `${code}.value`;
      break;
    case "paragraph":
      instruction = `${code}.value`;
      type = "Long Text";
      break;
    case "number":
      type = "Number";
      instruction = `${code}.value`;
      break;
    case "date":
      type = "Date";
      instruction = `${code}.masked_value`;
      break;
    case "time":
      type = "time";
      instruction = `${code}.masked_value`;
      break;
    case "date_time":
      type = "Date Time";
      instruction = `${code}.masked_value`;
      break;
    case "scq":
      type = "SCQ";
      instruction = `${code}.masked_value`;
      break;
    case "image_scq":
      type = "Image SCQ";
      instruction = `${code}.masked_value`;
      break;
    case "mcq":
      type = "MCQ";
      instruction = `${code}.masked_value`;
      break;
    case "image_mcq":
      type = "Image MCQ";
      instruction = `${code}.masked_value`;
      break;
    default:
      return [];
  }
  return [{ id: code, instruction: instruction, value: label, type: type }];
};
