import React, { useState } from "react";
import styles from "./CustomRandom.module.css";
import { Button } from "@mui/material";
import ShuffleIcon from "@mui/icons-material/Shuffle";

import RandomItemSetup from "../RandomItemSetup";
import RandomItemDisplay from "../RandomItemDisplay";
import { instructionByCode } from "~/utils/design/utils";
import RandomError from "../RandomError";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateRandom, updateRandomByType } from "~/state/design/designState";

export default function CustomRandom({ t, type, code, hideErrors }) {
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

  const randomInstruction = instructionByCode(state, "random_group");
  const randomOrders =
    randomInstruction?.groups?.filter((group) =>
      type ? group.codes.some((code) => childrenCodes.includes(code)) : true
    ) || [];
  const allCodesinRandomOrders = randomOrders.map((it) => it.codes).flat();
  const randomErrors =
    randomInstruction?.errors?.filter((error) =>
      error.items.some((item) => allCodesinRandomOrders.includes(item))
    ) || [];
  const updateRandomOrders = (groups) => {
    dispatch(
      type
        ? updateRandomByType({ code, groups, type })
        : updateRandom({ code, groups })
    );
  };

  const getChildLabelByCode = (code) => {
    const label = childrenLabels.find((el) => el.code == code)?.label;
    return label?.replace(/<[^>]*>/g, "");
  };

  const getUnrandomisedChildrenCodes = (data) => {
    return childrenCodes.filter((el) => !allCodesinRandomOrders.includes(el));
  };

  const onDeleteClicked = (index) => {
    if (window.confirm(t("are_you_sure"))) {
      updateRandomOrders(randomOrders.filter((el, i) => i !== index));
    }
  };

  const sortRandomItem = (item) => {
    return [...item.codes].sort(function (a, b) {
      return (
        childrenCodes.findIndex((x) => x === a) -
        childrenCodes.findIndex((x) => x === b)
      );
    });
  };

  const onEditClicked = (index) => {
    let checked = [];
    let data = [];

    let unrandomized = getUnrandomisedChildrenCodes();
    data = childrenCodes.filter(
      (el) =>
        unrandomized.includes(el) || randomOrders[index].codes.includes(el)
    );
    checked = data.map((el) =>
      randomOrders[index].codes.includes(el) ? true : false
    );

    setAction({
      index: index,
      checked: checked,
      randomOption: randomOrders[index].randomOption || "RANDOM",
      title: t("edit_random_rule"),
      data: data,
    });
  };

  const resetData = () => {
    setAction({});
  };

  const isActionEmpty = !action || Object.keys(action).length == 0;

  const onSubmit = (value, randomOption, index) => {
    const newRandomOrders = randomOrders ? [...randomOrders] : [];
    newRandomOrders[index] = { codes: value, randomOption };
    updateRandomOrders(newRandomOrders);

    resetData();
  };

  const addNewRule = () => {
    const data = getUnrandomisedChildrenCodes(randomOrders);
    setAction({
      title: t("add_new_random_rule"),
      data: data,
      checked: [],
      randomOption: "RANDOM",
      index: randomOrders ? randomOrders.length : 0,
    });
  };

  const sanitize = (data, childrenCodes) => {
    let groups = [...data].filter((code) => childrenCodes.includes(code));
    if (groups.length <= 1) {
      resetData();
    }
    return groups;
  };

  return (
    <>
      {randomOrders &&
        randomOrders.map((item, i) => {
          return (
            <RandomItemDisplay
              t={t}
              data={sortRandomItem(item)}
              randomOption={item.randomOption}
              index={i}
              key={i}
              isBeingEdited={action.index == i}
              childrenCodes={childrenCodes}
              getChildLabelByCode={getChildLabelByCode}
              onDeleteClicked={(index) => {
                setAction({});
                onDeleteClicked(index);
              }}
              onEditClicked={(index) => onEditClicked(index)}
            />
          );
        })}
      {!hideErrors && randomErrors.length > 0 ? (
        <RandomError errors={randomErrors} />
      ) : (
        ""
      )}

      {isActionEmpty && (
        <Button
          className={styles.addNew}
          variant="contained"
          disabled={getUnrandomisedChildrenCodes().length < 2}
          onClick={addNewRule}
        >
          <ShuffleIcon sx={{ paddingRight: "8px" }} /> {t("add_random_rule")}
        </Button>
      )}
      {action && action.data && (
        <RandomItemSetup
          t={t}
          title={action.title}
          data={sanitize(action.data, childrenCodes)}
          randomOption={action.randomOption}
          getChildLabelByCode={getChildLabelByCode}
          checked={action.checked}
          onSubmit={(data, randomOption) =>
            onSubmit(data, randomOption, action.index)
          }
          onCancel={resetData}
        />
      )}
    </>
  );
}
