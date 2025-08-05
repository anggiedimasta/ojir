// API Response and Error Enums
export enum ApiStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  PENDING = 'pending',
  LOADING = 'loading'
}

export enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

// User API Enums
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  GUEST = 'guest'
}

export enum UserTheme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export enum ProfileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS = 'friends'
}

// Organization API Enums
export enum OrganizationSize {
  STARTUP = 'startup',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise'
}

export enum OrganizationType {
  CORPORATION = 'corporation',
  LLC = 'llc',
  PARTNERSHIP = 'partnership',
  NONPROFIT = 'nonprofit',
  GOVERNMENT = 'government',
  OTHER = 'other'
}

export enum TeamRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer'
}

// Project API Enums
export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on-hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ARCHIVED = 'archived'
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum ProjectVisibility {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  PRIVATE = 'private'
}

export enum TaskStatus {
  BACKLOG = 'backlog',
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  REVIEW = 'review',
  TESTING = 'testing',
  DONE = 'done',
  CANCELLED = 'cancelled'
}

export enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue'
}

// Customer API Enums
export enum CustomerType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
  ENTERPRISE = 'enterprise'
}

export enum CustomerStatus {
  LEAD = 'lead',
  PROSPECT = 'prospect',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CHURNED = 'churned'
}

export enum InteractionType {
  CALL = 'call',
  EMAIL = 'email',
  MEETING = 'meeting',
  DEMO = 'demo',
  SUPPORT = 'support',
  SALE = 'sale',
  FOLLOW_UP = 'follow-up',
  OTHER = 'other'
}

export enum InteractionChannel {
  PHONE = 'phone',
  EMAIL = 'email',
  IN_PERSON = 'in-person',
  VIDEO_CALL = 'video-call',
  CHAT = 'chat',
  SOCIAL_MEDIA = 'social-media',
  WEBSITE = 'website'
}

export enum Sentiment {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative'
}

// Financial API Enums
export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum InvoiceType {
  STANDARD = 'standard',
  RECURRING = 'recurring',
  CREDIT_NOTE = 'credit-note',
  QUOTE = 'quote',
  ESTIMATE = 'estimate'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit-card',
  DEBIT_CARD = 'debit-card',
  BANK_TRANSFER = 'bank-transfer',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  CASH = 'cash',
  CHECK = 'check',
  CRYPTO = 'crypto',
  OTHER = 'other'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service',
  SUBSCRIPTION = 'subscription'
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
  COMING_SOON = 'coming-soon'
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum OrderType {
  PURCHASE = 'purchase',
  SUBSCRIPTION = 'subscription',
  RENEWAL = 'renewal',
  UPGRADE = 'upgrade'
}

// Integration API Enums
export enum IntegrationProvider {
  GOOGLE = 'google',
  MICROSOFT = 'microsoft',
  SLACK = 'slack',
  DISCORD = 'discord',
  ZOOM = 'zoom',
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  GITHUB = 'github',
  GITLAB = 'gitlab',
  JIRA = 'jira',
  ASANA = 'asana',
  TRELLO = 'trello',
  NOTION = 'notion',
  AIRTABLE = 'airtable'
}

export enum IntegrationStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  PENDING = 'pending',
  EXPIRED = 'expired'
}

export enum WebhookStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error'
}

export enum ApiKeyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  REVOKED = 'revoked'
}