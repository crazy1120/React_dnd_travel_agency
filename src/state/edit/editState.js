import { createSlice } from "@reduxjs/toolkit";
import { isEquivalent } from "~/utils/design/utils";

export const editState = createSlice({
  name: "editState",
  initialState: { state: {} },
  reducers: {
    setSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    setUpdating: (state, action) => {
      state.isUpdating = action.payload;
    },
    surveyReceived: (state, action) => {
      let survey = action.payload;
      if (!isEquivalent(state.survey, survey)) {
        state.survey = survey;
      }
      state.error = "";
    },
    permissionsReceived: (state, action) => {
      let permissions = action.payload;
      if (!isEquivalent(state.permissions, permissions)) {
        state.permissions = permissions;
      }
    },
    permissionsLoading: (state, action) => {
      console.log("permissionsLoading: " + action.payload);
      state.permissionsLoading = action.payload;
    },
    surveyAttributeChanged: (state, action) => {
      let payload = action.payload;
      state.survey[payload.key] = payload.value;
    },
    surveyAttributeChangedImmediate: (state, action) => {
      let payload = action.payload;
      state.survey[payload.key] = payload.value;
    },
    onError: (state, action) => {
      state.error = action.payload || false;
    },
    onErrorSeen: (state) => {
      state.error = "";
    },
  },
});

export const {
  surveyReceived,
  permissionsReceived,
  permissionsLoading,
  setSaving,
  setUpdating,
  onError,
  onErrorSeen,
  surveyAttributeChanged,
  surveyAttributeChangedImmediate,
} = editState.actions;

export default editState.reducer;
