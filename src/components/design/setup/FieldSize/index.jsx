import React from "react";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { changeAttribute } from "~/state/design/designState";

function FieldSize({
  label,
  rule,
  defaultValue,
  code,
  lowerBound,
  upperBound,
}) {
  const dispatch = useDispatch();

  const value = useSelector((state) => {
    return state.designState[code][rule] || defaultValue;
  });

  const onValueChange = (event) => {
    dispatch(
      changeAttribute({
        code,
        key: rule,
        value: Math.max(lowerBound, Math.min(upperBound, event.target.value)),
      })
    );
  };

  const isError = value < lowerBound || value > upperBound;

  return (
    <>
      <h4>{label}:</h4>
      <TextField
        label={label}
        error={isError}
        variant="outlined"
        type="number"
        size="small"
        style={{ maxWidth: "200px" }}
        value={value}
        onChange={(event) => onValueChange(event)}
      />
    </>
  );
}

export default FieldSize;
