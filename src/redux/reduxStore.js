import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import redirectSlice from "./redirectSlice";
import themeSlice from "./themeSlice";

export default configureStore({
  reducer: {
    user: userSlice,
    theme: themeSlice,
    redirect: redirectSlice,
  },
});
