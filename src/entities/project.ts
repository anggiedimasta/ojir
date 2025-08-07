import type { Attachment, Priority } from "./common";

export interface Project {
	id: string;
	organizationId: string;
	name: string;
	description?: string;
	slug: string;
	status: ProjectStatus;
	priority: Priority;
	visibility: ProjectVisibility;
	ownerId: string;
	teamId?: string;
	clientId?: string;
	budget?: ProjectBudget;
	timeline: ProjectTimeline;
	tags: string[];
	customFields: Record<string, any>;
	createdAt: Date;
	updatedAt: Date;
}

export type ProjectStatus =
	| "planning"
	| "active"
	| "on-hold"
	| "completed"
	| "cancelled"
	| "archived";

export type ProjectVisibility = "public" | "internal" | "private";

export interface ProjectBudget {
	total: number;
	spent: number;
	currency: string;
	approved: boolean;
	approvedBy?: string;
	approvedAt?: Date;
}

export interface ProjectTimeline {
	startDate: Date;
	endDate: Date;
	estimatedHours: number;
	actualHours?: number;
	milestones: Milestone[];
}

export interface Milestone {
	id: string;
	projectId: string;
	name: string;
	description?: string;
	dueDate: Date;
	completedAt?: Date;
	status: "pending" | "in-progress" | "completed" | "overdue";
	dependencies: string[];
}

export interface Task {
	id: string;
	projectId: string;
	milestoneId?: string;
	parentTaskId?: string;
	title: string;
	description?: string;
	status: TaskStatus;
	priority: Priority;
	assigneeId?: string;
	reporterId: string;
	estimatedHours?: number;
	actualHours?: number;
	dueDate?: Date;
	completedAt?: Date;
	tags: string[];
	labels: string[];
	attachments: Attachment[];
	comments: TaskComment[];
	dependencies: TaskDependency[];
	customFields: Record<string, any>;
	createdAt: Date;
	updatedAt: Date;
}

export type TaskStatus =
	| "backlog"
	| "todo"
	| "in-progress"
	| "review"
	| "testing"
	| "done"
	| "cancelled";

export interface TaskDependency {
	id: string;
	taskId: string;
	dependsOnTaskId: string;
	type: "blocks" | "is-blocked-by" | "relates-to";
	createdAt: Date;
}

export interface TaskComment {
	id: string;
	taskId: string;
	authorId: string;
	content: string;
	mentions: string[];
	attachments: Attachment[];
	createdAt: Date;
	updatedAt?: Date;
}
