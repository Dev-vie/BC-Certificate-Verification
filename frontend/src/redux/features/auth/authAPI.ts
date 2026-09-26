import axios from "axios";
import type {
  Institution,
  RegisterPayload,
  RegisterResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
  ResendCodePayload,
  MessageResponse,
  LoginPayload,
  LoginResponse,
  ForgotPasswordPayload,
  VerifyResetCodePayload,
  ResetPasswordPayload,
} from "./authTypes";
import { getApiBaseUrl } from "../../../lib/apiConfig";

const BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send/receive the httpOnly refreshToken cookie
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = api
      .post<{ token: string }>("/auth/refresh-token")
      .then((res) => {
        const newToken = res.data.token;
        localStorage.setItem("token", newToken);
        return newToken;
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthenticated");
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || "";

    const isPublicAuthRoute =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/verify-email") ||
      url.includes("/auth/forgot-password") ||
      url.includes("/auth/reset-password") ||
      url.includes("/auth/refresh-token");

    if (status === 401 && !originalRequest._retry && !isPublicAuthRoute) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }

      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (payload: RegisterPayload) =>
    api
      .post<RegisterResponse>("/auth/register", payload)
      .then((res) => res.data),

  verifyEmail: (payload: VerifyEmailPayload) =>
    api
      .post<VerifyEmailResponse>("/auth/verify-email", payload)
      .then((res) => res.data),

  resendCode: (payload: ResendCodePayload) =>
    api
      .post<MessageResponse>("/auth/resend-code", payload)
      .then((res) => res.data),

  login: (payload: LoginPayload) =>
    api.post<LoginResponse>("/auth/login", payload).then((res) => res.data),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    api
      .post<MessageResponse>("/auth/forgot-password", payload)
      .then((res) => res.data),

  verifyResetCode: (payload: VerifyResetCodePayload) =>
    api
      .post<MessageResponse>("/auth/verify-reset-code", payload)
      .then((res) => res.data),

  resetPassword: (payload: ResetPasswordPayload) =>
    api
      .post<MessageResponse>("/auth/reset-password", payload)
      .then((res) => res.data),

  getProfile: () =>
    api.get<{ institution: Institution }>("/auth/me").then((res) => res.data),

  updateProfile: (payload: { name?: string; email?: string; avatar?: string | null }) =>
    api.put<{ message: string; institution: Institution }>("/auth/profile", payload).then((res) => res.data),

  get2faStatus: () =>
    api.get<{ is2faEnabled: boolean }>("/auth/2fa/status").then((res) => res.data),

  setup2fa: () =>
    api.post<{ qrCodeUrl: string; secret: string; secretFormatted: string; is2faEnabled: boolean }>("/auth/2fa/setup").then((res) => res.data),

  enable2fa: (payload: { code: string; secret?: string }) =>
    api.post<{ message: string; is2faEnabled: boolean }>("/auth/2fa/enable", payload).then((res) => res.data),

  disable2fa: (payload: { code: string }) =>
    api.post<{ message: string; is2faEnabled: boolean }>("/auth/2fa/disable", payload).then((res) => res.data),
};

export { api };
export default authAPI;
