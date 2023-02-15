import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./auth/userSlice";
import themeSlice from "./themeSlice";

export default configureStore({
  reducer: {
    user: userSlice,
    theme: themeSlice,
  },
});
