import type {
  CalendarEvent,
  EventStatus,
  EventVisibility,
  EventAttendee,
  EventOrganizer
} from '~/entities/calendar';
import type { GoogleCalendarReminders, GoogleCalendarAttendee, GoogleCalendarPerson } from '~/entities/integration';

// API Response Types for Calendar
export interface CalendarEventResponse {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  isGoogleEvent: boolean;
  // Additional Google Calendar fields (for Google events only)
  status?: EventStatus;
  location?: string;
  attendees?: GoogleCalendarAttendee[];
  creator?: GoogleCalendarPerson;
  organizer?: GoogleCalendarPerson;
  htmlLink?: string;
  reminders?: GoogleCalendarReminders;
  visibility?: EventVisibility;
}

// Enhanced Google Calendar Event with all fields
export interface GoogleCalendarEventResponse extends CalendarEventResponse {
  isGoogleEvent: true;
  status: EventStatus;
  attendees?: GoogleCalendarAttendee[];
  creator: GoogleCalendarPerson;
  organizer: GoogleCalendarPerson;
  htmlLink: string;
  reminders: GoogleCalendarReminders;
  visibility: EventVisibility;
}

// Input types for API requests
export interface DateRangeInput {
  startDate: Date;
  endDate: Date;
}

// Calendar API Input types for tRPC procedures
export interface CreateCalendarEventInput {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
}

export interface UpdateCalendarEventInput {
  id: string;
  title?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface GetCalendarEventsInput extends DateRangeInput {
  includeGoogleEvents?: boolean;
}

export interface DeleteCalendarEventInput {
  id: string;
}

// Google Calendar specific API types
export interface GoogleCalendarSyncInput {
  forceSync?: boolean;
  calendarId?: string;
}

export interface GoogleCalendarEventInput {
  googleEventId: string;
  action: 'import' | 'sync' | 'remove';
}