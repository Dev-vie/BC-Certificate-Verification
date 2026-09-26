export interface Institution {
  id: string | number;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface VerifyEmailResponse {
  message: string;
  token: string;
  institution: Institution;
}
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface ResendCodePayload {
  email: string;
}
export interface ResendCodeResponse {
  message: string;
}
export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyResetCodePayload {
  email: string;
  code: string;
}

export interface ResetPasswordPayload {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  message: string;
  institution: Institution;
}

export interface MessageResponse {
  message: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  institution: Institution;
}

export interface AuthState {
  institution: Institution | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  message: string | null;
}
