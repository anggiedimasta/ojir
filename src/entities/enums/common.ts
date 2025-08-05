// Common enums used across multiple entities

// Status enums
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

// Priority enums
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Sort order enums
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

// Notification type enums
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  REMINDER = 'reminder',
  INVITATION = 'invitation',
  UPDATE = 'update',
}

// Form field type enums
export enum FormFieldType {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
  NUMBER = 'number',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
}

// Button variant enums
export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  OUTLINE = 'outline',
  GHOST = 'ghost',
  DESTRUCTIVE = 'destructive',
}

// Button size enums
export enum ButtonSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

// Input size enums
export enum InputSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
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
}

// File type enums
export enum FileType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  ARCHIVE = 'archive',
  OTHER = 'other',
}

// Permission enums
export enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin',
}

// Role enums
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  GUEST = 'guest',
} 