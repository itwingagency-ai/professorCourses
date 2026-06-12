/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Enroll in a course (free or future paid)
    createOrder: builder.mutation({
      query: (data: { courseId: string; payment_info?: any }) => ({
        url: "create-order",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["User", "Courses", "Course"],
    }),

    // Check enrollment status for a specific course
    getEnrollmentStatus: builder.query({
      query: (courseId: string) => ({
        url: `enrollment-status/${courseId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (result, error, courseId) => [
        { type: "Course", id: courseId },
      ],
    }),

    // Admin: update enrollment status of an order
    updateEnrollmentStatus: builder.mutation({
      query: ({ orderId, status }: { orderId: string; status: string }) => ({
        url: `orders/${orderId}/status`,
        method: "PATCH",
        body: { status },
        credentials: "include" as const,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Future Stripe payment intent
    createPaymentIntent: builder.mutation({
      query: (amount: number) => ({
        url: "payment",
        method: "POST",
        body: { amount },
      }),
    }),

    // Admin: all orders
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

export const {
  useCreateOrderMutation,
  useGetEnrollmentStatusQuery,
  useUpdateEnrollmentStatusMutation,
  useCreatePaymentIntentMutation,
  useGetAllOrdersQuery,
} = ordersApi;
