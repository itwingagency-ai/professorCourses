/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
// This file is used for auth-related API actions

import { apiSlice } from "../api/apiSlice";
import { UserLoggedIn, UserLoggedOut, UserRegistration } from "./authSlice";

// Define the shape of the registration data
type RegistrationData = {
  name: string;
  email: string;
  password: string;
  // Add any other fields you expect in your registration data
};

// Define the shape of the registration response
type RegistrationResponse = {
  [x: string]: any;
  message: string;
  activationToken: string;
  // Add any other fields you expect in your response
};

// Define the shape of the activation data
type ActivationData = {
  activation_token: string;
  activation_code: string;
};

// Define the shape of the activation response
type ActivationResponse = {
  message: string;
  // Add any other fields you expect in your activation response
};

// Injecting endpoints here to separate the logic/code from {../api/apiSlice.ts}
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Registration endpoint
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      // Endpoint URL and method
      query: (data) => ({
        url: "registration",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      // Validation and state update
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // Dispatch action to update auth state with the activation token
          dispatch(
            UserRegistration({
              token: result.data.activationToken,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),

    // Activation endpoint
    activation: builder.mutation<ActivationResponse, ActivationData>({
      // Endpoint URL and method
      query: ({ activation_token, activation_code }) => ({
        url: "activate-user",
        method: "POST",
        body: { activation_token, activation_code },
      }),
    }),
    // login endpoints
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "Login",
        method: "POST",
        body: { email, password },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // Dispatch action
          dispatch(
            UserLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    socialAuth: builder.mutation({
      query: ({ email, name, avatar }) => ({
        url: "social-auth",
        method: "POST",
        body: { email, name, avatar },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // Dispatch action
          dispatch(
            UserLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    logOut: builder.query({
      query: () => ({
        url: "logout",
        method: "GET",

        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          // Dispatch action
          dispatch(
            UserLoggedOut()
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
  // Allow overriding existing endpoints if they already exist
  overrideExisting: true,
});

// Export hooks for using the API endpoints
export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useLogOutQuery
} = authApi;
