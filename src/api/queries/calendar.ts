import { trpc } from '../trpc/client';
import type { EventFilter, CalendarFilter, DateRange } from '@/entities/types/calendar';

/**
 * Calendar Queries
 * Organized collection of all calendar-related tRPC queries
 */

// Get all calendars
export const useCalendars = () => {
  return trpc.calendar.getAll.useQuery();
};

// Get calendar by ID
export const useCalendar = (id: string) => {
  return trpc.calendar.getById.useQuery({ id });
};

// Get events with filters
export const useEvents = (filters: EventFilter) => {
  return trpc.calendar.getEvents.useQuery(filters);
};

// Get event by ID
export const useEvent = (id: string) => {
  return trpc.calendar.getEventById.useQuery({ id });
};

// Get events by date range
export const useEventsByDateRange = (dateRange: DateRange) => {
  return trpc.calendar.getEventsByDateRange.useQuery(dateRange);
};

// Get calendar settings
export const useCalendarSettings = (calendarId: string) => {
  return trpc.calendar.getSettings.useQuery({ calendarId });
};

// Get calendar shares
export const useCalendarShares = (calendarId: string) => {
  return trpc.calendar.getShares.useQuery({ calendarId });
};