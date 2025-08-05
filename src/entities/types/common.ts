// Common types used across multiple entities

// Base entity types
export type BaseEntity = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SoftDeletableEntity = BaseEntity & {
  deletedAt?: Date;
  isDeleted: boolean;
};

export type AuditableEntity = BaseEntity & {
  createdBy: string;
  updatedBy: string;
  version: number;
};

// Status and priority types
export type Status = 'active' | 'inactive' | 'pending' | 'suspended';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Pagination types
export type PaginationParams = {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// Filter types
export type FilterParams = {
  search?: string;
  status?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  tags?: string[];
};

// File upload types
export type FileUpload = {
  id: string;
  name: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
  metadata?: Record<string, any>;
};

// Notification types
export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
};

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'reminder'
  | 'invitation'
  | 'update';

// Date range types
export type DateRange = {
  startDate?: Date;
  endDate?: Date;
};

// API response types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, any>;
};

// Loading state types
export type LoadingState = {
  isLoading: boolean;
  error?: string;
  data?: any;
};

// Form types
export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: Record<string, any>;
};

// UI types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type InputSize = 'sm' | 'md' | 'lg'; 