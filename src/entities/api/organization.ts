import type { PaginatedInput, FilterInput } from './common';

// Organization API Response types
export interface OrganizationResponse {
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
}

export interface TeamResponse {
  id: string;
  organizationId: string;
  departmentId?: string;
  name: string;
  description?: string;
  leaderId: string;
  memberCount: number;
  isActive: boolean;
  createdAt: Date;
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

// Organization API Input types
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