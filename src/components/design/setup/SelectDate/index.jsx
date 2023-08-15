import { TextField } from "@mui/material";
import { changeAttribute } from "~/state/design/designState";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import styles from "./SelectDate.module.css";

function SelectDate({ label, rule, code }) {
  const dispatch = useDispatch();

  const value = useSelector((state) => {
    return state.designState[code][rule] || "";
  });

  return (
    <div className={styles.selectDate}>
      <h4>{label}</h4>
      <TextField
        className={styles.selectDateField}
        variant="standard"
        value={value}
        type="date"
        onChange={(event) => {
          dispatch(
            changeAttribute({ code, key: rule, value: event.target.value })
          );
        }}
      />
    </div>
  );
}

export default SelectDate;
