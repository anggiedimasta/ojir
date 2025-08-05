// Calendar types

// Event status types
export type EventStatus = 'tentative' | 'confirmed' | 'cancelled';

// Event visibility types
export type EventVisibility = 'public' | 'private' | 'confidential' | 'default';

// Event type types
export type EventType =
  | 'meeting'
  | 'appointment'
  | 'task'
  | 'reminder'
  | 'birthday'
  | 'holiday'
  | 'vacation'
  | 'conference'
  | 'workshop'
  | 'other';

// Attendee role types
export type AttendeeRole = 'organizer' | 'required' | 'optional' | 'resource';

// Attendee status types
export type AttendeeStatus = 'pending' | 'accepted' | 'declined' | 'tentative' | 'no-response';

// Recurrence frequency types
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

// Reminder method types
export type ReminderMethod = 'email' | 'popup' | 'sms' | 'push';

// Calendar role types
export type CalendarRole = 'owner' | 'admin' | 'editor' | 'viewer';

// Calendar view types
export type CalendarView = 'month' | 'week' | 'day' | 'agenda' | 'list';

// Calendar share status types
export type CalendarShareStatus = 'pending' | 'accepted' | 'declined';

// Working days types
export type WorkingDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.

// Event priority types
export type EventPriority = 'low' | 'medium' | 'high' | 'urgent';

// Event category types
export type EventCategory =
  | 'work'
  | 'personal'
  | 'family'
  | 'health'
  | 'education'
  | 'travel'
  | 'entertainment'
  | 'shopping'
  | 'finance'
  | 'other';

// Time zone types
export type TimeZone = string; // e.g., 'America/New_York', 'Asia/Jakarta'

// Date range types
export type DateRange = {
  startDate: Date;
  endDate: Date;
};

// Time range types
export type TimeRange = {
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
};

// Working hours types
export type WorkingHours = {
  start: string; // HH:mm format
  end: string; // HH:mm format
};

// Recurrence rule types
export type RecurrenceRule = {
  frequency: RecurrenceFrequency;
  interval: number;
  count?: number;
  until?: Date;
  byWeekDay?: number[];
  byMonthDay?: number[];
  byMonth?: number[];
  exceptions?: Date[];
};

// Event reminder types
export type EventReminder = {
  id: string;
  eventId: string;
  method: ReminderMethod;
  minutes: number;
  isEnabled: boolean;
};

// Event organizer types
export type EventOrganizer = {
  email: string;
  name?: string;
  userId?: string;
};

// Event attendee types
export type EventAttendee = {
  id: string;
  eventId: string;
  email: string;
  name?: string;
  role: AttendeeRole;
  status: AttendeeStatus;
  isOptional: boolean;
  responseTime?: Date;
  comment?: string;
};

// Calendar settings types
export type CalendarSettings = {
  defaultEventDuration: number; // in minutes
  workingHours: WorkingHours;
  workingDays: WorkingDay[];
  showWeekends: boolean;
  defaultView: CalendarView;
  showDeclined: boolean;
  showWeekNumbers: boolean;
  timeZone: TimeZone;
  firstDayOfWeek: WorkingDay;
  businessHours: WorkingHours;
  slotDuration: number; // in minutes
  slotMinTime: string; // HH:mm format
  slotMaxTime: string; // HH:mm format
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
};

// Calendar share settings types
export type CalendarShareSettings = {
  isPublic: boolean;
  publicUrl?: string;
  allowAnonymousView: boolean;
  sharedWith: CalendarShare[];
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
    canInvite: boolean;
  };
};

// Calendar share types
export type CalendarShare = {
  email: string;
  role: CalendarRole;
  sharedAt: Date;
  acceptedAt?: Date;
  status: CalendarShareStatus;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
    canInvite: boolean;
  };
};

// Calendar permission types
export type CalendarPermission = {
  userId: string;
  role: CalendarRole;
  grantedAt: Date;
  grantedBy: string;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
    canInvite: boolean;
  };
};

