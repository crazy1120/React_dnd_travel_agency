import { isGroup, isQuestion } from "~/utils/design/utils";

export const accessibleDependencies = (componentIndices, code) => {
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
  if (componentIndex.parent) {
    let componentParents = parents(componentIndices, componentIndex);
    componentParents.forEach((element) => {
      dependencies = dependencies.concat(
        accessibleSiblings(componentIndices, element)
      );
    });
  }
  if (isGroup(componentIndex.code) || isQuestion(componentIndex.code)) {
    dependencies = dependencies.concat(
      accessibleSiblings(componentIndices, componentIndex)
    );
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
const accessibleSiblings = (componentIndices, componentIndex) => {
  let result = [];
  if (!isGroup(componentIndex.code) && !isQuestion(componentIndex.code)) {
    return result;
  }
  let accessibleSiblings = componentIndices.filter((elem) => {
    return (
      elem.parent === componentIndex.parent &&
      elem.maxIndex < componentIndex.minIndex &&
      (!componentIndex.prioritisedSiblings ||
        componentIndex.prioritisedSiblings.indexOf(elem.code) === -1)
    );
  });
  accessibleSiblings.forEach((sibling) => {
    result = result.concat(sibling.code);
    result = result.concat(childrenDependencies(componentIndices, sibling));
  });
  return result;
};
const childrenDependencies = (componentIndices, componentIndex) => {
  let result = [];
  if (!isGroup(componentIndex.code)) {
    return result;
  }

  if (componentIndex.children) {
    componentIndex.children.forEach((childCode) => {
      let child = componentIndices.find(
        (element) => element.code === childCode
      );
      result = result.concat(child.code);
      result = result.concat(childrenDependencies(componentIndices, child));
    });
  }
  return result;
};
