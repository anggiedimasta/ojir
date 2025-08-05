import { trpc } from '../trpc/client';
import type { 
  CreateEventInput, 
  UpdateEventInput, 
  CreateCalendarInput, 
  UpdateCalendarInput,
  ShareCalendarInput 
} from '@/entities/types/calendar';

/**
 * Calendar Mutations
 * Organized collection of all calendar-related tRPC mutations
 */

// Create calendar
export const useCreateCalendar = () => {
  return trpc.calendar.create.useMutation();
};

// Update calendar
export const useUpdateCalendar = () => {
  return trpc.calendar.update.useMutation();
};

// Delete calendar
export const useDeleteCalendar = () => {
  return trpc.calendar.delete.useMutation();
};

// Create event
export const useCreateEvent = () => {
  return trpc.calendar.createEvent.useMutation();
};

// Update event
export const useUpdateEvent = () => {
  return trpc.calendar.updateEvent.useMutation();
};

// Delete event
export const useDeleteEvent = () => {
  return trpc.calendar.deleteEvent.useMutation();
};

// Share calendar
export const useShareCalendar = () => {
  return trpc.calendar.share.useMutation();
};

// Update calendar settings
export const useUpdateCalendarSettings = () => {
  return trpc.calendar.updateSettings.useMutation();
};

// Sync with Google Calendar
export const useSyncGoogleCalendar = () => {
  return trpc.calendar.syncGoogleCalendar.useMutation();
}; 