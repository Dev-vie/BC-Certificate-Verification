import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../baseQueryWithReauth";
import type {
  Template,
  CreateTemplatePayload,
  UpdatePlaceholdersPayload,
} from "./templateTypes";

function normalizeTemplate(raw: any): Template {
  const t = raw?.template ?? raw?.data ?? raw;
  const rawPlaceholders = t?.placeholders;
  const fields = Array.isArray(rawPlaceholders)
    ? rawPlaceholders
    : Array.isArray(rawPlaceholders?.fields)
    ? rawPlaceholders.fields
    : [];

  return {
    ...t,
    id: String(t?.id),
    templateFileUrl: t?.filePath,
    placeholders: rawPlaceholders ?? [],
    fieldsCount: fields.length,
  };
}

function normalizeTemplateList(raw: any): Template[] {
  const list = raw?.templates ?? raw?.data ?? raw;
  const arr = Array.isArray(list) ? list : [];
  return arr.map(normalizeTemplate);
}

export const templateApi = createApi({
  reducerPath: "templateApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Template"],
  endpoints: (builder) => ({

    getTemplates: builder.query<Template[], void>({
      query: () => "/templates",
      transformResponse: normalizeTemplateList,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Template" as const, id })),
              { type: "Template" as const, id: "LIST" },
            ]
          : [{ type: "Template" as const, id: "LIST" }],
    }),

    uploadTemplate: builder.mutation<Template, CreateTemplatePayload>({
      query: ({ title, placeholders, file }) => {
        const formData = new FormData();
        formData.append("title", title);

        formData.append("placeholders", placeholders ?? "[]");
        formData.append("file", file);

        return {
          url: "/templates",
          method: "POST",
          body: formData,
          // Don't set Content-Type manually — fetchBaseQuery leaves it
          // alone for FormData bodies so the browser sets the multipart
          // boundary correctly.
        };
      },
      transformResponse: normalizeTemplate,
      invalidatesTags: [{ type: "Template", id: "LIST" }],
    }),

    deleteTemplate: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Template", id }],
    }),

    updateTemplatePlaceholders: builder.mutation<
      Template,
      UpdatePlaceholdersPayload
    >({
      query: ({ id, placeholders, fieldsCount }) => ({
        url: `/templates/${id}`,
        method: "PATCH",
        body: { placeholders, fieldsCount },
      }),
      transformResponse: normalizeTemplate,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Template", id },
        { type: "Template", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useUploadTemplateMutation,
  useDeleteTemplateMutation,
  useUpdateTemplatePlaceholdersMutation,
} = templateApi;
