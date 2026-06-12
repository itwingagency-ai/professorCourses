import { apiSlice } from "../api/apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<any, void>({
      query: () => ({
        url: "admin/dashboard",
        method: "GET",
      }),
    }),
    getAdminUserById: builder.query<any, string>({
      query: (id) => ({
        url: `admin/users/${id}`,
        method: "GET",
      }),
    }),
    getAdminUserOrders: builder.query<any, string>({
      query: (id) => ({
        url: `admin/users/${id}/orders`,
        method: "GET",
      }),
    }),
    getAdminCourseStudents: builder.query<any, string>({
      query: (id) => ({
        url: `admin/courses/${id}/students`,
        method: "GET",
      }),
    }),
    getAdminOrderById: builder.query<any, string>({
      query: (id) => ({
        url: `admin/orders/${id}`,
        method: "GET",
      }),
    }),
    getAdminAuditLogs: builder.query<any, void>({
      query: () => ({
        url: "admin/audit-logs",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetAdminUserByIdQuery,
  useGetAdminUserOrdersQuery,
  useGetAdminCourseStudentsQuery,
  useGetAdminOrderByIdQuery,
  useGetAdminAuditLogsQuery,
} = adminApi;
