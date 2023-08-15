import { createSlice } from "@reduxjs/toolkit";

export const templateState = createSlice({
  name: "templateState",
  initialState: { state: {} },
  reducers: {
    setDirty: (state, action) => {
      state[action.payload] = true;
    },
    setFetching: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setDirty, setFetching } = templateState.actions;

export default templateState.reducer;
