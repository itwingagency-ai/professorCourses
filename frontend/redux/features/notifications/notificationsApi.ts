import { apiSlice } from "../api/apiSlice";

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<any, void>({
      query: () => ({
        url: "get-all-notifications",
        method: "GET",
      }),
      providesTags: ["Notifications" as any],
    }),
    updateNotificationStatus: builder.mutation<any, string>({
      query: (id) => ({
        url: `update-notification/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications" as any],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useUpdateNotificationStatusMutation,
} = notificationsApi;
