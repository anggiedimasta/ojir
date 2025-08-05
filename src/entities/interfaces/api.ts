import type { BaseEntity } from './common';

// API Response and Error Interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: Record<string, any>;
}

export interface ApiError {
  message: string;
  code: string;
  field?: string;
  details?: Record<string, unknown>;
}

// tRPC specific error response structure
export interface TRPCErrorResponse {
  message: string;
  code: string;
  data?: {
    code: string;
    httpStatus: number;
    stack?: string;
    path: string;
  };
}

// Common input interfaces for pagination and filtering
export interface PaginatedInput {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterInput {
  search?: string;
  status?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  tags?: string[];
}

// Date range input commonly used across modules
export interface DateRangeInput {
  startDate: Date;
  endDate: Date;
}

// User API Interfaces
export interface UserResponse extends BaseEntity {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}

export interface UserProfileResponse extends UserResponse {
  bio?: string;
  website?: string;
  location?: string;
  timezone: string;
  language: string;
  preferences: UserPreferencesResponse;
}

export interface UserPreferencesResponse {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showPhone: boolean;
  };
}

export interface UpdateUserInput {
  name?: string;
  bio?: string;
  website?: string;
  location?: string;
  timezone?: string;
  language?: string;
}

export interface UpdateUserPreferencesInput {
  theme?: 'light' | 'dark' | 'system';
  notifications?: Partial<UserPreferencesResponse['notifications']>;
  privacy?: Partial<UserPreferencesResponse['privacy']>;
}

export interface GetUsersInput extends PaginatedInput, FilterInput {
  role?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Organization API Interfaces
export interface OrganizationResponse extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  website?: string;
  logo?: string;
  industry?: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  type: 'corporation' | 'llc' | 'partnership' | 'nonprofit' | 'government' | 'other';
  isActive: boolean;
  memberCount?: number;
}

export interface TeamResponse extends BaseEntity {
  organizationId: string;
  departmentId?: string;
  name: string;
  description?: string;
  leaderId: string;
  memberCount: number;
  isActive: boolean;
}

export interface TeamMemberResponse {
  userId: string;
  teamId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
  permissions: string[];
  user: {
    id: string;
    name?: string;
    email: string;
    image?: string;
  };
}

export interface CreateOrganizationInput {
  name: string;
  slug: string;
  description?: string;
  website?: string;
  industry?: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  type: 'corporation' | 'llc' | 'partnership' | 'nonprofit' | 'government' | 'other';
}

export interface UpdateOrganizationInput {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  website?: string;
  logo?: string;
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  type?: 'corporation' | 'llc' | 'partnership' | 'nonprofit' | 'government' | 'other';
}

export interface CreateTeamInput {
  organizationId: string;
  departmentId?: string;
  name: string;
  description?: string;
  leaderId: string;
}

export interface UpdateTeamInput {
  id: string;
  name?: string;
  description?: string;
  leaderId?: string;
  departmentId?: string;
}

export interface AddTeamMemberInput {
  teamId: string;
  userId: string;
  role: 'admin' | 'member' | 'viewer';
  permissions?: string[];
}

export interface UpdateTeamMemberInput {
  teamId: string;
  userId: string;
  role?: 'admin' | 'member' | 'viewer';
  permissions?: string[];
}

export interface GetOrganizationsInput extends PaginatedInput, FilterInput {
  size?: string;
  type?: string;
  industry?: string;
}

export interface GetTeamsInput extends PaginatedInput, FilterInput {
  organizationId?: string;
  departmentId?: string;
  leaderId?: string;
}

// Project API Interfaces
export interface ProjectResponse extends BaseEntity {
  organizationId: string;
  name: string;
  description?: string;
  slug: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  visibility: 'public' | 'internal' | 'private';
  ownerId: string;
  teamId?: string;
  clientId?: string;
  progress?: number;
  taskCount?: number;
  completedTaskCount?: number;
}

export interface TaskResponse extends BaseEntity {
  projectId: string;
  milestoneId?: string;
  parentTaskId?: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'testing' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  reporterId: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  completedAt?: Date;
  tags: string[];
}

export interface MilestoneResponse {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  dueDate: Date;
  completedAt?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  taskCount: number;
  completedTaskCount: number;
  progress: number;
}

export interface CreateProjectInput {
  organizationId: string;
  name: string;
  description?: string;
  slug: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  visibility?: 'public' | 'internal' | 'private';
  teamId?: string;
  clientId?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
}

export interface UpdateProjectInput {
  id: string;
  name?: string;
  description?: string;
  status?: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  visibility?: 'public' | 'internal' | 'private';
  teamId?: string;
  clientId?: string;
  endDate?: Date;
  budget?: number;
}

