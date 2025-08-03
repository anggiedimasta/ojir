import type { Address, Attachment, Priority } from './common';

export interface Customer {
  id: string;
  organizationId: string;
  type: CustomerType;
  status: CustomerStatus;
  priority: Priority;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  address?: Address;
  billingAddress?: Address;
  contacts: Contact[];
  socialMedia?: SocialMediaLinks;
  notes?: string;
  tags: string[];
  customFields: Record<string, any>;
  assignedTo?: string;
  source: CustomerSource;
  lifetimeValue?: number;
  acquisitionCost?: number;
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
}

export type CustomerType = 'individual' | 'business' | 'enterprise';
export type CustomerStatus = 'lead' | 'prospect' | 'active' | 'inactive' | 'churned';

export interface Contact {
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

export interface SocialMediaLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
}

export interface CustomerSource {
  channel: 'website' | 'referral' | 'social' | 'advertisement' | 'event' | 'cold-outreach' | 'other';
  medium?: string;
  campaign?: string;
  referrer?: string;
  details?: string;
}

export interface CustomerInteraction {
  id: string;
  customerId: string;
  userId: string;
  type: InteractionType;
  channel: CommunicationChannel;
  subject?: string;
  content: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  outcome?: InteractionOutcome;
  followUpDate?: Date;
  duration?: number;
  attachments: Attachment[];
  createdAt: Date;
}

export type InteractionType =
  | 'call'
  | 'email'
  | 'meeting'
  | 'demo'
  | 'support'
  | 'sale'
  | 'follow-up'
  | 'other';

export type CommunicationChannel =
  | 'phone'
  | 'email'
  | 'in-person'
  | 'video-call'
  | 'chat'
  | 'social-media'
  | 'website';

export type InteractionOutcome =
  | 'interested'
  | 'not-interested'
  | 'follow-up-needed'
  | 'closed-won'
  | 'closed-lost'
  | 'qualified'
  | 'disqualified';