// Calendar event types
export type CalendarEvent = {
  id: string;
  organizationId?: string;
  userId: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  timeZone: TimeZone;
  isAllDay: boolean;
  status: EventStatus;
  visibility: EventVisibility;
  type: EventType;
  category?: EventCategory;
  priority?: EventPriority;
  color?: string;
  attendees: EventAttendee[];
  organizer: EventOrganizer;
  recurrence?: RecurrenceRule;
  reminders: EventReminder[];
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    mimeType: string;
    uploadedBy: string;
    uploadedAt: Date;
  }>;
  meetingUrl?: string;
  meetingPassword?: string;
  customFields: Record<string, any>;
  isGoogleEvent?: boolean;
  googleEventId?: string;
  createdAt: Date;
  updatedAt: Date;
};

// Calendar types
export type Calendar = {
  id: string;
  organizationId?: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  isDefault: boolean;
  isVisible: boolean;
  timeZone: TimeZone;
  settings: CalendarSettings;
  isShared: boolean;
  shareSettings?: CalendarShareSettings;
  createdAt: Date;
  updatedAt: Date;
};

// Input types
export type CreateEventInput = {
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  timeZone?: TimeZone;
  isAllDay?: boolean;
  status?: EventStatus;
  visibility?: EventVisibility;
  type?: EventType;
  category?: EventCategory;
  priority?: EventPriority;
  color?: string;
  attendees?: Array<{
    email: string;
    name?: string;
    role?: AttendeeRole;
    isOptional?: boolean;
  }>;
  recurrence?: RecurrenceRule;
  reminders?: Array<{
    method: ReminderMethod;
    minutes: number;
  }>;
  meetingUrl?: string;
  meetingPassword?: string;
  customFields?: Record<string, any>;
};

export type UpdateEventInput = {
  id: string;
  title?: string;
  description?: string;
  location?: string;
  startTime?: Date;
  endTime?: Date;
  timeZone?: TimeZone;
  isAllDay?: boolean;
  status?: EventStatus;
  visibility?: EventVisibility;
  type?: EventType;
  category?: EventCategory;
  priority?: EventPriority;
  color?: string;
  attendees?: Array<{
    email: string;
    name?: string;
    role?: AttendeeRole;
    isOptional?: boolean;
  }>;
  recurrence?: RecurrenceRule;
  reminders?: Array<{
    method: ReminderMethod;
    minutes: number;
  }>;
  meetingUrl?: string;
  meetingPassword?: string;
  customFields?: Record<string, any>;
};

export type CreateCalendarInput = {
  name: string;
  description?: string;
  color: string;
  isDefault?: boolean;
  isVisible?: boolean;
  timeZone?: TimeZone;
  settings?: Partial<CalendarSettings>;
};

export type UpdateCalendarInput = {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  isDefault?: boolean;
  isVisible?: boolean;
  timeZone?: TimeZone;
  settings?: Partial<CalendarSettings>;
};

export type ShareCalendarInput = {
  calendarId: string;
  email: string;
  role: CalendarRole;
  permissions?: {
    canView?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canShare?: boolean;
    canInvite?: boolean;
  };
};

// Filter types
export type EventFilter = {
  startDate?: Date;
  endDate?: Date;
  status?: EventStatus[];
  type?: EventType[];
  category?: EventCategory[];
  priority?: EventPriority[];
  attendees?: string[];
  organizer?: string;
  search?: string;
  isAllDay?: boolean;
  hasRecurrence?: boolean;
  hasAttachments?: boolean;
  hasMeetingUrl?: boolean;
};

export type CalendarFilter = {
  isDefault?: boolean;
  isVisible?: boolean;
  isShared?: boolean;
  timeZone?: TimeZone;
  search?: string;
  userId?: string;
  organizationId?: string;
};

// Response types
export type EventResponse = {
  success: boolean;
  event?: CalendarEvent;
  message?: string;
  errors?: Record<string, string[]>;
};

export type CalendarResponse = {
  success: boolean;
  calendar?: Calendar;
  message?: string;
  errors?: Record<string, string[]>;
};

export type EventsResponse = {
  success: boolean;
  events: CalendarEvent[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export type CalendarsResponse = {
  success: boolean;
  calendars: Calendar[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

// Sync types
export type GoogleCalendarSync = {
  calendarId: string;
  googleCalendarId: string;
  syncDirection: 'one-way' | 'two-way';
  lastSyncAt?: Date;
  syncToken?: string;
  isEnabled: boolean;
};

export type CalendarSyncSettings = {
  id: string;
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
}; 