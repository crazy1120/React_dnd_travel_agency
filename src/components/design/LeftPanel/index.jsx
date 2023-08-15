import { Button, Slide, useTheme } from "@mui/material";
import styles from "./LeftPanel.module.css";

import NewComponentsPanel from "~/components/design/NewComponentsPanel";
import React from "react";
import { AddBox } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { onAddComponentsVisibilityChange } from "~/state/design/designState";

function LeftPanel({ t }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const visible = useSelector(
    (state) => state.designState.addComponentsVisibility !== false
  );

  return (
    <>
      <Slide
        direction={theme.direction == "ltr" ? "right" : "left"}
        in={visible}
        mountOnEnter
        unmountOnExit
      >
        <SlidingNewComponentPanel
          t={t}
          onClose={() => {
            dispatch(onAddComponentsVisibilityChange(false));
          }}
        />
      </Slide>

      {!visible && (
        <div className={styles.stickyButton}>
          <Button
            variant="contained"
            startIcon={<AddBox />}
            onClick={() => {
              dispatch(onAddComponentsVisibilityChange(true));
            }}
          >
            Add Components
          </Button>
        </div>
      )}
    </>
  );
}

const SlidingNewComponentPanel = React.forwardRef(function (props, ref) {
  return <NewComponentsPanel passedref={ref} {...props} />;
});

export default LeftPanel;
