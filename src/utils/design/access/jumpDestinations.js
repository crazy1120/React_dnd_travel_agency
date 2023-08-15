import { isGroup, isQuestion, stripTags } from "~/utils/design/utils";

const buildField = (code, state, mainLang) => {
  const component = state[code];
  const label = code + ". " + stripTags(component.content?.label?.[mainLang]);
  return { code: code, label: label };
};

export const jumpDestinations = (componentIndices, code, state, mainLang) => {
  let dependencies = [];
  if (!componentIndices) {
    return dependencies;
  }
  let componentIndex = componentIndices.find(
    (element) => element.code === code
  );
  if (!componentIndex) {
    return dependencies;
  }
  dependencies = dependencies.concat(
    accessibleSiblings(componentIndices, componentIndex, state, mainLang)
  );
  if (componentIndex.parent) {
    parents(componentIndices, componentIndex)
      .filter((elem) => isQuestion(elem.code) || isGroup(elem.code))
      .forEach((element) => {
        dependencies = dependencies.concat(
          accessibleSiblings(componentIndices, element, state, mainLang)
        );
      });
  }
  return dependencies;
};

const parents = (componentIndices, componentIndex) => {
  let result = [];
  let parent = componentIndices.find(
    (element) => element.code === componentIndex.parent
  );
  if (parent && parent.parent) {
    result.push(parent);
    result = result.concat(parents(componentIndices, parent));
  }
  return result;
};
const accessibleSiblings = (
  componentIndices,
  componentIndex,
  state,
  mainLang
) => {
  let result = [];
  if (!isGroup(componentIndex.code) && !isQuestion(componentIndex.code)) {
    return result;
  }
  let accessibleSiblings = componentIndices.filter((elem) => {
    return (
      elem.parent == componentIndex.parent &&
      elem.minIndex > componentIndex.maxIndex &&
      (!componentIndex.prioritisedSiblings ||
        componentIndex.prioritisedSiblings.indexOf(elem.code) === -1)
    );
  });
  accessibleSiblings.forEach((sibling) => {
    result = result.concat(buildField(sibling.code, state, mainLang));
    result = result.concat(
      childrenDependencies(componentIndices, sibling, state, mainLang)
    );
  });
  return result;
};
const childrenDependencies = (
  componentIndices,
  componentIndex,
  state,
  mainLang
) => {
  let result = [];
  if (!isGroup(componentIndex.code)) {
    return result;
  }
  if (componentIndex.children) {
    componentIndex.children.forEach((childCode) => {
      let child = componentIndices.find(
        (element) => element.code === childCode
      );
      result = result.concat(buildField(child.code, state, mainLang));
      result = result.concat(
        childrenDependencies(componentIndices, child, state, mainLang)
      );
    });
  }
  return result;
};
