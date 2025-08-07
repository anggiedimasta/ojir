import type { Attachment } from "./common";

export interface CalendarEvent {
	id: string;
	organizationId?: string;
	userId: string;
	title: string;
	description?: string;
	location?: string;
	startTime: Date;
	endTime: Date;
	timeZone: string;
	isAllDay: boolean;
	status: EventStatus;
	visibility: EventVisibility;
	type: EventType;
	category?: string;
	color?: string;
	attendees: EventAttendee[];
	organizer: EventOrganizer;
	recurrence?: RecurrenceRule;
	reminders: EventReminder[];
	attachments: Attachment[];
	meetingUrl?: string;
	meetingPassword?: string;
	customFields: Record<string, any>;
	isGoogleEvent?: boolean;
	googleEventId?: string;
	createdAt: Date;
	updatedAt: Date;
}

export type EventStatus = "tentative" | "confirmed" | "cancelled";
export type EventVisibility = "public" | "private" | "confidential" | "default";
export type EventType =
	| "meeting"
	| "appointment"
	| "task"
	| "reminder"
	| "birthday"
	| "holiday"
	| "vacation"
	| "conference"
	| "workshop"
	| "other";

export interface EventAttendee {
	id: string;
	eventId: string;
	email: string;
	name?: string;
	role: AttendeeRole;
	status: AttendeeStatus;
	isOptional: boolean;
	responseTime?: Date;
	comment?: string;
}

export type AttendeeRole = "organizer" | "required" | "optional" | "resource";
export type AttendeeStatus =
	| "pending"
	| "accepted"
	| "declined"
	| "tentative"
	| "no-response";

export interface EventOrganizer {
	email: string;
	name?: string;
	userId?: string;
}

export interface RecurrenceRule {
	frequency: RecurrenceFrequency;
	interval: number;
	count?: number;
	until?: Date;
	byWeekDay?: number[];
	byMonthDay?: number[];
	byMonth?: number[];
	exceptions?: Date[];
}

export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly";

export interface EventReminder {
	id: string;
	eventId: string;
	method: ReminderMethod;
	minutes: number;
	isEnabled: boolean;
}

export type ReminderMethod = "email" | "popup" | "sms" | "push";

export interface Calendar {
	id: string;
	organizationId?: string;
	userId: string;
	name: string;
	description?: string;
	color: string;
	isDefault: boolean;
	isVisible: boolean;
	timeZone: string;
	permissions: CalendarPermission[];
	settings: CalendarSettings;
	isShared: boolean;
	shareSettings?: CalendarShareSettings;
	createdAt: Date;
	updatedAt: Date;
}

export interface CalendarPermission {
	userId: string;
	role: CalendarRole;
	grantedAt: Date;
	grantedBy: string;
}

export type CalendarRole = "owner" | "admin" | "editor" | "viewer";

export interface CalendarSettings {
	defaultEventDuration: number;
	workingHours: {
		start: string;
		end: string;
	};
	workingDays: number[];
	showWeekends: boolean;
	defaultView: "month" | "week" | "day" | "agenda";
	showDeclined: boolean;
	showWeekNumbers: boolean;
}

export interface CalendarShareSettings {
	isPublic: boolean;
	publicUrl?: string;
	allowAnonymousView: boolean;
	sharedWith: CalendarShare[];
}

export interface CalendarShare {
	email: string;
	role: CalendarRole;
	sharedAt: Date;
	acceptedAt?: Date;
	status: "pending" | "accepted" | "declined";
}
