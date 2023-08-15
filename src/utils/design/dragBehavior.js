import { isGroup } from "~/utils/design/utils";

export const onDragEnd = (result, onDragListener) => {
  if (!result.destination) {
    return;
  } else if (
    result.type == "questions" &&
    isGroup(result.source.droppableId) &&
    isGroup(result.destination.droppableId)
  ) {
    const payload = {
      type: "reorder_questions",
      source: result.source.droppableId,
      destination: result.destination.droppableId,
      id: result.draggableId,
      fromIndex: result.source.index,
      toIndex: result.destination.index,
    };
    onDragListener(payload);
    return;
  } else if (
    result.type == "questions" &&
    result.source.droppableId == "new-questions" &&
    isGroup(result.destination.droppableId)
  ) {
    const payload = {
      type: "new_question",
      questionType: result.draggableId,
      destination: result.destination.droppableId,
      toIndex: result.destination.index,
    };
    onDragListener(payload);
    return;
  } else if (result.type == "groups" && isGroup(result.draggableId)) {
    const payload = {
      type: "reorder_groups",
      id: result.draggableId,
      fromIndex: result.source.index,
      toIndex: result.destination.index,
    };
    onDragListener(payload);
    return;
  } else if (
    result.type == "groups" &&
    result.source.droppableId == "new-groups"
  ) {
    const payload = {
      type: "new_group",
      groupType: result.draggableId,
      toIndex: result.destination.index,
    };
    onDragListener(payload);
    return;
  } else if (result.type.startsWith("option")) {
    const payload = {
      type: "reorder_answers",
      id: result.draggableId,
      fromIndex: result.source.index,
      toIndex: result.destination.index,
    };
    onDragListener(payload);
    return;
  } else if (result.type.startsWith("row") || result.type.startsWith("col")) {
    const payload = {
      type: "reorder_answers_by_type",
      id: result.draggableId,
      fromIndex: result.source.index,
      toIndex: result.destination.index,
    };
    onDragListener(payload);
    return;
  }
};
