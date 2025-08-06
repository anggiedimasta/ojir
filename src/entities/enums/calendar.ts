// Calendar Enums
export enum EventStatus {
  TENTATIVE = 'tentative',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export enum EventVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  CONFIDENTIAL = 'confidential',
  DEFAULT = 'default'
}

export enum EventType {
  MEETING = 'meeting',
  APPOINTMENT = 'appointment',
  TASK = 'task',
  REMINDER = 'reminder',
  BIRTHDAY = 'birthday',
  HOLIDAY = 'holiday',
  VACATION = 'vacation',
  CONFERENCE = 'conference',
  WORKSHOP = 'workshop',
  OTHER = 'other'
}

export enum AttendeeRole {
  ORGANIZER = 'organizer',
  REQUIRED = 'required',
  OPTIONAL = 'optional',
  RESOURCE = 'resource'
}

export enum AttendeeStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  TENTATIVE = 'tentative',
  NO_RESPONSE = 'no-response'
}

export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export enum ReminderMethod {
  EMAIL = 'email',
  POPUP = 'popup',
  SMS = 'sms',
  PUSH = 'push'
}

export enum CalendarRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export enum CalendarView {
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
  AGENDA = 'agenda',
  LIST = 'list'
}

export enum CalendarShareStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined'
}

export enum WorkingDay {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6
}

export enum EventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum EventCategory {
  WORK = 'work',
  PERSONAL = 'personal',
  FAMILY = 'family',
  HEALTH = 'health',
  EDUCATION = 'education',
  TRAVEL = 'travel',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  FINANCE = 'finance',
  OTHER = 'other'
}

export enum SyncDirection {
  ONE_WAY = 'one-way',
  TWO_WAY = 'two-way'
}

export enum SyncProvider {
  GOOGLE = 'google',
  OUTLOOK = 'outlook',
  APPLE = 'apple',
  OTHER = 'other'
}

export enum ConflictResolution {
  LOCAL_WINS = 'local-wins',
  REMOTE_WINS = 'remote-wins',
  ASK_USER = 'ask-user'
}