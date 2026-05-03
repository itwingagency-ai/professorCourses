// "use client" directive to enable client-side rendering in Next.js
"use client";

// Importing the configureStore function from Redux Toolkit
import { configureStore } from "@reduxjs/toolkit";

// Importing the apiSlice which manages API calls and state
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";
// Configure the Redux store
export const store = configureStore({
  // Define the application's reducers
  reducer: {
    // Adding apiSlice's reducer to the store
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  // Disable Redux DevTools extension for this environment
  devTools: false,
  // Adding default middleware and including apiSlice's custom middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Async function to refresh the token and load user data when the app starts
const initializeApp = async () => {
  // Dispatch token refresh, ensuring it runs on every reload
 {/** await store.dispatch(
    apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true })
  ); */} 
  // Dispatch user data load, ensuring it runs on every reload
  await store.dispatch(
    apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
  ); 
};

// Immediately call `initializeApp` to execute these functions on app start
initializeApp();
