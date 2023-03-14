import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import redirectSlice from "./redirectSlice";
import themeSlice from "./themeSlice";
import draftSlice from "./draftSlice";

export default configureStore({
  reducer: {
    user: userSlice,
    theme: themeSlice,
    redirect: redirectSlice,
    draft: draftSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});
