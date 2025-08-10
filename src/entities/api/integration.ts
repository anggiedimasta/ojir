import type { FilterInput, PaginatedInput } from "./common";

// Integration API Response types
export interface IntegrationResponse {
  id: string;
  userId: string;
  organizationId?: string;
  provider:
    | "google"
    | "microsoft"
    | "slack"
    | "discord"
    | "zoom"
    | "stripe"
    | "paypal"
    | "github"
    | "gitlab"
    | "jira"
    | "asana"
    | "trello"
    | "notion"
    | "airtable";
  providerId: string;
  name: string;
  status: "connected" | "disconnected" | "error" | "pending" | "expired";
  permissions: string[];
  lastSyncAt?: Date;
  errorCount: number;
  lastError?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKeyResponse {
  id: string;
  name: string;
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
  createdAt: Date;
  updatedAt: Date;
}

// Integration API Input types
export interface CreateIntegrationInput {
  provider:
    | "google"
    | "microsoft"
    | "slack"
    | "discord"
    | "zoom"
    | "stripe"
    | "paypal"
    | "github"
    | "gitlab"
    | "jira"
    | "asana"
    | "trello"
    | "notion"
    | "airtable";
  name: string;
  configuration: Record<string, unknown>;
  permissions: string[];
  organizationId?: string;
}

export interface UpdateIntegrationInput {
  id: string;
  name?: string;
  configuration?: Record<string, unknown>;
  permissions?: string[];
  isActive?: boolean;
}

export interface SyncIntegrationInput {
  id: string;
  forceSync?: boolean;
  syncOptions?: Record<string, unknown>;
}

export interface CreateApiKeyInput {
  name: string;
  permissions: string[];
  organizationId?: string;
  expiresAt?: Date;
  rateLimit?: number;
  rateLimitWindow?: number;
  allowedIPs?: string[];
  allowedDomains?: string[];
}

export interface UpdateApiKeyInput {
  id: string;
  name?: string;
  permissions?: string[];
  isActive?: boolean;
  expiresAt?: Date;
  rateLimit?: number;
  rateLimitWindow?: number;
  allowedIPs?: string[];
  allowedDomains?: string[];
}

export interface RevokeApiKeyInput {
  id: string;
  reason?: string;
}

export interface GetIntegrationsInput extends PaginatedInput, FilterInput {
  provider?: string;
  status?: string;
  organizationId?: string;
  userId?: string;
}

export interface GetApiKeysInput extends PaginatedInput, FilterInput {
  isActive?: boolean;
  organizationId?: string;
  userId?: string;
  expiresWithin?: number; // days
}

// OAuth specific inputs for integrations (renamed to avoid conflicts with auth module)
export interface IntegrationOAuthConnectInput {
  provider: string;
  redirectUri: string;
  scopes?: string[];
  state?: string;
}

export interface IntegrationOAuthCallbackInput {
  provider: string;
  code: string;
  state?: string;
}

export interface IntegrationOAuthRefreshInput {
  integrationId: string;
}
