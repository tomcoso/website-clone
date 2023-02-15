import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: "light",
  reducers: {
    change: (state) => {
      return state === "dark" ? "light" : "dark";
    },
  },
});

export default themeSlice.reducer;
export const { change } = themeSlice.actions;
