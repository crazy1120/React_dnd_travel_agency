import styles from "./SCQArrayDesign.module.css";
import { Droppable } from "react-beautiful-dnd";
import { Button, useTheme } from "@mui/material";
import ChoiceItemDesign from "~/components/Questions/Choice/ChoiceItemDesign";
import { useSelector } from "react-redux";

function SCQArray(props) {
  const theme = useTheme();
  const t = props.t;

  const rows = useSelector((state) => {
    return (
      state.designState[props.code].children?.filter(
        (el) => el.type == "row"
      ) || []
    );
  });

  const columns = useSelector((state) => {
    return (
      state.designState[props.code].children?.filter(
        (el) => el.type == "column"
      ) || []
    );
  });

  return (
    <div className={styles.scqList}>
      <Droppable droppableId={`row-${props.code}`} type={`row-${props.code}`}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={styles.scqItem}
          >
            <h5>{props.t("rows")}</h5>
            {rows &&
              rows.map((item, index) => {
                return (
                  <ChoiceItemDesign
                    key={item.code}
                    code={item.code}
                    t={props.t}
                    index={index}
                    qualifiedCode={item.qualifiedCode}
                    type="numberOrder"
                  />
                );
              })}
            {provided.placeholder}
            {props.onMainLang && (
              <div className={styles.answerAdd}>
                <Button
                  sx={{
                    fontFamily: theme.textStyles.text.font,
                    fontSize: theme.textStyles.text.size,
                  }}
                  onClick={(e) =>
                    props.addNewAnswer(props.code, props.type, "row")
                  }
                >
                  {t("add_row")}
                </Button>
              </div>
            )}
          </div>
        )}
      </Droppable>
      <Droppable droppableId={`col-${props.code}`} type={`col-${props.code}`}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={styles.scqItem}
          >
            <h5>{props.t("columns")}</h5>
            {columns &&
              columns.map((item, index) => {
                return (
                  <ChoiceItemDesign
                    key={item.code}
                    t={props.t}
                    code={item.code}
                    index={index}
                    qualifiedCode={item.qualifiedCode}
                    type="radio"
                  />
                );
              })}
            {provided.placeholder}
            {props.onMainLang && (
              <div className={styles.answerAdd}>
                <Button
                  sx={{
                    fontFamily: theme.textStyles.text.font,
                    fontSize: theme.textStyles.text.size,
                  }}
                  size="small"
                  onClick={(e) =>
                    props.addNewAnswer(props.code, props.type, "column")
                  }
                >
                  {t("add_column")}
                </Button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default SCQArray;
