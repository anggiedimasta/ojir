import type { DateRangeInput, FilterInput, PaginatedInput } from "./common";

// Project API Response types
export interface ProjectResponse {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  slug: string;
  status:
    | "planning"
    | "active"
    | "on-hold"
    | "completed"
    | "cancelled"
    | "archived";
  priority: "low" | "medium" | "high" | "urgent";
  visibility: "public" | "internal" | "private";
  ownerId: string;
  teamId?: string;
  clientId?: string;
  progress?: number;
  taskCount?: number;
  completedTaskCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskResponse {
  id: string;
  projectId: string;
  milestoneId?: string;
  parentTaskId?: string;
  title: string;
  description?: string;
  status:
    | "backlog"
    | "todo"
    | "in-progress"
    | "review"
    | "testing"
    | "done"
    | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assigneeId?: string;
  reporterId: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  completedAt?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MilestoneResponse {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  dueDate: Date;
  completedAt?: Date;
  status: "pending" | "in-progress" | "completed" | "overdue";
  taskCount: number;
  completedTaskCount: number;
  progress: number;
}

// Project API Input types
export interface CreateProjectInput {
  organizationId: string;
  name: string;
  description?: string;
  slug: string;
  priority?: "low" | "medium" | "high" | "urgent";
  visibility?: "public" | "internal" | "private";
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
  status?:
    | "planning"
    | "active"
    | "on-hold"
    | "completed"
    | "cancelled"
    | "archived";
  priority?: "low" | "medium" | "high" | "urgent";
  visibility?: "public" | "internal" | "private";
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
  priority?: "low" | "medium" | "high" | "urgent";
  assigneeId?: string;
  estimatedHours?: number;
  dueDate?: Date;
  tags?: string[];
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  status?:
    | "backlog"
    | "todo"
    | "in-progress"
    | "review"
    | "testing"
    | "done"
    | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
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
