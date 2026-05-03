/* eslint-disable @typescript-eslint/no-unused-vars */
// Disable the TypeScript ESLint rule for unused variables
/* eslint-disable @typescript-eslint/no-explicit-any */
// Import the createApi function and fetchBaseQuery from Redux Toolkit Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserLoggedIn } from "../auth/authSlice";
// Define the apiSlice to handle API requests and state
export const apiSlice = createApi({
  // Define a unique name for the slice's reducer in the Redux store
  reducerPath: "api",
  // Configure the base query with the base URL for API requests
  baseQuery: fetchBaseQuery({
    // The base URL is sourced from an environment variable for flexibility
    baseUrl: process.env.NEXT_PUBLIC_SERVER_API,
  }),
  // we have added new file for our endpoints to avoid confusion {auth/authApi.ts}
  endpoints: (builder) => ({
    // Define the endpoints of refreshtoken each time when our website get's reload
    // calling this from {client/redux/store.ts}
    // Define the endpoints of `refreshToken` each time when our website reloads
    refreshToken: builder.query({
      query: (data) => ({
        url: "refresh", // Endpoint URL for refreshing token
        method: "GET",
        credentials: "include" as const, // Send cookies for session management
      }),
    }),

    // Define the `loadUser` endpoint to fetch authenticated user's data
    loadUser: builder.query({
      query: (data) => ({
        url: "me", // Endpoint URL to load user data
        method: "GET",
        credentials: "include" as const, // Include cookies with request
      }),

      // Runs when `loadUser` is called, handling any updates to the user data
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled; // Wait for API call to finish
          // Dispatch user data to Redux store after successful response
          dispatch(
            UserLoggedIn({
              accessToken: result.data.accessToken, // Store new access token
              user: result.data.user, // Store user profile information
            })
          );
        } catch (error: any) {
          console.log(error); // Log any errors
        }
      },
    }),
  }),
});

// Export an empty object to avoid unused exports; hooks will be added later
export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
