import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./auth/userSlice";

export default configureStore({
  reducer: {
    user: userSlice,
  },
});
