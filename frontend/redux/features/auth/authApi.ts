/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiSlice } from "../api/apiSlice";
import { UserLoggedIn, UserLoggedOut, UserRegistration } from "./authSlice";

type RegistrationData = {
  name: string;
  email: string;
  password: string;
};

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type ActivationData = {
  activation_token: string;
  activation_code: string;
};

type ActivationResponse = {
  message: string;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "registration",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

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

    activation: builder.mutation<ActivationResponse, ActivationData>({
      query: ({ activation_token, activation_code }) => ({
        url: "activate-user",
        method: "POST",
        body: { activation_token, activation_code },
        credentials: "include" as const,
      }),
    }),

    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: { email, password },
        credentials: "include" as const,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          dispatch(
            UserLoggedIn({
              accessToken: result.data?.accessToken,
              user: result.data?.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },

      invalidatesTags: ["User"],
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

          dispatch(
            UserLoggedIn({
              accessToken: result.data?.accessToken,
              user: result.data?.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },

      invalidatesTags: ["User"],
    }),

    logOut: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
        credentials: "include" as const,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          console.log("Logout API error ignored, clearing local auth anyway:", error);
        } finally {
          // NOTE: Do NOT call apiSlice.util.resetApiState() here.
          // Resetting the entire RTK Query cache nukes the loadUser subscription,
          // causing it to re-fire on every navigation. If the backend is slow,
          // UserLoggedOut() fires mid-navigation and role guards redirect to "/".
          dispatch(UserLoggedOut());
        }
      },
    }),

    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: "forgot-password",
        method: "POST",
        body: { email },
        credentials: "include" as const,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: "reset-password",
        method: "POST",
        body: { token, password },
        credentials: "include" as const,
      }),
    }),
  }),

  overrideExisting: true,
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useLogOutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
