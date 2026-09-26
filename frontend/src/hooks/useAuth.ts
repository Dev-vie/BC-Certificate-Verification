import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/features/auth/index";
import {
  registerInstitution,
  verifyEmail as verifyEmailThunk,
  login as loginThunk,
  forgotPassword as forgotPasswordThunk,
  verifyResetCode as verifyResetCodeThunk,
  resetPassword as resetPasswordThunk,
  logout as logoutAction,
  clearAuthError,
  clearAuthMessage,
  loginWithGoogleSuccess,
} from "../redux/features/auth/authSlice";
import type {
  RegisterPayload,
  VerifyEmailPayload,
  LoginPayload,
  ForgotPasswordPayload,
  VerifyResetCodePayload,
  ResetPasswordPayload,
  AuthState,
} from "../redux/features/auth/authTypes";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { institution, token, isAuthenticated, loading, error, message } =
    useAppSelector((state) => state.auth);

  const register = useCallback(
    (payload: RegisterPayload) => dispatch(registerInstitution(payload)),
    [dispatch],
  );

  const verifyEmail = useCallback(
    (payload: VerifyEmailPayload) => dispatch(verifyEmailThunk(payload)),
    [dispatch],
  );

  const login = useCallback(
    (payload: LoginPayload) => dispatch(loginThunk(payload)),
    [dispatch],
  );

  const forgotPassword = useCallback(
    (payload: ForgotPasswordPayload) => dispatch(forgotPasswordThunk(payload)),
    [dispatch],
  );

  const verifyResetCode = useCallback(
    (payload: VerifyResetCodePayload) =>
      dispatch(verifyResetCodeThunk(payload)),
    [dispatch],
  );

  const resetPassword = useCallback(
    (payload: ResetPasswordPayload) => dispatch(resetPasswordThunk(payload)),
    [dispatch],
  );

  const loginWithGoogle = useCallback(
    (payload: { token: string; institution: AuthState["institution"] }) =>
      dispatch(loginWithGoogleSuccess(payload)),
    [dispatch],
  );

  const logout = useCallback(() => dispatch(logoutAction()), [dispatch]);
  const clearError = useCallback(() => dispatch(clearAuthError()), [dispatch]);
  const clearMessage = useCallback(
    () => dispatch(clearAuthMessage()),
    [dispatch],
  );

  return {

    institution,
    token,
    isAuthenticated,
    loading,
    error,
    message,

    register,
    verifyEmail,
    login,
    loginWithGoogle,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    logout,
    clearError,
    clearMessage,
  };
}
