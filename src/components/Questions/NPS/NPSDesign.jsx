import styles from "./NPSDesign.module.css";
import { Box, useTheme } from "@mui/material";
import { useSelector } from "react-redux";

function NPSDesign({ code }) {
  const theme = useTheme();
  let columns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const state = useSelector((state) => {
    return state.designState[code];
  });

  const lang = useSelector((state) => {
    return state.designState.langInfo.lang;
  });

  return (
    <>
      <Box className={styles.choiceLabels}>
        <Box>{state.content?.lower_bound_hint?.[lang]}</Box>
        <Box>{state.content?.higher_bound_hint?.[lang]}</Box>
      </Box>
      <Box className={styles.choicesContainer}>
        {columns.map((option) => {
          return (
            <Box key={option} className={styles.choice}>
              {option}
            </Box>
          );
        })}
      </Box>
    </>
  );
}

export default NPSDesign;
