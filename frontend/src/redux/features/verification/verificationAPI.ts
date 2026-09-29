import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { VerificationResult } from "./verificationTypes";
import { getApiBaseUrl } from "../../../lib/apiConfig";
import { verifyMockCertificate } from "../../../data/mockStore";

const API_BASE_URL = getApiBaseUrl();

export const verificationApi = createApi({
  reducerPath: "verificationApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    verifyCertificate: builder.query<VerificationResult, string>({
      queryFn: async (certificateId, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const result = await fetchWithBQ(`/verification/${certificateId}`);
          if (result.data) {
            return { data: result.data as VerificationResult };
          }
        } catch {
          // Ignore network failure and fall through to mock store
        }

        // Return robust mock data (supports valid IDs, search keywords, revoked, tampered)
        const mockData = verifyMockCertificate(certificateId);
        return { data: mockData as unknown as VerificationResult };
      },
    }),
  }),
});

export const { useVerifyCertificateQuery, useLazyVerifyCertificateQuery } =
  verificationApi;
