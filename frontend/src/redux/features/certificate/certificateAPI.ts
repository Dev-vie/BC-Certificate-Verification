import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../baseQueryWithReauth";
import type {
  Certificate,
  IssueSingleCertificatePayload,
  IssueBulkCertificatesPayload,
  IssueBulkResult,
} from "./certificateTypes";

function normalizeCertificate(raw: any): Certificate {
  const c = raw?.certificate ?? raw?.data ?? raw;
  return { ...c, id: String(c?.id) };
}

function normalizeCertificateList(raw: any): Certificate[] {
  const list = raw?.certificates ?? raw?.data ?? raw;
  const arr = Array.isArray(list) ? list : [];
  return arr.map(normalizeCertificate);
}

export const certificateApi = createApi({
  reducerPath: "certificateApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Certificate"],
  endpoints: (builder) => ({

    getCertificates: builder.query<Certificate[], void>({
      query: () => "/certificates",
      transformResponse: normalizeCertificateList,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Certificate" as const, id })),
              { type: "Certificate" as const, id: "LIST" },
            ]
          : [{ type: "Certificate" as const, id: "LIST" }],
    }),

    getCertificateById: builder.query<Certificate, string>({
      query: (id) => `/certificates/${id}`,
      transformResponse: normalizeCertificate,
      providesTags: (_result, _error, id) => [{ type: "Certificate", id }],
    }),

    issueSingleCertificate: builder.mutation<
      Certificate,
      IssueSingleCertificatePayload
    >({
      query: (payload) => ({
        url: "/certificates/issue",
        method: "POST",
        body: payload,
      }),
      transformResponse: normalizeCertificate,
      invalidatesTags: [{ type: "Certificate", id: "LIST" }],
    }),

    issueBulkCertificates: builder.mutation<
      IssueBulkResult,
      IssueBulkCertificatesPayload
    >({
      query: ({ templateId, file }) => {
        const formData = new FormData();
        formData.append("templateId", String(templateId));
        formData.append("file", file);
        return {
          url: "/certificates/issue-bulk",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Certificate", id: "LIST" }],
    }),

    revokeCertificate: builder.mutation<Certificate, string>({
      query: (id) => ({
        url: `/certificates/${id}/revoke`,
        method: "PATCH",
      }),
      transformResponse: normalizeCertificate,
      invalidatesTags: (_result, _error, id) => [
        { type: "Certificate", id },
        { type: "Certificate", id: "LIST" },
      ],
    }),

    deleteCertificate: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/certificates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Certificate", id }],
    }),
  }),
});

export const {
  useGetCertificatesQuery,
  useGetCertificateByIdQuery,
  useIssueSingleCertificateMutation,
  useIssueBulkCertificatesMutation,
  useRevokeCertificateMutation,
  useDeleteCertificateMutation,
} = certificateApi;
