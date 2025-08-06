import type { BaseEntity } from './common';

// Calendar Interfaces
export interface CalendarEvent extends BaseEntity {
  organizationId?: string;
  userId: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  timeZone: string;
  isAllDay: boolean;
  status: 'tentative' | 'confirmed' | 'cancelled';
  visibility: 'public' | 'private' | 'confidential' | 'default';
  type: 'meeting' | 'appointment' | 'task' | 'reminder' | 'birthday' | 'holiday' | 'vacation' | 'conference' | 'workshop' | 'other';
  category?: 'work' | 'personal' | 'family' | 'health' | 'education' | 'travel' | 'entertainment' | 'shopping' | 'finance' | 'other';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  color?: string;
  attendees: EventAttendee[];
  organizer: EventOrganizer;
  recurrence?: RecurrenceRule;
  reminders: EventReminder[];
  attachments: EventAttachment[];
  meetingUrl?: string;
  meetingPassword?: string;
  customFields: Record<string, any>;
  isGoogleEvent?: boolean;
  googleEventId?: string;
}

export interface Calendar extends BaseEntity {
  organizationId?: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  isDefault: boolean;
  isVisible: boolean;
  timeZone: string;
  settings: CalendarSettings;
  isShared: boolean;
  shareSettings?: CalendarShareSettings;
}

export interface EventAttendee extends BaseEntity {
  eventId: string;
  email: string;
  name?: string;
  role: 'organizer' | 'required' | 'optional' | 'resource';
  status: 'pending' | 'accepted' | 'declined' | 'tentative' | 'no-response';
  isOptional: boolean;
  responseTime?: Date;
  comment?: string;
}

export interface EventOrganizer {
  email: string;
  name?: string;
  userId?: string;
}

export interface EventReminder extends BaseEntity {
  eventId: string;
  method: 'email' | 'popup' | 'sms' | 'push';
  minutes: number;
  isEnabled: boolean;
}

export interface EventAttachment extends BaseEntity {
  eventId: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  count?: number;
  until?: Date;
  byWeekDay?: number[];
  byMonthDay?: number[];
  byMonth?: number[];
  exceptions?: Date[];
}

export interface CalendarSettings {
  defaultEventDuration: number;
  workingHours: WorkingHours;
  workingDays: number[];
  showWeekends: boolean;
  defaultView: 'month' | 'week' | 'day' | 'agenda' | 'list';
  showDeclined: boolean;
  showWeekNumbers: boolean;
  timeZone: string;
  firstDayOfWeek: number;
  businessHours: WorkingHours;
  slotDuration: number;
  slotMinTime: string;
  slotMaxTime: string;
  allDaySlot: boolean;
  allDayText: string;
  noEventsMessage: string;
  eventLimit: number;
  eventLimitText: string;
  dayPopoverFormat: string;
  eventTimeFormat: {
    hour: 'numeric' | '2-digit';
    minute: 'numeric' | '2-digit';
    meridiem: boolean;
  };
  titleFormat: {
    month: string;
    week: string;
    day: string;
  };
  columnFormat: {
    month: string;
    week: string;
    day: string;
  };
}

export interface WorkingHours {
  start: string;
  end: string;
}

export interface CalendarShareSettings {
  isPublic: boolean;
  publicUrl?: string;
  allowAnonymousView: boolean;
  sharedWith: CalendarShare[];
  permissions: CalendarPermissions;
}

export interface CalendarShare extends BaseEntity {
  calendarId: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  sharedAt: Date;
  acceptedAt?: Date;
  status: 'pending' | 'accepted' | 'declined';
  permissions: CalendarPermissions;
}

export interface CalendarPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canInvite: boolean;
}

export interface CalendarPermission extends BaseEntity {
  userId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  grantedAt: Date;
  grantedBy: string;
  permissions: CalendarPermissions;
}

export interface GoogleCalendarSync extends BaseEntity {
  calendarId: string;
  googleCalendarId: string;
  syncDirection: 'one-way' | 'two-way';
  lastSyncAt?: Date;
  syncToken?: string;
  isEnabled: boolean;
}

