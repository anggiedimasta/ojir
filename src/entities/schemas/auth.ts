// Auth Zod schemas for validation

import { z } from 'zod';

// Base schemas
export const SecurityEventTypeSchema = z.enum(['login-failure', 'password-change', 'email-change', 'suspicious-activity', 'account-locked', 'token-refresh-failure']);
export const SecurityEventSeveritySchema = z.enum(['low', 'medium', 'high', 'critical']);
export const AuthProviderTypeSchema = z.enum(['oauth', 'credentials', 'email']);
export const UserThemeSchema = z.enum(['light', 'dark', 'system']);
export const ProfileVisibilitySchema = z.enum(['public', 'private', 'friends']);
export const TwoFactorMethodSchema = z.enum(['app', 'sms', 'email']);
export const OAuthProviderSchema = z.enum(['google', 'github', 'facebook', 'twitter', 'linkedin', 'discord', 'slack', 'microsoft', 'apple', 'amazon']);

// User preferences schemas
export const NotificationPreferencesSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  sms: z.boolean(),
  marketing: z.boolean(),
  security: z.boolean(),
  transactions: z.boolean(),
  reminders: z.boolean(),
});

export const PrivacyPreferencesSchema = z.object({
  profileVisibility: ProfileVisibilitySchema,
  showEmail: z.boolean(),
  showPhone: z.boolean(),
  allowAnalytics: z.boolean(),
  allowMarketing: z.boolean(),
});

export const UserPreferencesSchema = z.object({
  theme: UserThemeSchema,
  language: z.string().min(2).max(5),
  timezone: z.string().min(1),
  currency: z.string().min(3).max(3),
  notifications: NotificationPreferencesSchema,
  privacy: PrivacyPreferencesSchema,
});

// User schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  emailVerified: z.date().nullable(),
  image: z.string().url().nullable(),
  isActive: z.boolean(),
  isEmailVerified: z.boolean(),
  lastLoginAt: z.date().optional(),
  loginCount: z.number().int().nonnegative(),
  failedLoginAttempts: z.number().int().nonnegative(),
  lockedUntil: z.date().optional(),
  preferences: UserPreferencesSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Auth provider schema
export const AuthProviderSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: AuthProviderTypeSchema,
  isEnabled: z.boolean(),
  configuration: z.record(z.any()),
});

