import React, { useState } from "react";
import styles from "./PriorityItemSetup.module.css";
import { Button, Card, Checkbox, IconButton } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function PriorityItemSetup(props) {
  const t = props.t;

  const [checked, setChecked] = useState(props.checked);
  const [data, setData] = useState(props.data);

  const isSubmitEnabled = () => {
    const checkCount = checked.filter((x) => x).length;
    return checkCount >= 2 && data.limit <= checkCount - 1 && data.limit >= 1;
  };

  const onSubmit = () => {
    const selected = checked.filter((x) => x).length;
    if (selected < 2) {
      return false;
    }

    const submitData = { ...data };
    const weightsData = checked.reduce((sum, el, i) => {
      if (el) {
        sum.push(submitData.weights[i]);
      }
      return sum;
    }, []);
    props.onSubmit({
      ...submitData,
      weights: weightsData,
    });
  };

  const handleCheckboxChange = (e, i) => {
    const cloneChecked = [...checked];
    cloneChecked[i] = e;
    setChecked([...cloneChecked]);
  };

  const changeLimit = (limit) => {
    setData({
      ...data,
      limit: limit,
    });
  };

  const changeWeight = (e, i) => {
    const newData = { ...data };
    newData.weights = [...data.weights];
    newData.weights[i] = { ...data.weights[i], weight: e };
    setData(newData);
  };

  const decreaseLimit = (limit) => {
    if (limit === 1) {
      return false;
    }
    limit--;
    changeLimit(limit);
  };

  const increaseLimit = (limit) => {
    if (limit === data.weights.length - 1) {
      return false;
    }
    limit++;
    changeLimit(limit);
  };

  const decreaseWeight = (e, i) => {
    if (e === 1) {
      return false;
    }
    e--;
    changeWeight(e, i);
  };

  const increaseWeight = (e, i) => {
    e++;
    changeWeight(e, i);
  };

  return (
    <Card className={styles.randomItem}>
      <h4 className={styles.title}>{props.title}</h4>

      <div className={styles.randomBody}>
        <PriorityLimitController
          t={t}
          increaseLimit={increaseLimit}
          decreaseLimit={decreaseLimit}
          limit={data.limit}
        />

        <ul className={`${styles.list} ${styles.active}`}>
          {data &&
            data.weights &&
            data.weights.map((nestedItem, index) => (
              <PrioritisedChildDisplay
                key={index}
                code={nestedItem.code}
                weight={nestedItem.weight}
                handleChange={(checked) => handleCheckboxChange(checked, index)}
                decreaseWeight={(weight) => decreaseWeight(weight, index)}
                increaseWeight={(weight) => increaseWeight(weight, index)}
                checked={checked?.[index] || false}
                label={props.getChildLabelByCode(nestedItem.code)}
              />
            ))}
        </ul>
      </div>

      <div className={styles.randomAction}>
        <Button variant="text" onClick={(e) => props.onCancel()}>
          {t("cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={(e) => onSubmit()}
          disabled={!isSubmitEnabled()}
        >
          {t("submit")}
        </Button>
      </div>
    </Card>
  );
}

function PrioritisedChildDisplay({
  code,
  checked,
  label,
  weight,
  handleChange,
  increaseWeight,
  decreaseWeight,
}) {
  return (
    <li className={styles.listItem}>
      <Checkbox
        checked={checked}
        onChange={(e) => handleChange(e.target.checked)}
      />
      <div className={`${styles.content} ${styles.label}`}>
        {code}: {label}
      </div>
      <div className={styles.weight}>
        <IconButton size="small" onClick={(e) => decreaseWeight(weight)}>
          <RemoveCircleIcon />
        </IconButton>
        <span>{weight}</span>
        <IconButton size="small" onClick={(e) => increaseWeight(weight)}>
          <AddCircleIcon />
        </IconButton>
      </div>
    </li>
  );
}

function PriorityLimitController({ limit, increaseLimit, decreaseLimit, t }) {
  return (
    <>
      {t("priority_show")}
      <IconButton size="small" onClick={(e) => decreaseLimit(limit)}>
        <RemoveCircleIcon />
      </IconButton>
      {limit}
      <IconButton size="small" onClick={(e) => increaseLimit(limit)}>
        <AddCircleIcon />
      </IconButton>
    </>
  );
}
