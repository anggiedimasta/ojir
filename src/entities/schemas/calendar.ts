import { z } from "zod";

// Calendar Schemas
export const EventStatusSchema = z.enum(['tentative', 'confirmed', 'cancelled']);

export const EventVisibilitySchema = z.enum(['public', 'private', 'confidential', 'default']);

export const EventTypeSchema = z.enum([
  'meeting',
  'appointment',
  'task',
  'reminder',
  'birthday',
  'holiday',
  'vacation',
  'conference',
  'workshop',
  'other'
]);

export const AttendeeRoleSchema = z.enum(['organizer', 'required', 'optional', 'resource']);

export const AttendeeStatusSchema = z.enum(['pending', 'accepted', 'declined', 'tentative', 'no-response']);

export const RecurrenceFrequencySchema = z.enum(['daily', 'weekly', 'monthly', 'yearly']);

export const ReminderMethodSchema = z.enum(['email', 'popup', 'sms', 'push']);

export const CalendarRoleSchema = z.enum(['owner', 'admin', 'editor', 'viewer']);

export const CalendarViewSchema = z.enum(['month', 'week', 'day', 'agenda', 'list']);

export const CalendarShareStatusSchema = z.enum(['pending', 'accepted', 'declined']);

export const WorkingDaySchema = z.enum(['0', '1', '2', '3', '4', '5', '6']);

export const EventPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export const EventCategorySchema = z.enum([
  'work',
  'personal',
  'family',
  'health',
  'education',
  'travel',
  'entertainment',
  'shopping',
  'finance',
  'other'
]);

export const TimeZoneSchema = z.string();

export const CalendarDateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

export const TimeRangeSchema = z.object({
  startTime: z.string(), // HH:mm format
  endTime: z.string(), // HH:mm format
});

export const WorkingHoursSchema = z.object({
  start: z.string(), // HH:mm format
  end: z.string(), // HH:mm format
});

export const RecurrenceRuleSchema = z.object({
  frequency: RecurrenceFrequencySchema,
  interval: z.number(),
  count: z.number().optional(),
  until: z.date().optional(),
  byWeekDay: z.array(z.number()).optional(),
  byMonthDay: z.array(z.number()).optional(),
  byMonth: z.array(z.number()).optional(),
  exceptions: z.array(z.date()).optional(),
});

export const EventReminderSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  method: ReminderMethodSchema,
  minutes: z.number(),
  isEnabled: z.boolean(),
});

export const EventOrganizerSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  userId: z.string().optional(),
});

export const EventAttendeeSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: AttendeeRoleSchema,
  status: AttendeeStatusSchema,
  isOptional: z.boolean(),
  responseTime: z.date().optional(),
  comment: z.string().optional(),
});

export const EventAttachmentSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  url: z.string().url(),
  size: z.number(),
  mimeType: z.string(),
  uploadedBy: z.string(),
  uploadedAt: z.date(),
});

export const CalendarSettingsSchema = z.object({
  defaultEventDuration: z.number(),
  workingHours: WorkingHoursSchema,
  workingDays: z.array(WorkingDaySchema),
  showWeekends: z.boolean(),
  defaultView: CalendarViewSchema,
  showDeclined: z.boolean(),
  showWeekNumbers: z.boolean(),
  timeZone: TimeZoneSchema,
  firstDayOfWeek: WorkingDaySchema,
  businessHours: WorkingHoursSchema,
  slotDuration: z.number(),
  slotMinTime: z.string(),
  slotMaxTime: z.string(),
  allDaySlot: z.boolean(),
  allDayText: z.string(),
  noEventsMessage: z.string(),
  eventLimit: z.number(),
  eventLimitText: z.string(),
  dayPopoverFormat: z.string(),
  eventTimeFormat: z.object({
    hour: z.enum(['numeric', '2-digit']),
    minute: z.enum(['numeric', '2-digit']),
    meridiem: z.boolean(),
  }),
  titleFormat: z.object({
    month: z.string(),
    week: z.string(),
    day: z.string(),
  }),
  columnFormat: z.object({
    month: z.string(),
    week: z.string(),
    day: z.string(),
  }),
});

export const CalendarPermissionsSchema = z.object({
  canView: z.boolean(),
  canEdit: z.boolean(),
  canDelete: z.boolean(),
  canShare: z.boolean(),
  canInvite: z.boolean(),
});

export const CalendarShareSettingsSchema = z.object({
  isPublic: z.boolean(),
  publicUrl: z.string().url().optional(),
  allowAnonymousView: z.boolean(),
  sharedWith: z.array(z.lazy(() => CalendarShareSchema)),
  permissions: CalendarPermissionsSchema,
});

