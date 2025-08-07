import type { CalendarEventResponse } from "~/entities/api/calendar";

// Use the API response type for calendar components since that's what we actually get from tRPC
export type CalendarEvent = CalendarEventResponse;

// UI-specific types that are only used in calendar components
export type CalendarView = "month" | "week" | "day";

// Component-specific types for calendar views
export interface CalendarViewProps {
	currentDate: Date;
	events: CalendarEvent[];
	onDateChange: (date: Date) => void;
	onEventClick?: (event: CalendarEvent) => void;
}

export interface CalendarEventDisplayProps {
	event: CalendarEvent;
	compact?: boolean;
	showTime?: boolean;
	onClick?: () => void;
}
