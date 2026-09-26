import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { useGetTemplatesQuery } from "../redux/features/template/templateAPI";
import type { Template } from "../redux/features/template/templateTypes";
import {
  useIssueSingleCertificateMutation,
  useIssueBulkCertificatesMutation,
} from "../redux/features/certificate/certificateAPI";
import type {
  Certificate,
  IssueSingleCertificatePayload,
  IssueBulkCertificatesPayload,
  IssueBulkResult,
} from "../redux/features/certificate/certificateTypes";
import {
  setSelectedTemplateId as setSelectedTemplateIdAction,
  setMode as setModeAction,
  openTemplatePicker as openTemplatePickerAction,
  closeTemplatePicker as closeTemplatePickerAction,
  type IssueMode,
} from "../redux/features/certificate/certificateSlice";

export function useIssueCertificate() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: templates,
    isLoading: isLoadingTemplates,
    isError: isTemplatesError,
  } = useGetTemplatesQuery();

  const [issueSingleCertificateMutation, { isLoading: isIssuing }] =
    useIssueSingleCertificateMutation();
  const [issueBulkCertificatesMutation, { isLoading: isIssuingBulk }] =
    useIssueBulkCertificatesMutation();

  const selectedTemplateId = useSelector(
    (state: RootState) => state.certificateUI.selectedTemplateId,
  );
  const mode = useSelector((state: RootState) => state.certificateUI.mode);
  const isPickerOpen = useSelector(
    (state: RootState) => state.certificateUI.isPickerOpen,
  );

  const allTemplates: Template[] = templates ?? [];

  const selectedTemplate: Template | undefined = useMemo(
    () =>
      allTemplates.find((t) => t.id === selectedTemplateId) ?? allTemplates[0],
    [allTemplates, selectedTemplateId],
  );

  const issueSingleCertificate = async (
    payload: IssueSingleCertificatePayload,
  ): Promise<Certificate> => {
    return issueSingleCertificateMutation(payload).unwrap();
  };

  const issueBulkCertificates = async (
    payload: IssueBulkCertificatesPayload,
  ): Promise<IssueBulkResult> => {
    return issueBulkCertificatesMutation(payload).unwrap();
  };

  return {
    templates: allTemplates,
    isLoadingTemplates,
    isTemplatesError,
    selectedTemplate,
    selectedTemplateId,
    setSelectedTemplateId: (id: string) =>
      dispatch(setSelectedTemplateIdAction(id)),
    mode,
    setMode: (m: IssueMode) => dispatch(setModeAction(m)),
    isPickerOpen,
    openTemplatePicker: () => dispatch(openTemplatePickerAction()),
    closeTemplatePicker: () => dispatch(closeTemplatePickerAction()),
    issueSingleCertificate,
    isIssuing,
    issueBulkCertificates,
    isIssuingBulk,
  };
}