export const CalendarShareSchema = z.object({
  id: z.string(),
  calendarId: z.string(),
  email: z.string().email(),
  role: CalendarRoleSchema,
  sharedAt: z.date(),
  acceptedAt: z.date().optional(),
  status: CalendarShareStatusSchema,
  permissions: CalendarPermissionsSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CalendarPermissionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  role: CalendarRoleSchema,
  grantedAt: z.date(),
  grantedBy: z.string(),
  permissions: CalendarPermissionsSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CalendarEventSchema = z.object({
  id: z.string(),
  organizationId: z.string().optional(),
  userId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  startTime: z.date(),
  endTime: z.date(),
  timeZone: TimeZoneSchema,
  isAllDay: z.boolean(),
  status: EventStatusSchema,
  visibility: EventVisibilitySchema,
  type: EventTypeSchema,
  category: EventCategorySchema.optional(),
  priority: EventPrioritySchema.optional(),
  color: z.string().optional(),
  attendees: z.array(EventAttendeeSchema),
  organizer: EventOrganizerSchema,
  recurrence: RecurrenceRuleSchema.optional(),
  reminders: z.array(EventReminderSchema),
  attachments: z.array(EventAttachmentSchema),
  meetingUrl: z.string().url().optional(),
  meetingPassword: z.string().optional(),
  customFields: z.record(z.any()),
  isGoogleEvent: z.boolean().optional(),
  googleEventId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CalendarSchema = z.object({
  id: z.string(),
  organizationId: z.string().optional(),
  userId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  color: z.string(),
  isDefault: z.boolean(),
  isVisible: z.boolean(),
  timeZone: TimeZoneSchema,
  settings: CalendarSettingsSchema,
  isShared: z.boolean(),
  shareSettings: CalendarShareSettingsSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input schemas
export const CreateEventInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  startTime: z.date(),
  endTime: z.date(),
  timeZone: TimeZoneSchema.optional(),
  isAllDay: z.boolean().optional(),
  status: EventStatusSchema.optional(),
  visibility: EventVisibilitySchema.optional(),
  type: EventTypeSchema.optional(),
  category: EventCategorySchema.optional(),
  priority: EventPrioritySchema.optional(),
  color: z.string().optional(),
  attendees: z.array(z.object({
    email: z.string().email(),
    name: z.string().optional(),
    role: AttendeeRoleSchema.optional(),
    isOptional: z.boolean().optional(),
  })).optional(),
  recurrence: RecurrenceRuleSchema.optional(),
  reminders: z.array(z.object({
    method: ReminderMethodSchema,
    minutes: z.number(),
  })).optional(),
  meetingUrl: z.string().url().optional(),
  meetingPassword: z.string().optional(),
  customFields: z.record(z.any()).optional(),
});

export const UpdateEventInputSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  timeZone: TimeZoneSchema.optional(),
  isAllDay: z.boolean().optional(),
  status: EventStatusSchema.optional(),
  visibility: EventVisibilitySchema.optional(),
  type: EventTypeSchema.optional(),
  category: EventCategorySchema.optional(),
  priority: EventPrioritySchema.optional(),
  color: z.string().optional(),
  attendees: z.array(z.object({
    email: z.string().email(),
    name: z.string().optional(),
    role: AttendeeRoleSchema.optional(),
    isOptional: z.boolean().optional(),
  })).optional(),
  recurrence: RecurrenceRuleSchema.optional(),
  reminders: z.array(z.object({
    method: ReminderMethodSchema,
    minutes: z.number(),
  })).optional(),
  meetingUrl: z.string().url().optional(),
  meetingPassword: z.string().optional(),
  customFields: z.record(z.any()).optional(),
});

export const CreateCalendarInputSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  color: z.string(),
  isDefault: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  timeZone: TimeZoneSchema.optional(),
  settings: CalendarSettingsSchema.partial().optional(),
});

export const UpdateCalendarInputSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  timeZone: TimeZoneSchema.optional(),
  settings: CalendarSettingsSchema.partial().optional(),
});

export const ShareCalendarInputSchema = z.object({
  calendarId: z.string(),
  email: z.string().email(),
  role: CalendarRoleSchema,
  permissions: CalendarPermissionsSchema.partial().optional(),
});

// Filter schemas
export const EventFilterSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.array(EventStatusSchema).optional(),
  type: z.array(EventTypeSchema).optional(),
  category: z.array(EventCategorySchema).optional(),
  priority: z.array(EventPrioritySchema).optional(),
  attendees: z.array(z.string()).optional(),
  organizer: z.string().optional(),
  search: z.string().optional(),
  isAllDay: z.boolean().optional(),
  hasRecurrence: z.boolean().optional(),
  hasAttachments: z.boolean().optional(),
  hasMeetingUrl: z.boolean().optional(),
});

export const CalendarFilterSchema = z.object({
  isDefault: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  isShared: z.boolean().optional(),
  timeZone: TimeZoneSchema.optional(),
  search: z.string().optional(),
  userId: z.string().optional(),
  organizationId: z.string().optional(),
});

// Response schemas
export const EventResponseSchema = z.object({
  success: z.boolean(),
  event: CalendarEventSchema.optional(),
  message: z.string().optional(),
  errors: z.record(z.array(z.string())).optional(),
});

export const CalendarResponseSchema = z.object({
  success: z.boolean(),
  calendar: CalendarSchema.optional(),
  message: z.string().optional(),
  errors: z.record(z.array(z.string())).optional(),
});

export const EventsResponseSchema = z.object({
  success: z.boolean(),
  events: z.array(CalendarEventSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
  message: z.string().optional(),
  errors: z.record(z.array(z.string())).optional(),
});

export const CalendarsResponseSchema = z.object({
  success: z.boolean(),
  calendars: z.array(CalendarSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
  message: z.string().optional(),
  errors: z.record(z.array(z.string())).optional(),
});

// Sync schemas
export const GoogleCalendarSyncSchema = z.object({
  id: z.string(),
  calendarId: z.string(),
  googleCalendarId: z.string(),
  syncDirection: z.enum(['one-way', 'two-way']),
  lastSyncAt: z.date().optional(),
  syncToken: z.string().optional(),
  isEnabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CalendarSyncSettingsSchema = z.object({
  id: z.string(),
  calendarId: z.string(),
  provider: z.enum(['google', 'outlook', 'apple', 'other']),
  providerCalendarId: z.string(),
  syncDirection: z.enum(['one-way', 'two-way']),
  lastSyncAt: z.date().optional(),
  syncToken: z.string().optional(),
  isEnabled: z.boolean(),
  settings: z.object({
    syncEvents: z.boolean(),
    syncAttendees: z.boolean(),
    syncReminders: z.boolean(),
    syncAttachments: z.boolean(),
    conflictResolution: z.enum(['local-wins', 'remote-wins', 'ask-user']),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});