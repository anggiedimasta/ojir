import type { BaseEntity } from "./common";

// Database entity that corresponds to the calendar_events table
export interface CalendarEventRecord extends BaseEntity {
	title: string;
	description?: string;
	startTime: Date;
	endTime: Date;
	userId: string;
}

// Database entity that corresponds to the users table
export interface UserRecord {
	id: string;
	name?: string;
	email: string;
	emailVerified?: Date;
	image?: string;
}

// Database entity that corresponds to the accounts table
export interface AccountRecord {
	userId: string;
	type: string;
	provider: string;
	providerAccountId: string;
	refresh_token?: string;
	access_token?: string;
	expires_at?: number;
	token_type?: string;
	scope?: string;
	id_token?: string;
	session_state?: string;
}

// Database entity that corresponds to the sessions table
export interface SessionRecord {
	sessionToken: string;
	userId: string;
	expires: Date;
}

// Database entity that corresponds to the verification_tokens table
export interface VerificationTokenRecord {
	identifier: string;
	token: string;
	expires: Date;
}

// Migration and Schema Types
export interface Migration {
	id: string;
	name: string;
	version: string;
	appliedAt: Date;
	rollbackScript?: string;
	checksum: string;
}

export interface SchemaVersion {
	version: string;
	description: string;
	appliedAt: Date;
	appliedBy: string;
	migrations: Migration[];
}

// Database Connection and Configuration
export interface DatabaseConfig {
	host: string;
	port: number;
	database: string;
	username: string;
	password: string;
	ssl: boolean;
	connectionTimeout: number;
	maxConnections: number;
	idleTimeout: number;
	retryAttempts: number;
}

export interface ConnectionPool {
	id: string;
	name: string;
	config: DatabaseConfig;
	activeConnections: number;
	idleConnections: number;
	totalConnections: number;
	createdAt: Date;
	lastUsedAt: Date;
	stats: ConnectionStats;
}

export interface ConnectionStats {
	totalQueries: number;
	successfulQueries: number;
	failedQueries: number;
	averageQueryTime: number;
	longestQueryTime: number;
	lastQueryAt: Date;
	errorRate: number;
}

// Backup and Maintenance
export interface DatabaseBackup extends BaseEntity {
	name: string;
	size: number;
	location: string;
	type: "full" | "incremental" | "differential";
	status: "running" | "completed" | "failed" | "cancelled";
	startedAt: Date;
	completedAt?: Date;
	errorMessage?: string;
	retentionDays: number;
	triggeredBy: "manual" | "scheduled" | "system";
}

export interface MaintenanceWindow extends BaseEntity {
	name: string;
	description: string;
	startTime: Date;
	endTime: Date;
	type: "backup" | "upgrade" | "maintenance" | "migration";
	status: "scheduled" | "active" | "completed" | "cancelled";
	affectedTables: string[];
	downtime: boolean;
	scheduledBy: string;
}

// Query Performance and Monitoring
export interface QueryLog extends BaseEntity {
	query: string;
	queryHash: string;
	executionTime: number;
	rowsAffected: number;
	status: "success" | "error" | "timeout";
	errorMessage?: string;
	userId?: string;
	sessionId?: string;
	ipAddress?: string;
	timestamp: Date;
}

export interface SlowQuery extends BaseEntity {
	query: string;
	queryHash: string;
	executionTime: number;
	frequency: number;
	firstSeenAt: Date;
	lastSeenAt: Date;
	averageExecutionTime: number;
	maxExecutionTime: number;
	suggestions: string[];
	isResolved: boolean;
}
