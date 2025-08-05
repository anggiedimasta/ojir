// Common Zod schemas for validation

import { z } from 'zod';

// Base entity schema
export const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Soft deletable entity schema
export const SoftDeletableEntitySchema = BaseEntitySchema.extend({
  deletedAt: z.date().optional(),
  isDeleted: z.boolean(),
});

// Auditable entity schema
export const AuditableEntitySchema = BaseEntitySchema.extend({
  createdBy: z.string(),
  updatedBy: z.string(),
  version: z.number().int().positive(),
});

// Address schema
export const AddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  country: z.string().min(1),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
});

// Contact info schema
export const ContactInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  fax: z.string().optional(),
  socialMedia: z.object({
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    facebook: z.string().url().optional(),
  }).optional(),
});

// Pagination params schema
export const PaginationParamsSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Filter params schema
export const FilterParamsSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
  tags: z.array(z.string()).optional(),
});

// Date range schema
export const DateRangeSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

// File upload schema
export const FileUploadSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  originalName: z.string().min(1),
  url: z.string().url(),
  size: z.number().positive(),
  mimeType: z.string().min(1),
  uploadedBy: z.string(),
  uploadedAt: z.date(),
  metadata: z.record(z.any()).optional(),
});

// Notification schema
export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  type: z.enum(['info', 'success', 'warning', 'error', 'reminder', 'invitation', 'update']),
  title: z.string().min(1),
  message: z.string().min(1),
  data: z.record(z.any()).optional(),
  isRead: z.boolean(),
  readAt: z.date().optional(),
  createdAt: z.date(),
});

// API response schema
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

// API error schema
export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.any()).optional(),
});

// Form field schema
export const FormFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['text', 'email', 'password', 'number', 'select', 'textarea', 'checkbox', 'radio']),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).optional(),
  validation: z.record(z.any()).optional(),
});

// Button props schema
export const ButtonPropsSchema = z.object({
  variant: z.enum(['primary', 'secondary', 'outline', 'ghost', 'destructive']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  type: z.enum(['button', 'submit', 'reset']).optional(),
  className: z.string().optional(),
});

// Input props schema
export const InputPropsSchema = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  type: z.enum(['text', 'email', 'password', 'number', 'tel', 'url']).optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  error: z.string().optional(),
  value: z.string().optional(),
  className: z.string().optional(),
});

// Select props schema
export const SelectPropsSchema = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  error: z.string().optional(),
  value: z.string().optional(),
  className: z.string().optional(),
});

// Status schema
export const StatusSchema = z.enum(['active', 'inactive', 'pending', 'suspended']);

// Priority schema
export const PrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

// Sort order schema
export const SortOrderSchema = z.enum(['asc', 'desc']);

// Currency schema
export const CurrencySchema = z.enum(['USD', 'EUR', 'GBP', 'JPY', 'IDR', 'SGD', 'MYR', 'THB', 'PHP', 'VND']);

// Language schema
export const LanguageSchema = z.enum(['en', 'id', 'ja', 'ko', 'zh', 'es', 'fr', 'de']);

// Timezone schema
export const TimezoneSchema = z.enum(['UTC', 'GMT', 'EST', 'PST', 'WIB', 'WITA', 'WIT']);

// File type schema
export const FileTypeSchema = z.enum(['image', 'document', 'video', 'audio', 'archive', 'other']);

// Permission schema
export const PermissionSchema = z.enum(['read', 'write', 'delete', 'admin']);

// Role schema
export const RoleSchema = z.enum(['user', 'admin', 'moderator', 'guest']);