import {
  useGetCertificatesQuery,
  useRevokeCertificateMutation,
  useDeleteCertificateMutation,
} from "../redux/features/certificate/certificateAPI";

export function useCertificateList() {
  const { data: certificates, isLoading, isError } = useGetCertificatesQuery();

  const [revokeCertificateMutation, { isLoading: isRevoking }] =
    useRevokeCertificateMutation();
  const [deleteCertificateMutation, { isLoading: isDeleting }] =
    useDeleteCertificateMutation();

  const revokeCertificate = async (id: string) => {
    return revokeCertificateMutation(id).unwrap();
  };

  const deleteCertificate = async (id: string) => {
    return deleteCertificateMutation(id).unwrap();
  };

  const deleteCertificates = async (
    ids: string[],
  ): Promise<{ succeeded: string[]; failed: string[] }> => {
    const results = await Promise.allSettled(
      ids.map((id) => deleteCertificateMutation(id).unwrap()),
    );
    const succeeded: string[] = [];
    const failed: string[] = [];
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        succeeded.push(ids[index]);
      } else {
        failed.push(ids[index]);
      }
    });
    return { succeeded, failed };
  };

  return {
    certificates: certificates ?? [],
    isLoading,
    isError,
    revokeCertificate,
    isRevoking,
    deleteCertificate,
    deleteCertificates,
    isDeleting,
  };
}
