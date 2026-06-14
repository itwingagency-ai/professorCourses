import { apiSlice } from "../api/apiSlice";

export const certificateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyCertificates: builder.query<any, void>({
      query: () => ({
        url: `certificate/my-certificates`,
        method: "GET",
      }),
      providesTags: ["Certificate"],
    }),
    verifyCertificate: builder.query<any, string>({
      query: (certificateId) => ({
        url: `certificate/verify/${certificateId}`,
        method: "GET",
      }),
    }),
    getAllCertificatesAdmin: builder.query<any, void>({
      query: () => ({
        url: `certificate/admin/all`,
        method: "GET",
      }),
      providesTags: ["Certificate"],
    }),
    revokeCertificateAdmin: builder.mutation<any, string>({
      query: (certificateId) => ({
        url: `certificate/admin/revoke/${certificateId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Certificate"],
    }),
    restoreCertificateAdmin: builder.mutation<any, string>({
      query: (certificateId) => ({
        url: `certificate/admin/restore/${certificateId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Certificate"],
    }),
  }),
});

export const {
  useGetMyCertificatesQuery,
  useVerifyCertificateQuery,
  useGetAllCertificatesAdminQuery,
  useRevokeCertificateAdminMutation,
  useRestoreCertificateAdminMutation,
} = certificateApi;
