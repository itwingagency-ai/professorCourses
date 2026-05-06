/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data: { courseId: string; payment_info?: any }) => ({
        url: "create-order",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),

      invalidatesTags: ["User", "Courses", "Course"],
    }),
  }),

  overrideExisting: true,
});

export const { useCreateOrderMutation } = ordersApi;
