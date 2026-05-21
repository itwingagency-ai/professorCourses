/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserLoggedIn, UserLoggedOut, AuthChecked } from "../auth/authSlice";
import { API_BASE_URL } from "@/lib/apiConfig";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (process.env.NODE_ENV === "development") {
      const url = typeof args === "string" ? args : args.url;
      console.log("[RTK API]", API_BASE_URL, url, result);
    }

    return result;
  },

  tagTypes: ["User", "Courses", "Course", "StudentProgress", "Notifications"],

  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => ({
        url: "refresh",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    loadUser: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
        credentials: "include" as const,
      }),

      providesTags: ["User"],

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
          // On error (e.g. 401 unauthenticated), mark auth as checked
          // WITHOUT dispatching UserLoggedOut — that would clear user state
          // and trigger role guards to redirect to "/" on any transient
          // network hiccup. Only dispatch UserLoggedOut on explicit logout.
          dispatch(AuthChecked());
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
