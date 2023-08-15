import {  Slide, useTheme } from "@mui/material";
import SetupComponentsPanel from "~/components/design/setup/SetupPanel";

import { useSelector } from "react-redux";
import React, { useState } from "react";

function RightPanel({ t }) {
  const theme = useTheme();

  const hasSetup = useSelector((state) => {
    return Object.keys(state.designState.setup || {}).length > 0;
  });


  return (
    <Slide
      direction={theme.direction == "ltr" ? "left" : "right"}
      in={hasSetup}
      mountOnEnter
      unmountOnExit
    >
      <SlidingSetupComponentsPanel t={t} />
    </Slide>
  );
}

const SlidingSetupComponentsPanel = React.forwardRef(function (props, ref) {
  return <SetupComponentsPanel passedref={ref} {...props} />;
});

export default RightPanel;
