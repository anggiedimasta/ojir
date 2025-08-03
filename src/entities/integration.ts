import type { BaseEntity } from './common';

// Google Calendar Integration
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  status?: 'confirmed' | 'tentative' | 'cancelled';
  location?: string;
  attendees?: GoogleCalendarAttendee[];
  creator?: GoogleCalendarPerson;
  organizer?: GoogleCalendarPerson;
  htmlLink?: string;
  iCalUID?: string;
  sequence?: number;
  reminders?: GoogleCalendarReminders;
  visibility?: 'default' | 'public' | 'private' | 'confidential';
}

export interface GoogleCalendarAttendee {
  email: string;
  displayName?: string;
  responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  optional?: boolean;
  organizer?: boolean;
  self?: boolean;
}

export interface GoogleCalendarPerson {
  email: string;
  displayName?: string;
  self?: boolean;
}

export interface GoogleCalendarReminders {
  useDefault: boolean;
  overrides?: Array<{
    method: 'email' | 'popup';
    minutes: number;
  }>;
}

// External Integration Base
export interface ExternalIntegration extends BaseEntity {
  userId: string;
  organizationId?: string;
  provider: IntegrationProvider;
  providerId: string;
  name: string;
  status: IntegrationStatus;
  configuration: Record<string, any>;
  credentials: IntegrationCredentials;
  permissions: string[];
  lastSyncAt?: Date;
  errorCount: number;
  lastError?: string;
  isActive: boolean;
}

export type IntegrationProvider =
  | 'google'
  | 'microsoft'
  | 'slack'
  | 'discord'
  | 'zoom'
  | 'stripe'
  | 'paypal'
  | 'github'
  | 'gitlab'
  | 'jira'
  | 'asana'
  | 'trello'
  | 'notion'
  | 'airtable';

export type IntegrationStatus =
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'pending'
  | 'expired';

export interface IntegrationCredentials {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  tokenType?: string;
  scope?: string[];
  additionalData?: Record<string, any>;
}

// Webhook Management
export interface Webhook extends BaseEntity {
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  retryCount: number;
  maxRetries: number;
  lastTriggeredAt?: Date;
  lastSuccessAt?: Date;
  lastFailureAt?: Date;
  failureReason?: string;
  headers?: Record<string, string>;
  organizationId?: string;
  userId?: string;
}

export interface WebhookDelivery extends BaseEntity {
  webhookId: string;
  eventType: string;
  payload: Record<string, any>;
  status: WebhookDeliveryStatus;
  httpStatus?: number;
  responseBody?: string;
  errorMessage?: string;
  attempts: number;
  nextRetryAt?: Date;
  deliveredAt?: Date;
}

export type WebhookDeliveryStatus =
  | 'pending'
  | 'delivered'
  | 'failed'
  | 'retrying'
  | 'cancelled';

// API Keys and Access Management
export interface ApiKey extends BaseEntity {
  name: string;
  key: string;
  keyPrefix: string;
  userId: string;
  organizationId?: string;
  permissions: string[];
  isActive: boolean;
  expiresAt?: Date;
  lastUsedAt?: Date;
  usageCount: number;
  rateLimit?: number;
  rateLimitWindow?: number;
  allowedIPs?: string[];
  allowedDomains?: string[];
}

export interface ApiKeyUsage extends BaseEntity {
  apiKeyId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  ipAddress: string;
  userAgent: string;
  requestSize: number;
  responseSize: number;
  timestamp: Date;
}