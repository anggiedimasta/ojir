import type { UserResponse } from "./user";

// Auth API Response types
export interface SessionResponse {
  user: UserResponse;
  accessToken?: string;
  expires: string;
}

export interface LoginResponse {
  session: SessionResponse;
  redirectTo?: string;
}

export interface AuthProviderResponse {
  id: string;
  name: string;
  type: "oauth" | "credentials" | "email";
  isEnabled: boolean;
  authUrl?: string;
}

// Auth API Input types
export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailInput {
  token: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

// OAuth specific inputs
export interface OAuthCallbackInput {
  provider: string;
  code: string;
  state?: string;
  redirectTo?: string;
}

export interface ConnectOAuthInput {
  provider: string;
  redirectTo?: string;
}

export interface DisconnectOAuthInput {
  provider: string;
}
