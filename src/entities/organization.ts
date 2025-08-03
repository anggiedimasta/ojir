import type { Address, ContactInfo } from './common';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  logo?: string;
  industry?: string;
  size: OrganizationSize;
  type: OrganizationType;
  foundedAt?: Date;
  address?: Address;
  contact: ContactInfo;
  settings: OrganizationSettings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type OrganizationSize =
  | 'startup'
  | 'small'
  | 'medium'
  | 'large'
  | 'enterprise';

export type OrganizationType =
  | 'corporation'
  | 'llc'
  | 'partnership'
  | 'nonprofit'
  | 'government'
  | 'other';

export interface OrganizationSettings {
  timezone: string;
  currency: string;
  dateFormat: string;
  workingDays: number[];
  workingHours: {
    start: string;
    end: string;
  };
  features: {
    calendar: boolean;
    projects: boolean;
    billing: boolean;
    reports: boolean;
  };
}

export interface Department {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  managerId?: string;
  parentDepartmentId?: string;
  budget?: number;
  headcount: number;
  createdAt: Date;
}

export interface Team {
  id: string;
  organizationId: string;
  departmentId?: string;
  name: string;
  description?: string;
  leaderId: string;
  members: TeamMember[];
  isActive: boolean;
  createdAt: Date;
}

export interface TeamMember {
  userId: string;
  teamId: string;
  role: TeamRole;
  joinedAt: Date;
  permissions: string[];
}

export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';