// API Response and Error Types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: Record<string, any>;
};

export type ApiError = {
  message: string;
  code: string;
  field?: string;
  details?: Record<string, unknown>;
};

// tRPC specific error response structure
export type TRPCErrorResponse = {
  message: string;
  code: string;
  data?: {
    code: string;
    httpStatus: number;
    stack?: string;
    path: string;
  };
};

// Common input types for pagination and filtering
export type PaginatedInput = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type FilterInput = {
  search?: string;
  status?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  tags?: string[];
};

// Date range input commonly used across modules
export type DateRangeInput = {
  startDate: Date;
  endDate: Date;
};

// User API Types
export type UserResponse = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserProfileResponse = UserResponse & {
  bio?: string;
  website?: string;
  location?: string;
  timezone: string;
  language: string;
  preferences: UserPreferencesResponse;
};

export type UserPreferencesResponse = {
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
};

export type UpdateUserInput = {
  name?: string;
  bio?: string;
  website?: string;
  location?: string;
  timezone?: string;
  language?: string;
};

export type UpdateUserPreferencesInput = {
  theme?: 'light' | 'dark' | 'system';
  notifications?: Partial<UserPreferencesResponse['notifications']>;
  privacy?: Partial<UserPreferencesResponse['privacy']>;
};

export type GetUsersInput = PaginatedInput & FilterInput & {
  role?: string;
  status?: 'active' | 'inactive' | 'suspended';
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// Organization API Types
export type OrganizationResponse = {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
};

export type TeamResponse = {
  id: string;
  organizationId: string;
  departmentId?: string;
  name: string;
  description?: string;
  leaderId: string;
  memberCount: number;
  isActive: boolean;
  createdAt: Date;
};

export type TeamMemberResponse = {
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
};

export type CreateOrganizationInput = {
  name: string;
  slug: string;
  description?: string;
  website?: string;
  industry?: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  type: 'corporation' | 'llc' | 'partnership' | 'nonprofit' | 'government' | 'other';
};

export type UpdateOrganizationInput = {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  website?: string;
  logo?: string;
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  type?: 'corporation' | 'llc' | 'partnership' | 'nonprofit' | 'government' | 'other';
};

export type CreateTeamInput = {
  organizationId: string;
  departmentId?: string;
  name: string;
  description?: string;
  leaderId: string;
};

export type UpdateTeamInput = {
  id: string;
  name?: string;
  description?: string;
  leaderId?: string;
  departmentId?: string;
};

export type AddTeamMemberInput = {
  teamId: string;
  userId: string;
  role: 'admin' | 'member' | 'viewer';
  permissions?: string[];
};

export type UpdateTeamMemberInput = {
  teamId: string;
  userId: string;
  role?: 'admin' | 'member' | 'viewer';
  permissions?: string[];
};

export type GetOrganizationsInput = PaginatedInput & FilterInput & {
  size?: string;
  type?: string;
  industry?: string;
};

export type GetTeamsInput = PaginatedInput & FilterInput & {
  organizationId?: string;
  departmentId?: string;
  leaderId?: string;
};

// Project API Types
export type ProjectResponse = {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
};

export type TaskResponse = {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
};

export type MilestoneResponse = {
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
};

export type CreateProjectInput = {
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
};

export type UpdateProjectInput = {
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
};

export type CreateTaskInput = {
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
};

export type UpdateTaskInput = {
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
};

export type CreateMilestoneInput = {
  projectId: string;
  name: string;
  description?: string;
  dueDate: Date;
};

export type GetProjectsInput = PaginatedInput & FilterInput & {
  organizationId?: string;
  ownerId?: string;
  teamId?: string;
  status?: string;
  priority?: string;
};

export type GetTasksInput = PaginatedInput & FilterInput & {
  projectId?: string;
  milestoneId?: string;
  assigneeId?: string;
  reporterId?: string;
  status?: string;
  priority?: string;
  dueDateRange?: DateRangeInput;
};

// Customer API Types
export type CustomerResponse = {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
};

export type ContactResponse = {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  department?: string;
  isPrimary: boolean;
  notes?: string;
  createdAt: Date;
};

export type CustomerInteractionResponse = {
  id: string;
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
  createdAt: Date;
};

export type CreateCustomerInput = {
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
};

export type UpdateCustomerInput = {
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
};

export type CreateContactInput = {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  department?: string;
  isPrimary?: boolean;
  notes?: string;
};

export type UpdateContactInput = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  title?: string;
  department?: string;
  isPrimary?: boolean;
  notes?: string;
};

export type CreateInteractionInput = {
  customerId: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'support' | 'sale' | 'follow-up' | 'other';
  channel: 'phone' | 'email' | 'in-person' | 'video-call' | 'chat' | 'social-media' | 'website';
  subject?: string;
  content: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  outcome?: string;
  followUpDate?: Date;
  duration?: number;
};

export type GetCustomersInput = PaginatedInput & FilterInput & {
  organizationId?: string;
  type?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  industry?: string;
  contactedDateRange?: DateRangeInput;
};

