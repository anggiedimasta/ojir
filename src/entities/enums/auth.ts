// Auth enums

// Security event type enums
export enum SecurityEventType {
  LOGIN_FAILURE = 'login-failure',
  PASSWORD_CHANGE = 'password-change',
  EMAIL_CHANGE = 'email-change',
  SUSPICIOUS_ACTIVITY = 'suspicious-activity',
  ACCOUNT_LOCKED = 'account-locked',
  TOKEN_REFRESH_FAILURE = 'token-refresh-failure',
}

// Security event severity enums
export enum SecurityEventSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Auth provider type enums
export enum AuthProviderType {
  OAUTH = 'oauth',
  CREDENTIALS = 'credentials',
  EMAIL = 'email',
}

// User theme enums
export enum UserTheme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

// Profile visibility enums
export enum ProfileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS = 'friends',
}

// Two-factor authentication method enums
export enum TwoFactorMethod {
  APP = 'app',
  SMS = 'sms',
  EMAIL = 'email',
}

// OAuth provider enums
export enum OAuthProvider {
  GOOGLE = 'google',
  GITHUB = 'github',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  DISCORD = 'discord',
  SLACK = 'slack',
  MICROSOFT = 'microsoft',
  APPLE = 'apple',
  AMAZON = 'amazon',
}

// Permission action enums
export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  APPROVE = 'approve',
  REJECT = 'reject',
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
  ARCHIVE = 'archive',
  RESTORE = 'restore',
}

// Permission resource enums
export enum PermissionResource {
  USER = 'user',
  ROLE = 'role',
  PERMISSION = 'permission',
  WALLET = 'wallet',
  TRANSACTION = 'transaction',
  CALENDAR = 'calendar',
  EVENT = 'event',
  SETTING = 'setting',
  AUDIT_LOG = 'audit_log',
  SECURITY_EVENT = 'security_event',
}

// Role enums
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

// Session status enums
export enum SessionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  SUSPENDED = 'suspended',
}

// Token type enums
export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
  VERIFICATION = 'verification',
  RESET_PASSWORD = 'reset_password',
  INVITE = 'invite',
  API = 'api',
}

// Login provider enums
export enum LoginProvider {
  EMAIL_PASSWORD = 'email_password',
  GOOGLE = 'google',
  GITHUB = 'github',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  DISCORD = 'discord',
  SLACK = 'slack',
  MICROSOFT = 'microsoft',
  APPLE = 'apple',
  AMAZON = 'amazon',
}

// Account status enums
export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  LOCKED = 'locked',
  PENDING_VERIFICATION = 'pending_verification',
  PENDING_APPROVAL = 'pending_approval',
  DELETED = 'deleted',
}

// Email verification status enums
export enum EmailVerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

// Password strength enums
export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong',
  VERY_STRONG = 'very_strong',
}

// Authentication flow enums
export enum AuthFlow {
  LOGIN = 'login',
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgot_password',
  RESET_PASSWORD = 'reset_password',
  VERIFY_EMAIL = 'verify_email',
  TWO_FACTOR_SETUP = 'two_factor_setup',
  TWO_FACTOR_VERIFY = 'two_factor_verify',
  OAUTH_CALLBACK = 'oauth_callback',
  LOGOUT = 'logout',
}

// Notification type enums
export enum NotificationType {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  ACCOUNT_LOCKED = 'account_locked',
  SUSPICIOUS_LOGIN = 'suspicious_login',
  TWO_FACTOR_ENABLED = 'two_factor_enabled',
  TWO_FACTOR_DISABLED = 'two_factor_disabled',
  PASSWORD_CHANGED = 'password_changed',
  EMAIL_CHANGED = 'email_changed',
  ACCOUNT_DELETED = 'account_deleted',
  SESSION_EXPIRED = 'session_expired',
  SECURITY_ALERT = 'security_alert',
}

// User preference enums
export enum UserPreference {
  THEME = 'theme',
  LANGUAGE = 'language',
  TIMEZONE = 'timezone',
  CURRENCY = 'currency',
  NOTIFICATIONS = 'notifications',
  PRIVACY = 'privacy',
  SECURITY = 'security',
  ACCESSIBILITY = 'accessibility',
}

// Language enums
export enum Language {
  EN = 'en',
  ID = 'id',
  JA = 'ja',
  KO = 'ko',
  ZH = 'zh',
  ES = 'es',
  FR = 'fr',
  DE = 'de',
  IT = 'it',
  PT = 'pt',
  RU = 'ru',
  AR = 'ar',
  HI = 'hi',
  TH = 'th',
  VI = 'vi',
}

// Currency enums
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  IDR = 'IDR',
  SGD = 'SGD',
  MYR = 'MYR',
  THB = 'THB',
  PHP = 'PHP',
  VND = 'VND',
  KRW = 'KRW',
  CNY = 'CNY',
  INR = 'INR',
  AUD = 'AUD',
  CAD = 'CAD',
}

// Timezone enums
export enum Timezone {
  UTC = 'UTC',
  GMT = 'GMT',
  EST = 'EST',
  PST = 'PST',
  WIB = 'WIB', // Western Indonesian Time
  WITA = 'WITA', // Central Indonesian Time
  WIT = 'WIT', // Eastern Indonesian Time
  JST = 'JST', // Japan Standard Time
  KST = 'KST', // Korea Standard Time
  CST = 'CST', // China Standard Time
  IST = 'IST', // India Standard Time
  SGT = 'SGT', // Singapore Time
  MYT = 'MYT', // Malaysia Time
  PHT = 'PHT', // Philippines Time
  ICT = 'ICT', // Indochina Time
} 