export interface CreateTaskInput {
  projectId: string;
  milestoneId?: string;
  parentTaskId?: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  estimatedHours?: number;
  dueDate?: Date;
  tags?: string[];
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  status?: 'backlog' | 'todo' | 'in-progress' | 'review' | 'testing' | 'done' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  tags?: string[];
}

export interface CreateMilestoneInput {
  projectId: string;
  name: string;
  description?: string;
  dueDate: Date;
}

export interface GetProjectsInput extends PaginatedInput, FilterInput {
  organizationId?: string;
  ownerId?: string;
  teamId?: string;
  status?: string;
  priority?: string;
}

export interface GetTasksInput extends PaginatedInput, FilterInput {
  projectId?: string;
  milestoneId?: string;
  assigneeId?: string;
  reporterId?: string;
  status?: string;
  priority?: string;
  dueDateRange?: DateRangeInput;
}

// Customer API Interfaces
export interface CustomerResponse extends BaseEntity {
  organizationId: string;
  type: 'individual' | 'business' | 'enterprise';
  status: 'lead' | 'prospect' | 'active' | 'inactive' | 'churned';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  name: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  assignedTo?: string;
  lifetimeValue?: number;
  acquisitionCost?: number;
  lastContactedAt?: Date;
}

export interface ContactResponse extends BaseEntity {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  department?: string;
  isPrimary: boolean;
  notes?: string;
}

export interface CustomerInteractionResponse extends BaseEntity {
  customerId: string;
  userId: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'support' | 'sale' | 'follow-up' | 'other';
  channel: 'phone' | 'email' | 'in-person' | 'video-call' | 'chat' | 'social-media' | 'website';
  subject?: string;
  content: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  outcome?: string;
  followUpDate?: Date;
  duration?: number;
}

export interface CreateCustomerInput {
  organizationId: string;
  type: 'individual' | 'business' | 'enterprise';
  name: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  source?: {
    channel: string;
    medium?: string;
    campaign?: string;
    referrer?: string;
  };
}

export interface UpdateCustomerInput {
  id: string;
  type?: 'individual' | 'business' | 'enterprise';
  status?: 'lead' | 'prospect' | 'active' | 'inactive' | 'churned';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  assignedTo?: string;
  notes?: string;
}

export interface CreateContactInput {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  department?: string;
  isPrimary?: boolean;
  notes?: string;
}

export interface UpdateContactInput {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  title?: string;
  department?: string;
  isPrimary?: boolean;
  notes?: string;
}

export interface CreateInteractionInput {
  customerId: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'support' | 'sale' | 'follow-up' | 'other';
  channel: 'phone' | 'email' | 'in-person' | 'video-call' | 'chat' | 'social-media' | 'website';
  subject?: string;
  content: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  outcome?: string;
  followUpDate?: Date;
  duration?: number;
}

export interface GetCustomersInput extends PaginatedInput, FilterInput {
  organizationId?: string;
  type?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  industry?: string;
  contactedDateRange?: DateRangeInput;
}

export interface GetInteractionsInput extends PaginatedInput, FilterInput {
  customerId?: string;
  userId?: string;
  type?: string;
  channel?: string;
  sentiment?: string;
  dateRange?: DateRangeInput;
}

// Financial API Interfaces
export interface InvoiceResponse extends BaseEntity {
  organizationId: string;
  customerId: string;
  projectId?: string;
  number: string;
  status: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  type: 'standard' | 'recurring' | 'credit-note' | 'quote' | 'estimate';
  currency: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  issuedDate: Date;
  dueDate: Date;
  paidDate?: Date;
}

export interface PaymentResponse extends BaseEntity {
  invoiceId: string;
  amount: number;
  currency: string;
  method: 'credit-card' | 'debit-card' | 'bank-transfer' | 'paypal' | 'stripe' | 'cash' | 'check' | 'crypto' | 'other';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  reference?: string;
  gateway?: string;
  gatewayTransactionId?: string;
  processedAt: Date;
}

export interface ProductResponse extends BaseEntity {
  organizationId: string;
  name: string;
  description?: string;
  sku: string;
  category?: string;
  type: 'physical' | 'digital' | 'service' | 'subscription';
  status: 'active' | 'inactive' | 'discontinued' | 'coming-soon';
  price: number;
  currency: string;
  cost?: number;
  images: string[];
  tags: string[];
}

export interface OrderResponse extends BaseEntity {
  organizationId: string;
  customerId: string;
  number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  type: 'purchase' | 'subscription' | 'renewal' | 'upgrade';
  currency: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  total: number;
  itemCount: number;
  completedAt?: Date;
}

