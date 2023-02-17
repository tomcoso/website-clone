import { createSlice } from "@reduxjs/toolkit";

const redirectSlice = createSlice({
  name: "redirect",
  initialState: { path: null },
  reducers: {
    setPath: (state, action) => {
      state.path = action.payload.path;
    },
    clearPath: (state) => {
      state.path = null;
    },
  },
});

export const { setPath, clearPath } = redirectSlice.actions;
export default redirectSlice.reducer;
