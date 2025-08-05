// Common interfaces used across multiple entities

// Address interface
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Attachment interface
export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
}

// Contact info interface
export interface ContactInfo {
  email: string;
  phone?: string;
  fax?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

// Base entity interfaces
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeletableEntity extends BaseEntity {
  deletedAt?: Date;
  isDeleted: boolean;
}

export interface AuditableEntity extends BaseEntity {
  createdBy: string;
  updatedBy: string;
  version: number;
}

// Pagination and filtering interfaces
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FilterParams {
  search?: string;
  status?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  tags?: string[];
}

// File upload interface
export interface FileUpload {
  id: string;
  name: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
  metadata?: Record<string, any>;
}

// Notification interface
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'reminder'
  | 'invitation'
  | 'update';

// Date range interface
export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

// API response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Loading state interface
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  data?: any;
}

// Form field interface
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: Record<string, any>;
}

// UI component interfaces
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export interface SelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
} 