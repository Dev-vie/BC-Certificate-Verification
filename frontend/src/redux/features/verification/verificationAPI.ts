import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { VerificationResult } from "./verificationTypes";
import { getApiBaseUrl } from "../../../lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();
export const verificationApi = createApi({
  reducerPath: "verificationApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({

    verifyCertificate: builder.query<VerificationResult, string>({
      query: (certificateId) => `/verification/${certificateId}`,
    }),
  }),
});
export const { useVerifyCertificateQuery, useLazyVerifyCertificateQuery } =
  verificationApi;
