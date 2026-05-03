/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiSlice } from "../api/apiSlice";
export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getcourseanalytics
    getCoursesAnalytics: builder.query({
      query: () => ({
        url: "get-courses-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    // get orders analytics
    getOrdersAnalytics: builder.query({
        query: () => ({
          url: "get-orders-analytics",
          method: "GET",
          credentials: "include" as const,
        }),
      }),
      getUsersAnalytics: builder.query({
        query: () => ({
          url: "get-users-analytics",
          method: "GET",
          credentials: "include" as const,
        }),
      }),
  }),
});

export const {useGetCoursesAnalyticsQuery, useGetOrdersAnalyticsQuery, useGetUsersAnalyticsQuery} = analyticsApi;
