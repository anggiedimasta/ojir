import type { PaginatedInput, FilterInput, DateRangeInput } from './common';

// Customer API Response types
export interface CustomerResponse {
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
}

export interface ContactResponse {
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
}

export interface CustomerInteractionResponse {
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
}

// Customer API Input types
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