// Auth types

// NextAuth extensions - business logic types for authentication
export type ExtendedSession = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  accessToken?: string;
  expires: string;
};

export type ExtendedAccount = {
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
  session_state?: string;
};

// Authentication-related types
export type AuthProvider = {
  id: string;
  name: string;
  type: 'oauth' | 'credentials' | 'email';
  isEnabled: boolean;
  configuration: Record<string, any>;
};

export type LoginAttempt = {
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
};

export type SecurityEvent = {
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
};

export type SecurityEventType =
  | 'login-failure'
  | 'password-change'
  | 'email-change'
  | 'suspicious-activity'
  | 'account-locked'
  | 'token-refresh-failure';

// User types
export type User = {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
};

export type UserPreferences = {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  currency: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
};

export type NotificationPreferences = {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
  security: boolean;
  transactions: boolean;
  reminders: boolean;
};

export type PrivacyPreferences = {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  allowAnalytics: boolean;
  allowMarketing: boolean;
};

// Permission and role types
export type Permission = {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  isActive: boolean;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
  isSystem: boolean;
};

export type UserRole = {
  userId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy: string;
  expiresAt?: Date;
};

// Token types
export type AccessToken = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  revokedAt?: Date;
  revokedBy?: string;
  ipAddress: string;
  userAgent: string;
};

export type RefreshToken = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  revokedAt?: Date;
  revokedBy?: string;
  accessTokenId: string;
};

// Input types
export type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  marketingConsent?: boolean;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type UpdateProfileInput = {
  name?: string;
  email?: string;
  image?: string;
  preferences?: Partial<UserPreferences>;
};

export type VerifyEmailInput = {
  token: string;
};

export type TwoFactorSetupInput = {
  method: 'app' | 'sms' | 'email';
  phoneNumber?: string;
  email?: string;
};

export type TwoFactorVerifyInput = {
  code: string;
  method: 'app' | 'sms' | 'email';
};

// Response types
export type AuthResponse = {
  success: boolean;
  user?: User;
  session?: ExtendedSession;
  message?: string;
  errors?: Record<string, string[]>;
};

export type LoginResponse = AuthResponse & {
  accessToken?: string;
  refreshToken?: string;
  requiresTwoFactor?: boolean;
  twoFactorMethod?: string;
};

export type RegisterResponse = AuthResponse & {
  requiresEmailVerification?: boolean;
};

export type PasswordResetResponse = {
  success: boolean;
  message: string;
  emailSent?: boolean;
};

// Session types
export type SessionData = {
  id: string;
  userId: string;
  sessionToken: string;
  expires: Date;
  isActive: boolean;
  ipAddress: string;
  userAgent: string;
  lastActivity: Date;
};

// OAuth types
export type OAuthProvider = {
  id: string;
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
};

export type OAuthProfile = {
  provider: string;
  providerId: string;
  email: string;
  name?: string;
  image?: string;
  profile: Record<string, any>;
};

// Two-factor authentication types
export type TwoFactorMethod = {
  id: string;
  userId: string;
  type: 'app' | 'sms' | 'email';
  identifier: string;
  isEnabled: boolean;
  isVerified: boolean;
  createdAt: Date;
  verifiedAt?: Date;
};

export type TwoFactorBackupCode = {
  id: string;
  userId: string;
  code: string;
  isUsed: boolean;
  usedAt?: Date;
  createdAt: Date;
};