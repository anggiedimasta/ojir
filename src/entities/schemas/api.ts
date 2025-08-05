import { z } from 'zod';
import { BaseEntitySchema } from './common';

// API Response and Error Schemas
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.object({
      message: z.string(),
      code: z.string(),
      field: z.string().optional(),
      details: z.record(z.unknown()).optional(),
    }).optional(),
    meta: z.record(z.any()).optional(),
  });

export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
  field: z.string().optional(),
  details: z.record(z.unknown()).optional(),
});

export const TRPCErrorResponseSchema = z.object({
  message: z.string(),
  code: z.string(),
  data: z.object({
    code: z.string(),
    httpStatus: z.number(),
    stack: z.string().optional(),
    path: z.string(),
  }).optional(),
});

// Common input schemas for pagination and filtering
export const PaginatedInputSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const FilterInputSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
  tags: z.array(z.string()).optional(),
});

export const DateRangeInputSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

// User API Schemas
export const UserResponseSchema = BaseEntitySchema.extend({
  name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  emailVerified: z.date().nullable().optional(),
});

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
    marketing: z.boolean(),
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
  }),
});

export const UserProfileResponseSchema = UserResponseSchema.extend({
  bio: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string(),
  language: z.string(),
  preferences: UserPreferencesSchema,
});

export const UpdateUserInputSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
});

export const UpdateUserPreferencesInputSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
    marketing: z.boolean(),
  }).partial().optional(),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
  }).partial().optional(),
});

export const GetUsersInputSchema = PaginatedInputSchema.merge(FilterInputSchema).extend({
  role: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
});

export const CreateUserInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().optional(),
});

export const ChangePasswordInputSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Organization API Schemas
export const OrganizationResponseSchema = BaseEntitySchema.extend({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  website: z.string().optional(),
  logo: z.string().optional(),
  industry: z.string().optional(),
  size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']),
  type: z.enum(['corporation', 'llc', 'partnership', 'nonprofit', 'government', 'other']),
  isActive: z.boolean(),
  memberCount: z.number().optional(),
});

export const TeamResponseSchema = BaseEntitySchema.extend({
  organizationId: z.string(),
  departmentId: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  leaderId: z.string(),
  memberCount: z.number(),
  isActive: z.boolean(),
});

export const TeamMemberResponseSchema = z.object({
  userId: z.string(),
  teamId: z.string(),
  role: z.enum(['owner', 'admin', 'member', 'viewer']),
  joinedAt: z.date(),
  permissions: z.array(z.string()),
  user: z.object({
    id: z.string(),
    name: z.string().optional(),
    email: z.string(),
    image: z.string().optional(),
  }),
});

export const CreateOrganizationInputSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']),
  type: z.enum(['corporation', 'llc', 'partnership', 'nonprofit', 'government', 'other']),
});

export const UpdateOrganizationInputSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  website: z.string().optional(),
  logo: z.string().optional(),
  industry: z.string().optional(),
  size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']).optional(),
  type: z.enum(['corporation', 'llc', 'partnership', 'nonprofit', 'government', 'other']).optional(),
});

export const CreateTeamInputSchema = z.object({
  organizationId: z.string(),
  departmentId: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  leaderId: z.string(),
});

export const UpdateTeamInputSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  leaderId: z.string().optional(),
  departmentId: z.string().optional(),
});

export const AddTeamMemberInputSchema = z.object({
  teamId: z.string(),
  userId: z.string(),
  role: z.enum(['admin', 'member', 'viewer']),
  permissions: z.array(z.string()).optional(),
});

export const UpdateTeamMemberInputSchema = z.object({
  teamId: z.string(),
  userId: z.string(),
  role: z.enum(['admin', 'member', 'viewer']).optional(),
  permissions: z.array(z.string()).optional(),
});

export const GetOrganizationsInputSchema = PaginatedInputSchema.merge(FilterInputSchema).extend({
  size: z.string().optional(),
  type: z.string().optional(),
  industry: z.string().optional(),
});

