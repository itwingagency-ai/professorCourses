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
  }),
});

export const {
  useGetMyCertificatesQuery,
  useVerifyCertificateQuery,
} = certificateApi;
