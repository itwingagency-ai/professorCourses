/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";
import { UserLoggedIn } from "../auth/authSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (data: { name?: string }) => ({
        url: "update-user-info",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          if (result?.data?.user) {
            dispatch(
              UserLoggedIn({
                accessToken: result.data?.accessToken,
                user: result.data.user,
              })
            );
          }
        } catch (error) {
          console.log("Update profile failed:", error);
        }
      },

      invalidatesTags: ["User"],
    }),

    updateAvatar: builder.mutation({
      query: (avatar: string) => ({
        url: "update-user-avatar",
        method: "PUT",
        body: { avatar },
        credentials: "include" as const,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          if (result?.data?.user) {
            dispatch(
              UserLoggedIn({
                accessToken: result.data?.accessToken,
                user: result.data.user,
              })
            );
          }
        } catch (error) {
          console.log("Update avatar failed:", error);
        }
      },

      invalidatesTags: ["User"],
    }),

    updatePassword: builder.mutation({
      query: (data: {
        oldPassword: string;
        newPassword: string;
        confirmPassword?: string;
      }) => ({
        url: "update-user-password",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),

      invalidatesTags: ["User"],
    }),

    getAllUsers: builder.query({
      query: () => ({
        url: "get-users",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `delete-user/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ["User"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useUpdatePasswordMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
} = userApi;