export const GetTeamsInputSchema = PaginatedInputSchema.merge(FilterInputSchema).extend({
  organizationId: z.string().optional(),
  departmentId: z.string().optional(),
  leaderId: z.string().optional(),
});

// Project API Schemas
export const ProjectResponseSchema = BaseEntitySchema.extend({
  organizationId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled', 'archived']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  visibility: z.enum(['public', 'internal', 'private']),
  ownerId: z.string(),
  teamId: z.string().optional(),
  clientId: z.string().optional(),
  progress: z.number().optional(),
  taskCount: z.number().optional(),
  completedTaskCount: z.number().optional(),
});

export const TaskResponseSchema = BaseEntitySchema.extend({
  projectId: z.string(),
  milestoneId: z.string().optional(),
  parentTaskId: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['backlog', 'todo', 'in-progress', 'review', 'testing', 'done', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assigneeId: z.string().optional(),
  reporterId: z.string(),
  estimatedHours: z.number().optional(),
  actualHours: z.number().optional(),
  dueDate: z.date().optional(),
  completedAt: z.date().optional(),
  tags: z.array(z.string()),
});

export const MilestoneResponseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  dueDate: z.date(),
  completedAt: z.date().optional(),
  status: z.enum(['pending', 'in-progress', 'completed', 'overdue']),
  taskCount: z.number(),
  completedTaskCount: z.number(),
  progress: z.number(),
});

export const CreateProjectInputSchema = z.object({
  organizationId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  visibility: z.enum(['public', 'internal', 'private']).optional(),
  teamId: z.string().optional(),
  clientId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  budget: z.number().optional(),
});

export const UpdateProjectInputSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled', 'archived']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  visibility: z.enum(['public', 'internal', 'private']).optional(),
  teamId: z.string().optional(),
  clientId: z.string().optional(),
  endDate: z.date().optional(),
  budget: z.number().optional(),
});

export const CreateTaskInputSchema = z.object({
  projectId: z.string(),
  milestoneId: z.string().optional(),
  parentTaskId: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigneeId: z.string().optional(),
  estimatedHours: z.number().optional(),
  dueDate: z.date().optional(),
  tags: z.array(z.string()).optional(),
});

export const UpdateTaskInputSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['backlog', 'todo', 'in-progress', 'review', 'testing', 'done', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigneeId: z.string().optional(),
  estimatedHours: z.number().optional(),
  actualHours: z.number().optional(),
  dueDate: z.date().optional(),
  tags: z.array(z.string()).optional(),
});

export const CreateMilestoneInputSchema = z.object({
  projectId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  dueDate: z.date(),
});

export const GetProjectsInputSchema = PaginatedInputSchema.merge(FilterInputSchema).extend({
  organizationId: z.string().optional(),
  ownerId: z.string().optional(),
  teamId: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
});

export const GetTasksInputSchema = PaginatedInputSchema.merge(FilterInputSchema).extend({
  projectId: z.string().optional(),
  milestoneId: z.string().optional(),
  assigneeId: z.string().optional(),
  reporterId: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  dueDateRange: DateRangeInputSchema.optional(),
});

