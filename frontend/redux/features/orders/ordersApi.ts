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
    createPaymentIntent: builder.mutation({
      query: (amount: number) => ({
        url: "payment",
        method: "POST",
        body: { amount },
      }),
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: "get-orders",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useCreateOrderMutation, useCreatePaymentIntentMutation, useGetAllOrdersQuery } = ordersApi;
