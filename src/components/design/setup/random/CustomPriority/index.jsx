import React, { useState } from "react";
import styles from "./CustomPriority.module.css";
import { Button } from "@mui/material";
import LowPriorityIcon from "@mui/icons-material/LowPriority";

import { instructionByCode } from "~/utils/design/utils";
import RandomError from "../RandomError";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updatePriority, updatePriorityByType } from "~/state/design/designState";
import PriorityItemDisplay from "../PriorityItemDisplay";
import PriorityItemSetup from "../PriorityItemSetup";

export default function CustomPriority({ t, type, code, hideErrors }) {
  const dispatch = useDispatch();
  const [action, setAction] = useState({});

  const state = useSelector((state) => {
    return state.designState[code];
  });

  const childrenCodes = useSelector((state) => {
    return (
      state.designState[code]?.children
        ?.filter((el) => (type ? el.type == type : true))
        ?.filter(
          (el) =>
            el.groupType?.toLowerCase() != "welcome" &&
            el.groupType?.toLowerCase() != "end"
        )
        ?.map((el) => el.code) || []
    );
  });

  const lang = useSelector((state) => {
    return state.designState.langInfo.lang;
  });

  const childrenLabels = useSelector((state) => {
    return (
      state.designState[code]?.children
        ?.filter((el) => (type ? el.type == type : true))
        ?.map((child) => {
          return {
            code: child.code,
            label:
              state.designState[child.qualifiedCode].content?.label?.[lang],
          };
        }) || []
    );
  });

  const priorityInstruction = instructionByCode(state, "priority_groups");
  const priorities =
    priorityInstruction?.priorities?.filter((priority) =>
      type
        ? priority.weights.some((el) => childrenCodes.includes(el.code))
        : true
    ) || [];
  let allCodesinPriority = priorities
    .map((priority) => priority.weights)
    .flat()
    .map((weight) => weight.code)
    .flat();
  const priorityErrors =
    priorityInstruction?.errors?.filter((error) =>
      error.items.some((item) => allCodesinPriority.includes(item))
    ) || [];

  const updatePriorities = (priorities) => {
    dispatch(
      type
        ? updatePriorityByType({ code, priorities, type })
        : updatePriority({ code, priorities })
    );
  };

  const getChildLabelByCode = (code) => {
    const label = childrenLabels.find((el) => el.code == code)?.label;
    return label?.replace(/<[^>]*>/g, "");
  };

  const getUnPrioritisedChildrenCodes = () => {
    return childrenCodes.filter((el) => !allCodesinPriority.includes(el));
  };

  const onDeleteClicked = (index) => {
    if (window.confirm(t("are_you_sure"))) {
      updatePriorities(priorities.filter((el, i) => i !== index));
    }
  };

  const isActionEmpty = !action || Object.keys(action).length == 0;

  const onEditClicked = (index) => {
    let checked = [];
    let data = [];

    data.weights = [];
    const unPrioritised = getUnPrioritisedChildrenCodes(priorities);
    childrenCodes.forEach((code) => {
      if (unPrioritised.includes(code)) {
        data.weights.push({ code: code, weight: 1 });
        checked.push(false);
      } else {
        let weightIndex = priorities[index].weights.findIndex(
          (weight) => weight.code == code
        );
        if (weightIndex > -1) {
          data.weights.push(priorities[index].weights[weightIndex]);
          checked.push(true);
        }
      }
      data.limit = priorities[index].limit;
    });

    setAction({
      index: index,
      checked: checked,
      title: t("edit_priority_rule"),
      data: data,
    });
  };

  const resetData = () => {
    setAction({});
  };

  const onSubmit = (value, index) => {
    const newPriorities = priorities ? [...priorities] : [];
    newPriorities[index] = { ...value };
    updatePriorities(newPriorities);
    resetData();
  };

  const addNewPriority = () => {
    const listQuestionCode = getUnPrioritisedChildrenCodes(priorities);
    const weights = listQuestionCode.map((el) => ({
      code: el,
      weight: 1,
    }));
    setAction({
      title: t("add_priority_rule"),
      checked: listQuestionCode.map((el) => false),
      data: {
        limit: 1,
        weights: weights,
      },
      index: priorities ? priorities.length : 0,
      icon: <LowPriorityIcon />,
    });
  };

  const sortPriorityItem = (item) => {
    let newWeights = [...item.weights].sort(function (a, b) {
      return (
        childrenCodes.findIndex((x) => x === a.code) -
        childrenCodes.findIndex((x) => x === b.code)
      );
    });
    return { ...item, weights: newWeights };
  };

  const sanitize = (data, childrenCodes) => {
    let weights = [...data.weights].filter((el) =>
      childrenCodes.includes(el.code)
    );
    if (weights.length <= 1) {
      resetData();
    }
    return {
      limit: Math.min(data.limit, weights.length - 1),
      weights: weights,
    };
  };

  return (
    <>
      {priorities &&
        priorities.map((item, i) => {
          return (
            <PriorityItemDisplay
              t={t}
              data={sortPriorityItem(item)}
              index={i}
              key={i}
              childrenCodes={childrenCodes}
              isBeingEdited={action.index == i}
              onDeleteClicked={(index) => {
                setAction({});
                onDeleteClicked(index);
              }}
              onEditClicked={(index) => onEditClicked(index)}
              getChildLabelByCode={getChildLabelByCode}
            />
          );
        })}
      {!hideErrors && priorityErrors.length > 0 ? (
        <RandomError errors={priorityErrors} />
      ) : (
        ""
      )}

      {isActionEmpty && (
        <Button
          variant="contained"
          disabled={getUnPrioritisedChildrenCodes().length < 2}
          onClick={addNewPriority}
        >
          <LowPriorityIcon sx={{ paddingRight: "8px" }} />{" "}
          {t("add_priority_rule")}
        </Button>
      )}

      {action && action.data && (
        <PriorityItemSetup
          t={t}
          title={action.title}
          data={sanitize(action.data, childrenCodes)}
          index={action.index}
          getChildLabelByCode={getChildLabelByCode}
          checked={action.checked}
          onSubmit={(data) => onSubmit(data, action.index)}
          onCancel={resetData}
        />
      )}
    </>
  );
}