// Customer API Schemas
export const CustomerResponseSchema = BaseEntitySchema.extend({
  organizationId: z.string(),
  type: z.enum(['individual', 'business', 'enterprise']),
  status: z.enum(['lead', 'prospect', 'active', 'inactive', 'churned']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  assignedTo: z.string().optional(),
  lifetimeValue: z.number().optional(),
  acquisitionCost: z.number().optional(),
  lastContactedAt: z.date().optional(),
});

export const ContactResponseSchema = BaseEntitySchema.extend({
  customerId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  isPrimary: z.boolean(),
  notes: z.string().optional(),
});

export const CustomerInteractionResponseSchema = BaseEntitySchema.extend({
  customerId: z.string(),
  userId: z.string(),
  type: z.enum(['call', 'email', 'meeting', 'demo', 'support', 'sale', 'follow-up', 'other']),
  channel: z.enum(['phone', 'email', 'in-person', 'video-call', 'chat', 'social-media', 'website']),
  subject: z.string().optional(),
  content: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  outcome: z.string().optional(),
  followUpDate: z.date().optional(),
  duration: z.number().optional(),
});

export const CreateCustomerInputSchema = z.object({
  organizationId: z.string(),
  type: z.enum(['individual', 'business', 'enterprise']),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignedTo: z.string().optional(),
  source: z.object({
    channel: z.string(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
    referrer: z.string().optional(),
  }).optional(),
});

export const UpdateCustomerInputSchema = z.object({
  id: z.string(),
  type: z.enum(['individual', 'business', 'enterprise']).optional(),
  status: z.enum(['lead', 'prospect', 'active', 'inactive', 'churned']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});

export const CreateContactInputSchema = z.object({
  customerId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  isPrimary: z.boolean().optional(),
  notes: z.string().optional(),
});

export const UpdateContactInputSchema = z.object({
  id: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  isPrimary: z.boolean().optional(),
  notes: z.string().optional(),
});

export const CreateInteractionInputSchema = z.object({
  customerId: z.string(),
  type: z.enum(['call', 'email', 'meeting', 'demo', 'support', 'sale', 'follow-up', 'other']),
  channel: z.enum(['phone', 'email', 'in-person', 'video-call', 'chat', 'social-media', 'website']),
  subject: z.string().optional(),
  content: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  outcome: z.string().optional(),
  followUpDate: z.date().optional(),
  duration: z.number().optional(),
});

export const GetCustomersInputSchema = PaginatedInputSchema.merge(FilterInputSchema).extend({
  organizationId: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assignedTo: z.string().optional(),
  industry: z.string().optional(),
  contactedDateRange: DateRangeInputSchema.optional(),
});

export const GetInteractionsInputSchema = PaginatedInputSchema.merge(FilterInputSchema).extend({
  customerId: z.string().optional(),
  userId: z.string().optional(),
  type: z.string().optional(),
  channel: z.string().optional(),
  sentiment: z.string().optional(),
  dateRange: DateRangeInputSchema.optional(),
});

// Financial API Schemas
export const InvoiceResponseSchema = BaseEntitySchema.extend({
  organizationId: z.string(),
  customerId: z.string(),
  projectId: z.string().optional(),
  number: z.string(),
  status: z.enum(['draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'cancelled', 'refunded']),
  type: z.enum(['standard', 'recurring', 'credit-note', 'quote', 'estimate']),
  currency: z.string(),
  subtotal: z.number(),
  taxAmount: z.number(),
  discountAmount: z.number(),
  total: z.number(),
  amountPaid: z.number(),
  amountDue: z.number(),
  issuedDate: z.date(),
  dueDate: z.date(),
  paidDate: z.date().optional(),
});

export const PaymentResponseSchema = BaseEntitySchema.extend({
  invoiceId: z.string(),
  amount: z.number(),
  currency: z.string(),
  method: z.enum(['credit-card', 'debit-card', 'bank-transfer', 'paypal', 'stripe', 'cash', 'check', 'crypto', 'other']),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded']),
  reference: z.string().optional(),
  gateway: z.string().optional(),
  gatewayTransactionId: z.string().optional(),
  processedAt: z.date(),
});

export const ProductResponseSchema = BaseEntitySchema.extend({
  organizationId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  sku: z.string(),
  category: z.string().optional(),
  type: z.enum(['physical', 'digital', 'service', 'subscription']),
  status: z.enum(['active', 'inactive', 'discontinued', 'coming-soon']),
  price: z.number(),
  currency: z.string(),
  cost: z.number().optional(),
  images: z.array(z.string()),
  tags: z.array(z.string()),
});

export const OrderResponseSchema = BaseEntitySchema.extend({
  organizationId: z.string(),
  customerId: z.string(),
  number: z.string(),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  type: z.enum(['purchase', 'subscription', 'renewal', 'upgrade']),
  currency: z.string(),
  subtotal: z.number(),
  taxAmount: z.number(),
  shippingAmount: z.number(),
  discountAmount: z.number(),
  total: z.number(),
  itemCount: z.number(),
  completedAt: z.date().optional(),
});

export const CreateInvoiceInputSchema = z.object({
  organizationId: z.string(),
  customerId: z.string(),
  projectId: z.string().optional(),
  type: z.enum(['standard', 'recurring', 'credit-note', 'quote', 'estimate']).optional(),
  currency: z.string(),
  dueDate: z.date(),
  description: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  lineItems: z.array(z.object({
    productId: z.string().optional(),
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    taxRate: z.number().optional(),
    discountRate: z.number().optional(),
  })),
});

export const UpdateInvoiceInputSchema = z.object({
  id: z.string(),
  status: z.enum(['draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'cancelled', 'refunded']).optional(),
  dueDate: z.date().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

export const CreatePaymentInputSchema = z.object({
  invoiceId: z.string(),
  amount: z.number(),
  method: z.enum(['credit-card', 'debit-card', 'bank-transfer', 'paypal', 'stripe', 'cash', 'check', 'crypto', 'other']),
  reference: z.string().optional(),
  gateway: z.string().optional(),
  notes: z.string().optional(),
});

export const CreateProductInputSchema = z.object({
  organizationId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  sku: z.string(),
  category: z.string().optional(),
  type: z.enum(['physical', 'digital', 'service', 'subscription']),
  price: z.number(),
  currency: z.string(),
  cost: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

export const UpdateProductInputSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['active', 'inactive', 'discontinued', 'coming-soon']).optional(),
  price: z.number().optional(),
  cost: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

export const CreateOrderInputSchema = z.object({
  organizationId: z.string(),
  customerId: z.string(),
  type: z.enum(['purchase', 'subscription', 'renewal', 'upgrade']).optional(),
  currency: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    notes: z.string().optional(),
  })),
  notes: z.string().optional(),
});

export const GetInvoicesInputSchema = PaginatedInputSchema.merge(FilterInputSchema).extend({
  organizationId: z.string().optional(),
  customerId: z.string().optional(),
  projectId: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  issueDateRange: DateRangeInputSchema.optional(),
  dueDateRange: DateRangeInputSchema.optional(),
  amountRange: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
});

export const GetPaymentsInputSchema = PaginatedInputSchema.merge(FilterInputSchema).extend({
  invoiceId: z.string().optional(),
  method: z.string().optional(),
  status: z.string().optional(),
  dateRange: DateRangeInputSchema.optional(),
  amountRange: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
});

export const GetProductsInputSchema = PaginatedInputSchema.merge(FilterInputSchema).extend({
  organizationId: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  priceRange: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
});

export const GetOrdersInputSchema = PaginatedInputSchema.merge(FilterInputSchema).extend({
  organizationId: z.string().optional(),
  customerId: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  dateRange: DateRangeInputSchema.optional(),
  amountRange: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
});

// Integration API Schemas
export const IntegrationResponseSchema = BaseEntitySchema.extend({
  userId: z.string(),
  organizationId: z.string().optional(),
  provider: z.enum(['google', 'microsoft', 'slack', 'discord', 'zoom', 'stripe', 'paypal', 'github', 'gitlab', 'jira', 'asana', 'trello', 'notion', 'airtable']),
  providerId: z.string(),
  name: z.string(),
  status: z.enum(['connected', 'disconnected', 'error', 'pending', 'expired']),
  permissions: z.array(z.string()),
  lastSyncAt: z.date().optional(),
  errorCount: z.number(),
  lastError: z.string().optional(),
  isActive: z.boolean(),
});

export const WebhookResponseSchema = BaseEntitySchema.extend({
  url: z.string().url(),
  events: z.array(z.string()),
  isActive: z.boolean(),
  retryCount: z.number(),
  maxRetries: z.number(),
  lastTriggeredAt: z.date().optional(),
  lastSuccessAt: z.date().optional(),
  lastFailureAt: z.date().optional(),
  failureReason: z.string().optional(),
  organizationId: z.string().optional(),
  userId: z.string().optional(),
});

export const ApiKeyResponseSchema = BaseEntitySchema.extend({
  name: z.string(),
  keyPrefix: z.string(),
  userId: z.string(),
  organizationId: z.string().optional(),
  permissions: z.array(z.string()),
  isActive: z.boolean(),
  expiresAt: z.date().optional(),
  lastUsedAt: z.date().optional(),
  usageCount: z.number(),
  rateLimit: z.number().optional(),
  rateLimitWindow: z.number().optional(),
});

export const CreateIntegrationInputSchema = z.object({
  provider: z.enum(['google', 'microsoft', 'slack', 'discord', 'zoom', 'stripe', 'paypal', 'github', 'gitlab', 'jira', 'asana', 'trello', 'notion', 'airtable']),
  name: z.string(),
  configuration: z.record(z.any()),
  permissions: z.array(z.string()),
  organizationId: z.string().optional(),
});

export const UpdateIntegrationInputSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  configuration: z.record(z.any()).optional(),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const SyncIntegrationInputSchema = z.object({
  id: z.string(),
  forceSync: z.boolean().optional(),
  syncOptions: z.record(z.any()).optional(),
});

export const CreateWebhookInputSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()),
  secret: z.string().optional(),
  maxRetries: z.number().optional(),
  headers: z.record(z.string()).optional(),
  organizationId: z.string().optional(),
});

export const UpdateWebhookInputSchema = z.object({
  id: z.string(),
  url: z.string().url().optional(),
  events: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  maxRetries: z.number().optional(),
  headers: z.record(z.string()).optional(),
});

export const TestWebhookInputSchema = z.object({
  id: z.string(),
  eventType: z.string(),
  testData: z.record(z.any()).optional(),
});

export const CreateApiKeyInputSchema = z.object({
  name: z.string(),
  permissions: z.array(z.string()),
  organizationId: z.string().optional(),
  expiresAt: z.date().optional(),
  rateLimit: z.number().optional(),
  rateLimitWindow: z.number().optional(),
  allowedIPs: z.array(z.string()).optional(),
  allowedDomains: z.array(z.string()).optional(),
});

export const UpdateApiKeyInputSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.date().optional(),
  rateLimit: z.number().optional(),
  rateLimitWindow: z.number().optional(),
  allowedIPs: z.array(z.string()).optional(),
  allowedDomains: z.array(z.string()).optional(),
});

export const RevokeApiKeyInputSchema = z.object({
  id: z.string(),
  reason: z.string().optional(),
});

export const GetIntegrationsInputSchema = PaginatedInputSchema.merge(FilterInputSchema).extend({
  provider: z.string().optional(),
  status: z.string().optional(),
  organizationId: z.string().optional(),
  userId: z.string().optional(),
});

export const GetWebhooksInputSchema = PaginatedInputSchema.merge(FilterInputSchema).extend({
  isActive: z.boolean().optional(),
  organizationId: z.string().optional(),
  userId: z.string().optional(),
});

export const GetApiKeysInputSchema = PaginatedInputSchema.merge(FilterInputSchema).extend({
  isActive: z.boolean().optional(),
  organizationId: z.string().optional(),
  userId: z.string().optional(),
  expiresWithin: z.number().optional(), // days
});

// OAuth specific inputs for integrations (renamed to avoid conflicts with auth module)
export const IntegrationOAuthConnectInputSchema = z.object({
  provider: z.string(),
  redirectUri: z.string().url(),
  scopes: z.array(z.string()).optional(),
  state: z.string().optional(),
});

export const IntegrationOAuthCallbackInputSchema = z.object({
  provider: z.string(),
  code: z.string(),
  state: z.string().optional(),
});

export const IntegrationOAuthRefreshInputSchema = z.object({
  integrationId: z.string(),
}); 