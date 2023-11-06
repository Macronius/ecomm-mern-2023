// set user's credentials to localStorage and remove them

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

//
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // match state and localStorage (almost always)
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      //
      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30d in ms
      localStorage.setItem("expirationTime", expirationTime);
    },
    logout: (state, action) => {
      // remove user and cart info from state & localStorage
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

// export setCredentials() as an action that can be called
export const { setCredentials, logout } = authSlice.actions;

// bring into store then export the reducer
export default authSlice.reducer;
