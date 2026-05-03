/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (tyoe) => ({
        url: `get-orders`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});
export const { useGetAllOrdersQuery } = ordersApi;