export type GetInteractionsInput = PaginatedInput & FilterInput & {
  customerId?: string;
  userId?: string;
  type?: string;
  channel?: string;
  sentiment?: string;
  dateRange?: DateRangeInput;
};

// Financial API Types
export type InvoiceResponse = {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
};

export type PaymentResponse = {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: 'credit-card' | 'debit-card' | 'bank-transfer' | 'paypal' | 'stripe' | 'cash' | 'check' | 'crypto' | 'other';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  reference?: string;
  gateway?: string;
  gatewayTransactionId?: string;
  processedAt: Date;
  createdAt: Date;
};

export type ProductResponse = {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
};

export type OrderResponse = {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
};

export type CreateInvoiceInput = {
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
};

export type UpdateInvoiceInput = {
  id: string;
  status?: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  dueDate?: Date;
  description?: string;
  notes?: string;
  terms?: string;
};

export type CreatePaymentInput = {
  invoiceId: string;
  amount: number;
  method: 'credit-card' | 'debit-card' | 'bank-transfer' | 'paypal' | 'stripe' | 'cash' | 'check' | 'crypto' | 'other';
  reference?: string;
  gateway?: string;
  notes?: string;
};

export type CreateProductInput = {
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
};

export type UpdateProductInput = {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'discontinued' | 'coming-soon';
  price?: number;
  cost?: number;
  tags?: string[];
};

export type CreateOrderInput = {
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
};

export type GetInvoicesInput = PaginatedInput & FilterInput & {
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
};

export type GetPaymentsInput = PaginatedInput & FilterInput & {
  invoiceId?: string;
  method?: string;
  status?: string;
  dateRange?: DateRangeInput;
  amountRange?: {
    min?: number;
    max?: number;
  };
};

export type GetProductsInput = PaginatedInput & FilterInput & {
  organizationId?: string;
  category?: string;
  type?: string;
  status?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
};

export type GetOrdersInput = PaginatedInput & FilterInput & {
  organizationId?: string;
  customerId?: string;
  status?: string;
  type?: string;
  dateRange?: DateRangeInput;
  amountRange?: {
    min?: number;
    max?: number;
  };
};

// Integration API Types
export type IntegrationResponse = {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
};

export type WebhookResponse = {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
};

export type ApiKeyResponse = {
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
};

export type CreateIntegrationInput = {
  provider: 'google' | 'microsoft' | 'slack' | 'discord' | 'zoom' | 'stripe' | 'paypal' | 'github' | 'gitlab' | 'jira' | 'asana' | 'trello' | 'notion' | 'airtable';
  name: string;
  configuration: Record<string, any>;
  permissions: string[];
  organizationId?: string;
};

export type UpdateIntegrationInput = {
  id: string;
  name?: string;
  configuration?: Record<string, any>;
  permissions?: string[];
  isActive?: boolean;
};

export type SyncIntegrationInput = {
  id: string;
  forceSync?: boolean;
  syncOptions?: Record<string, any>;
};

export type CreateWebhookInput = {
  url: string;
  events: string[];
  secret?: string;
  maxRetries?: number;
  headers?: Record<string, string>;
  organizationId?: string;
};

export type UpdateWebhookInput = {
  id: string;
  url?: string;
  events?: string[];
  isActive?: boolean;
  maxRetries?: number;
  headers?: Record<string, string>;
};

export type TestWebhookInput = {
  id: string;
  eventType: string;
  testData?: Record<string, any>;
};

export type CreateApiKeyInput = {
  name: string;
  permissions: string[];
  organizationId?: string;
  expiresAt?: Date;
  rateLimit?: number;
  rateLimitWindow?: number;
  allowedIPs?: string[];
  allowedDomains?: string[];
};

export type UpdateApiKeyInput = {
  id: string;
  name?: string;
  permissions?: string[];
  isActive?: boolean;
  expiresAt?: Date;
  rateLimit?: number;
  rateLimitWindow?: number;
  allowedIPs?: string[];
  allowedDomains?: string[];
};

export type RevokeApiKeyInput = {
  id: string;
  reason?: string;
};

export type GetIntegrationsInput = PaginatedInput & FilterInput & {
  provider?: string;
  status?: string;
  organizationId?: string;
  userId?: string;
};

export type GetWebhooksInput = PaginatedInput & FilterInput & {
  isActive?: boolean;
  organizationId?: string;
  userId?: string;
};

export type GetApiKeysInput = PaginatedInput & FilterInput & {
  isActive?: boolean;
  organizationId?: string;
  userId?: string;
  expiresWithin?: number; // days
};

// OAuth specific inputs for integrations (renamed to avoid conflicts with auth module)
export type IntegrationOAuthConnectInput = {
  provider: string;
  redirectUri: string;
  scopes?: string[];
  state?: string;
};

export type IntegrationOAuthCallbackInput = {
  provider: string;
  code: string;
  state?: string;
};

export type IntegrationOAuthRefreshInput = {
  integrationId: string;
}; 