export interface CreateInvoiceInput {
  organizationId: string;
  customerId: string;
  projectId?: string;
  type?: 'standard' | 'recurring' | 'credit-note' | 'quote' | 'estimate';
  currency: string;
  dueDate: Date;
  description?: string;
  notes?: string;
  terms?: string;
  lineItems: {
    productId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    discountRate?: number;
  }[];
}

export interface UpdateInvoiceInput {
  id: string;
  status?: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  dueDate?: Date;
  description?: string;
  notes?: string;
  terms?: string;
}

export interface CreatePaymentInput {
  invoiceId: string;
  amount: number;
  method: 'credit-card' | 'debit-card' | 'bank-transfer' | 'paypal' | 'stripe' | 'cash' | 'check' | 'crypto' | 'other';
  reference?: string;
  gateway?: string;
  notes?: string;
}

export interface CreateProductInput {
  organizationId: string;
  name: string;
  description?: string;
  sku: string;
  category?: string;
  type: 'physical' | 'digital' | 'service' | 'subscription';
  price: number;
  currency: string;
  cost?: number;
  tags?: string[];
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'discontinued' | 'coming-soon';
  price?: number;
  cost?: number;
  tags?: string[];
}

export interface CreateOrderInput {
  organizationId: string;
  customerId: string;
  type?: 'purchase' | 'subscription' | 'renewal' | 'upgrade';
  currency: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }[];
  notes?: string;
}

export interface GetInvoicesInput extends PaginatedInput, FilterInput {
  organizationId?: string;
  customerId?: string;
  projectId?: string;
  status?: string;
  type?: string;
  issueDateRange?: DateRangeInput;
  dueDateRange?: DateRangeInput;
  amountRange?: {
    min?: number;
    max?: number;
  };
}

export interface GetPaymentsInput extends PaginatedInput, FilterInput {
  invoiceId?: string;
  method?: string;
  status?: string;
  dateRange?: DateRangeInput;
  amountRange?: {
    min?: number;
    max?: number;
  };
}

export interface GetProductsInput extends PaginatedInput, FilterInput {
  organizationId?: string;
  category?: string;
  type?: string;
  status?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
}

export interface GetOrdersInput extends PaginatedInput, FilterInput {
  organizationId?: string;
  customerId?: string;
  status?: string;
  type?: string;
  dateRange?: DateRangeInput;
  amountRange?: {
    min?: number;
    max?: number;
  };
}

// Integration API Interfaces
export interface IntegrationResponse extends BaseEntity {
  userId: string;
  organizationId?: string;
  provider: 'google' | 'microsoft' | 'slack' | 'discord' | 'zoom' | 'stripe' | 'paypal' | 'github' | 'gitlab' | 'jira' | 'asana' | 'trello' | 'notion' | 'airtable';
  providerId: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending' | 'expired';
  permissions: string[];
  lastSyncAt?: Date;
  errorCount: number;
  lastError?: string;
  isActive: boolean;
}

export interface WebhookResponse extends BaseEntity {
  url: string;
  events: string[];
  isActive: boolean;
  retryCount: number;
  maxRetries: number;
  lastTriggeredAt?: Date;
  lastSuccessAt?: Date;
  lastFailureAt?: Date;
  failureReason?: string;
  organizationId?: string;
  userId?: string;
}

export interface ApiKeyResponse extends BaseEntity {
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
}

export interface CreateIntegrationInput {
  provider: 'google' | 'microsoft' | 'slack' | 'discord' | 'zoom' | 'stripe' | 'paypal' | 'github' | 'gitlab' | 'jira' | 'asana' | 'trello' | 'notion' | 'airtable';
  name: string;
  configuration: Record<string, any>;
  permissions: string[];
  organizationId?: string;
}

export interface UpdateIntegrationInput {
  id: string;
  name?: string;
  configuration?: Record<string, any>;
  permissions?: string[];
  isActive?: boolean;
}

export interface SyncIntegrationInput {
  id: string;
  forceSync?: boolean;
  syncOptions?: Record<string, any>;
}

export interface CreateWebhookInput {
  url: string;
  events: string[];
  secret?: string;
  maxRetries?: number;
  headers?: Record<string, string>;
  organizationId?: string;
}

export interface UpdateWebhookInput {
  id: string;
  url?: string;
  events?: string[];
  isActive?: boolean;
  maxRetries?: number;
  headers?: Record<string, string>;
}

export interface TestWebhookInput {
  id: string;
  eventType: string;
  testData?: Record<string, any>;
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

export interface GetWebhooksInput extends PaginatedInput, FilterInput {
  isActive?: boolean;
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