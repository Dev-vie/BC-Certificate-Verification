import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { useLazyVerifyCertificateQuery } from "../redux/features/verification/verificationAPI";
import {
  setActiveTab as setActiveTabAction,
  setInputValue as setInputValueAction,
  setCameraActive,
  setSelectedDevice as setSelectedDeviceAction,
  setPaused,
  setScannerError as setScannerErrorAction,
  verifyStart,
  verifySuccess,
  verifyFailure,
  reset as resetAction,
} from "../redux/features/verification/verificationSlice";
import type { VerifyTab } from "../redux/features/verification/verificationTypes";

function extractCertificateId(rawValue: string): string {
  try {
    const url = new URL(rawValue);
    const segments = url.pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] || rawValue.trim();
  } catch {
    return rawValue.trim();
  }
}

export function useVerification() {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((s: RootState) => s.verificationUI);
  const [triggerVerify] = useLazyVerifyCertificateQuery();

  const verify = useCallback(
    async (rawValue: string) => {
      const certificateId = extractCertificateId(rawValue);
      dispatch(verifyStart());
      try {
        const result = await triggerVerify(certificateId).unwrap();
        dispatch(verifySuccess(result));
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        dispatch(verifyFailure(message));
      }
    },
    [dispatch, triggerVerify],
  );

  const rejectHashVerification = useCallback(() => {
    dispatch(
      verifyFailure(
        "Hash-based lookup isn't available yet on this deployment — verify by link or QR code instead.",
      ),
    );
  }, [dispatch]);

  const reset = useCallback(() => dispatch(resetAction()), [dispatch]);

  return {
    ...state,
    setActiveTab: (tab: VerifyTab) => dispatch(setActiveTabAction(tab)),
    setInputValue: (value: string) => dispatch(setInputValueAction(value)),
    setIsCameraActive: (active: boolean) => dispatch(setCameraActive(active)),
    setSelectedDevice: (deviceId: string | null) =>
      dispatch(setSelectedDeviceAction(deviceId)),
    setIsPaused: (paused: boolean) => dispatch(setPaused(paused)),
    setScannerError: (error: string | null) =>
      dispatch(setScannerErrorAction(error)),
    verify,
    rejectHashVerification,
    reset,
  };
}

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const maybe = err as {
      data?: { message?: string };
      error?: string;
      status?: number;
    };
    if (maybe.data?.message) return maybe.data.message;
    if (maybe.status === 404) {
      return "No certificate found for that link, hash, or code. Double-check it and try again.";
    }
    if (maybe.error) return maybe.error;
  }
  return "Something went wrong while verifying this certificate. Please try again.";
}