export interface CalendarSyncSettings extends BaseEntity {
  calendarId: string;
  provider: 'google' | 'outlook' | 'apple' | 'other';
  providerCalendarId: string;
  syncDirection: 'one-way' | 'two-way';
  lastSyncAt?: Date;
  syncToken?: string;
  isEnabled: boolean;
  settings: {
    syncEvents: boolean;
    syncAttendees: boolean;
    syncReminders: boolean;
    syncAttachments: boolean;
    conflictResolution: 'local-wins' | 'remote-wins' | 'ask-user';
  };
}

// Input interfaces
export interface CreateEventInput {
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  timeZone?: string;
  isAllDay?: boolean;
  status?: 'tentative' | 'confirmed' | 'cancelled';
  visibility?: 'public' | 'private' | 'confidential' | 'default';
  type?: 'meeting' | 'appointment' | 'task' | 'reminder' | 'birthday' | 'holiday' | 'vacation' | 'conference' | 'workshop' | 'other';
  category?: 'work' | 'personal' | 'family' | 'health' | 'education' | 'travel' | 'entertainment' | 'shopping' | 'finance' | 'other';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  color?: string;
  attendees?: Array<{
    email: string;
    name?: string;
    role?: 'organizer' | 'required' | 'optional' | 'resource';
    isOptional?: boolean;
  }>;
  recurrence?: RecurrenceRule;
  reminders?: Array<{
    method: 'email' | 'popup' | 'sms' | 'push';
    minutes: number;
  }>;
  meetingUrl?: string;
  meetingPassword?: string;
  customFields?: Record<string, any>;
}

export interface UpdateEventInput {
  id: string;
  title?: string;
  description?: string;
  location?: string;
  startTime?: Date;
  endTime?: Date;
  timeZone?: string;
  isAllDay?: boolean;
  status?: 'tentative' | 'confirmed' | 'cancelled';
  visibility?: 'public' | 'private' | 'confidential' | 'default';
  type?: 'meeting' | 'appointment' | 'task' | 'reminder' | 'birthday' | 'holiday' | 'vacation' | 'conference' | 'workshop' | 'other';
  category?: 'work' | 'personal' | 'family' | 'health' | 'education' | 'travel' | 'entertainment' | 'shopping' | 'finance' | 'other';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  color?: string;
  attendees?: Array<{
    email: string;
    name?: string;
    role?: 'organizer' | 'required' | 'optional' | 'resource';
    isOptional?: boolean;
  }>;
  recurrence?: RecurrenceRule;
  reminders?: Array<{
    method: 'email' | 'popup' | 'sms' | 'push';
    minutes: number;
  }>;
  meetingUrl?: string;
  meetingPassword?: string;
  customFields?: Record<string, any>;
}

export interface CreateCalendarInput {
  name: string;
  description?: string;
  color: string;
  isDefault?: boolean;
  isVisible?: boolean;
  timeZone?: string;
  settings?: Partial<CalendarSettings>;
}

export interface UpdateCalendarInput {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  isDefault?: boolean;
  isVisible?: boolean;
  timeZone?: string;
  settings?: Partial<CalendarSettings>;
}

export interface ShareCalendarInput {
  calendarId: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions?: Partial<CalendarPermissions>;
}

// Filter interfaces
export interface EventFilter {
  startDate?: Date;
  endDate?: Date;
  status?: ('tentative' | 'confirmed' | 'cancelled')[];
  type?: ('meeting' | 'appointment' | 'task' | 'reminder' | 'birthday' | 'holiday' | 'vacation' | 'conference' | 'workshop' | 'other')[];
  category?: ('work' | 'personal' | 'family' | 'health' | 'education' | 'travel' | 'entertainment' | 'shopping' | 'finance' | 'other')[];
  priority?: ('low' | 'medium' | 'high' | 'urgent')[];
  attendees?: string[];
  organizer?: string;
  search?: string;
  isAllDay?: boolean;
  hasRecurrence?: boolean;
  hasAttachments?: boolean;
  hasMeetingUrl?: boolean;
}

export interface CalendarFilter {
  isDefault?: boolean;
  isVisible?: boolean;
  isShared?: boolean;
  timeZone?: string;
  search?: string;
  userId?: string;
  organizationId?: string;
}

// Response interfaces
export interface EventResponse {
  success: boolean;
  event?: CalendarEvent;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface CalendarResponse {
  success: boolean;
  calendar?: Calendar;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface EventsResponse {
  success: boolean;
  events: CalendarEvent[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface CalendarsResponse {
  success: boolean;
  calendars: Calendar[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}