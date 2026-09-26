import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import {
  useGetTemplatesQuery,
  useUploadTemplateMutation,
  useDeleteTemplateMutation,
} from "../redux/features/template/templateAPI";
import {
  setSearchQuery as setSearchQueryAction,
  openCreateModal as openCreateModalAction,
  closeCreateModal as closeCreateModalAction,
} from "../redux/features/template/templateSlice";
import type {
  CreateTemplatePayload,
  Template,
} from "../redux/features/template/templateTypes";

export function useTemplates() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: templates,
    isLoading,
    isError,
    isFetching,
  } = useGetTemplatesQuery();

  const [uploadTemplateMutation, { isLoading: isUploading }] =
    useUploadTemplateMutation();
  const [deleteTemplateMutation, { isLoading: isDeleting }] =
    useDeleteTemplateMutation();

  const searchQuery = useSelector(
    (state: RootState) => state.templateUI.searchQuery,
  );
  const isCreateModalOpen = useSelector(
    (state: RootState) => state.templateUI.isCreateModalOpen,
  );

  const allTemplates = templates ?? [];

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allTemplates;
    return allTemplates.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q),
    );
  }, [allTemplates, searchQuery]);

  const uploadTemplate = async (
    payload: CreateTemplatePayload,
  ): Promise<Template> => {
    return uploadTemplateMutation(payload).unwrap();
  };

  const deleteTemplate = async (id: string): Promise<void> => {
    await deleteTemplateMutation(id).unwrap();
  };

  return {
    templates: allTemplates,
    filteredTemplates,
    totalCount: allTemplates.length,
    isLoading,
    isFetching,
    isError,
    isUploading,
    isDeleting,
    uploadTemplate,
    deleteTemplate,
    searchQuery,
    isCreateModalOpen,
    setSearchQuery: (query: string) => dispatch(setSearchQueryAction(query)),
    openCreateModal: () => dispatch(openCreateModalAction()),
    closeCreateModal: () => dispatch(closeCreateModalAction()),
  };
}
