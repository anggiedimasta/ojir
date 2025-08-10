import type { BaseEntity } from "./common";

// NextAuth extensions - these are business logic types for authentication
export interface ExtendedSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  accessToken?: string;
  expires: string;
}

export interface ExtendedAccount {
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
  session_state?: string;
}

// Database entities that correspond to auth tables
export interface UserAccount extends BaseEntity {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

export interface UserSession extends BaseEntity {
  sessionToken: string;
  userId: string;
  expires: Date;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

// Authentication-related types
export interface AuthProvider {
  id: string;
  name: string;
  type: "oauth" | "credentials" | "email";
  isEnabled: boolean;
  configuration: Record<string, unknown>;
}

export interface LoginAttempt extends BaseEntity {
  userId?: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  provider: string;
  failureReason?: string;
  location?: {
    country: string;
    city: string;
    timezone: string;
  };
}

export interface SecurityEvent extends BaseEntity {
  userId: string;
  type: SecurityEventType;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  metadata: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export type SecurityEventType =
  | "login-failure"
  | "password-change"
  | "email-change"
  | "suspicious-activity"
  | "account-locked"
  | "token-refresh-failure";
