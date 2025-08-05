// Auth interfaces

import type { BaseEntity } from './common';

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

// Authentication-related interfaces
export interface AuthProvider {
  id: string;
  name: string;
  type: 'oauth' | 'credentials' | 'email';
  isEnabled: boolean;
  configuration: Record<string, any>;
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
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export type SecurityEventType =
  | 'login-failure'
  | 'password-change'
  | 'email-change'
  | 'suspicious-activity'
  | 'account-locked'
  | 'token-refresh-failure';

// User interfaces
export interface User extends BaseEntity {
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  loginCount: number;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  currency: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
  security: boolean;
  transactions: boolean;
  reminders: boolean;
}

export interface PrivacyPreferences {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  allowAnalytics: boolean;
  allowMarketing: boolean;
}

// Permission and role interfaces
export interface Permission extends BaseEntity {
  name: string;
  description: string;
  resource: string;
  action: string;
  isActive: boolean;
}

export interface Role extends BaseEntity {
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
  isSystem: boolean;
}

export interface UserRole extends BaseEntity {
  userId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy: string;
  expiresAt?: Date;
}

// Token interfaces
export interface AccessToken extends BaseEntity {
  userId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  revokedAt?: Date;
  revokedBy?: string;
  ipAddress: string;
  userAgent: string;
}

export interface RefreshToken extends BaseEntity {
  userId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  revokedAt?: Date;
  revokedBy?: string;
  accessTokenId: string;
}

// Session interfaces
export interface SessionData extends BaseEntity {
  userId: string;
  sessionToken: string;
  expires: Date;
  isActive: boolean;
  ipAddress: string;
  userAgent: string;
  lastActivity: Date;
}

// OAuth interfaces
export interface OAuthProvider extends BaseEntity {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  isEnabled: boolean;
  clientId: string;
  clientSecret: string;
  scopes: string[];
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  profileMapping: Record<string, string>;
}

export interface OAuthProfile {
  provider: string;
  providerId: string;
  email: string;
  name?: string;
  image?: string;
  profile: Record<string, any>;
}

// Two-factor authentication interfaces
export interface TwoFactorMethod extends BaseEntity {
  userId: string;
  type: 'app' | 'sms' | 'email';
  identifier: string;
  isEnabled: boolean;
  isVerified: boolean;
  verifiedAt?: Date;
}

export interface TwoFactorBackupCode extends BaseEntity {
  userId: string;
  code: string;
  isUsed: boolean;
  usedAt?: Date;
}

// Component prop interfaces
export interface LoginFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
    rememberMe?: boolean;
    twoFactorCode?: string;
  }) => void;
  isLoading?: boolean;
  error?: string;
  requiresTwoFactor?: boolean;
  twoFactorMethod?: string;
}

export interface RegisterFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
    marketingConsent?: boolean;
  }) => void;
  isLoading?: boolean;
  error?: string;
}

export interface ForgotPasswordFormProps {
  onSubmit: (data: { email: string }) => void;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
}

export interface ResetPasswordFormProps {
  onSubmit: (data: {
    token: string;
    password: string;
    confirmPassword: string;
  }) => void;
  isLoading?: boolean;
  error?: string;
  token: string;
}

export interface ChangePasswordFormProps {
  onSubmit: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
  isLoading?: boolean;
  error?: string;
}

export interface ProfileFormProps {
  user: User;
  onSubmit: (data: {
    name?: string;
    email?: string;
    image?: string;
    preferences?: Partial<UserPreferences>;
  }) => void;
  isLoading?: boolean;
  error?: string;
}

export interface TwoFactorSetupFormProps {
  onSubmit: (data: {
    method: 'app' | 'sms' | 'email';
    phoneNumber?: string;
    email?: string;
  }) => void;
  isLoading?: boolean;
  error?: string;
  onCancel: () => void;
}

export interface TwoFactorVerifyFormProps {
  onSubmit: (data: {
    code: string;
    method: 'app' | 'sms' | 'email';
  }) => void;
  isLoading?: boolean;
  error?: string;
  method: 'app' | 'sms' | 'email';
  onCancel: () => void;
}

export interface OAuthButtonProps {
  provider: OAuthProvider;
  onLogin: (provider: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export interface SecuritySettingsProps {
  user: User;
  twoFactorMethods: TwoFactorMethod[];
  backupCodes: TwoFactorBackupCode[];
  onEnableTwoFactor: (method: 'app' | 'sms' | 'email') => void;
  onDisableTwoFactor: (methodId: string) => void;
  onGenerateBackupCodes: () => void;
  isLoading?: boolean;
}

export interface UserProfileProps {
  user: User;
  onUpdateProfile: (data: {
    name?: string;
    email?: string;
    image?: string;
    preferences?: Partial<UserPreferences>;
  }) => void;
  onDeleteAccount: () => void;
  isLoading?: boolean;
}

export interface SessionListProps {
  sessions: SessionData[];
  currentSessionId: string;
  onRevokeSession: (sessionId: string) => void;
  onRevokeAllSessions: () => void;
  isLoading?: boolean;
}

export interface SecurityLogProps {
  securityEvents: SecurityEvent[];
  onResolveEvent: (eventId: string) => void;
  isLoading?: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
} 