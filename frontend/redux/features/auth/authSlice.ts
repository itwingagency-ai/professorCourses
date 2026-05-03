/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial state for the authentication slice
const initialState = {
  token: "", // Stores the token for authenticated users
  user: "", // Stores user details (can be expanded as needed)
};

const authSlice = createSlice({
  name: "auth", // Name of the slice for easier reference in dev tools
  initialState,
  reducers: {
    // Reducer for registering a user; only sets token in this example
    UserRegistration: (state, action :PayloadAction<{token: string}>) => {
      state.token = action.payload.token; // Sets the token from action payload
    },
    // Reducer for logging in a user; updates both token and user details
    UserLoggedIn: (state, action:PayloadAction<{accessToken: string,user:string }>) => {
      state.token = action.payload.accessToken; // Sets access token from payload
      state.user = action.payload.user; // Sets user details from payload
    },
    // Reducer for logging out a user; resets token and user to initial state
    UserLoggedOut: (state) => {
      state.token = ""; // Clears token upon logout
      state.user = ""; // Clears user details upon logout
    },
  },
});

// Export actions to be used in components
export const { UserRegistration, UserLoggedIn, UserLoggedOut } = authSlice.actions;

// Export the slice's reducer to be included in the store
export default authSlice.reducer;
 