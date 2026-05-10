/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserRole = "admin" | "student" | "teacher" | "user";

type AuthState = {
  token: string | null;
  user: { role?: UserRole; [key: string]: any } | null;
  authChecked: boolean;
};

const initialState: AuthState = {
  token: null,
  user: null,
  authChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    UserRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },

    UserLoggedIn: (
      state,
      action: PayloadAction<{ accessToken?: string; user: any }>
    ) => {
      state.token = action.payload.accessToken || state.token;
      state.user = action.payload.user;
      state.authChecked = true;
    },

    UserLoggedOut: (state) => {
      state.token = null;
      state.user = null;
      state.authChecked = true;
    },

    AuthChecked: (state) => {
      state.authChecked = true;
    },
  },
});

export const {
  UserRegistration,
  UserLoggedIn,
  UserLoggedOut,
  AuthChecked,
} = authSlice.actions;

export default authSlice.reducer;