import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    username: null,
    pfp: null,
    email: null,
    uid: null,
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.uid = action.payload.uid;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.username = null;
      state.email = null;
      state.uid = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