// Login attempt schema
export const LoginAttemptSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().optional(),
  email: z.string().email(),
  ipAddress: z.string().ip(),
  userAgent: z.string().min(1),
  success: z.boolean(),
  provider: z.string().min(1),
  failureReason: z.string().optional(),
  location: z.object({
    country: z.string().min(2).max(2),
    city: z.string().min(1),
    timezone: z.string().min(1),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Security event schema
export const SecurityEventSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: SecurityEventTypeSchema,
  severity: SecurityEventSeveritySchema,
  description: z.string().min(1),
  metadata: z.record(z.any()),
  ipAddress: z.string().ip(),
  userAgent: z.string().min(1),
  resolved: z.boolean(),
  resolvedAt: z.date().optional(),
  resolvedBy: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Permission schema
export const PermissionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().min(1),
  resource: z.string().min(1),
  action: z.string().min(1),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Role schema
export const RoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().min(1),
  permissions: z.array(PermissionSchema),
  isActive: z.boolean(),
  isSystem: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// User role schema
export const UserRoleSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
  assignedAt: z.date(),
  assignedBy: z.string().uuid(),
  expiresAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Access token schema
export const AccessTokenSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  token: z.string().min(1),
  expiresAt: z.date(),
  isRevoked: z.boolean(),
  revokedAt: z.date().optional(),
  revokedBy: z.string().uuid().optional(),
  ipAddress: z.string().ip(),
  userAgent: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Refresh token schema
export const RefreshTokenSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  token: z.string().min(1),
  expiresAt: z.date(),
  isRevoked: z.boolean(),
  revokedAt: z.date().optional(),
  revokedBy: z.string().uuid().optional(),
  accessTokenId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Session data schema
export const SessionDataSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  sessionToken: z.string().min(1),
  expires: z.date(),
  isActive: z.boolean(),
  ipAddress: z.string().ip(),
  userAgent: z.string().min(1),
  lastActivity: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// OAuth provider schema
export const OAuthProviderSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  displayName: z.string().min(1),
  icon: z.string().min(1),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  isEnabled: z.boolean(),
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  scopes: z.array(z.string().min(1)),
  authorizationUrl: z.string().url(),
  tokenUrl: z.string().url(),
  userInfoUrl: z.string().url(),
  profileMapping: z.record(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// OAuth profile schema
export const OAuthProfileSchema = z.object({
  provider: z.string().min(1),
  providerId: z.string().min(1),
  email: z.string().email(),
  name: z.string().optional(),
  image: z.string().url().optional(),
  profile: z.record(z.any()),
});

// Two-factor method schema
export const TwoFactorMethodSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: TwoFactorMethodSchema,
  identifier: z.string().min(1),
  isEnabled: z.boolean(),
  isVerified: z.boolean(),
  verifiedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Two-factor backup code schema
export const TwoFactorBackupCodeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  code: z.string().length(10),
  isUsed: z.boolean(),
  usedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input schemas
export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
  twoFactorCode: z.string().length(6).optional(),
});

export const RegisterInputSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  }),
  confirmPassword: z.string().min(8),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  marketingConsent: z.boolean().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const ForgotPasswordInputSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordInputSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  }),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const ChangePasswordInputSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  }),
  confirmPassword: z.string().min(8),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const UpdateProfileInputSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  image: z.string().url().optional(),
  preferences: UserPreferencesSchema.partial().optional(),
});

export const VerifyEmailInputSchema = z.object({
  token: z.string().min(1),
});

export const TwoFactorSetupInputSchema = z.object({
  method: TwoFactorMethodSchema,
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/).optional(),
  email: z.string().email().optional(),
}).refine(data => {
  if (data.method === 'sms' && !data.phoneNumber) {
    return false;
  }
  if (data.method === 'email' && !data.email) {
    return false;
  }
  return true;
}, {
  message: 'Phone number is required for SMS method, email is required for email method',
});

export const TwoFactorVerifyInputSchema = z.object({
  code: z.string().length(6),
  method: TwoFactorMethodSchema,
});

// Response schemas
export const AuthResponseSchema = z.object({
  success: z.boolean(),
  user: UserSchema.optional(),
  session: z.object({
    user: z.object({
      id: z.string(),
      name: z.string().nullable(),
      email: z.string().nullable(),
      image: z.string().nullable(),
    }),
    accessToken: z.string().optional(),
    expires: z.string(),
  }).optional(),
  message: z.string().optional(),
  errors: z.record(z.array(z.string())).optional(),
});

export const LoginResponseSchema = AuthResponseSchema.extend({
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  requiresTwoFactor: z.boolean().optional(),
  twoFactorMethod: z.string().optional(),
});

export const RegisterResponseSchema = AuthResponseSchema.extend({
  requiresEmailVerification: z.boolean().optional(),
});

export const PasswordResetResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  emailSent: z.boolean().optional(),
});

// Database entity schemas
export const UserAccountSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.string().min(1),
  provider: z.string().min(1),
  providerAccountId: z.string().min(1),
  refresh_token: z.string().optional(),
  access_token: z.string().optional(),
  expires_at: z.number().int().optional(),
  token_type: z.string().optional(),
  scope: z.string().optional(),
  id_token: z.string().optional(),
  session_state: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserSessionSchema = z.object({
  id: z.string().uuid(),
  sessionToken: z.string().min(1),
  userId: z.string().uuid(),
  expires: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const VerificationTokenSchema = z.object({
  identifier: z.string().min(1),
  token: z.string().min(1),
  expires: z.date(),
}); 