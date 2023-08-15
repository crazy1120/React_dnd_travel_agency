import { configureStore } from "@reduxjs/toolkit";
import runState from "~/state/runState";
import designState from "~/state/design/designState";
import editState from "~/state/edit/editState";
import templateState from "~/state/templateState";

export const runStore = configureStore({
  reducer: { templateState, runState },
});
export const manageStore = configureStore({
  reducer: { templateState, designState, editState }
});
