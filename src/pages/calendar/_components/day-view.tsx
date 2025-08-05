'use client';

import type { CalendarEvent } from "./types";
import { useRouter } from "next/navigation";
import { GoogleIcon } from "./google-icon";

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onCreateEvent?: () => void;
}

const getEventsForDay = (date: Date, events: CalendarEvent[]) => {
  return events.filter((event) => {
    const eventDate = new Date(event.startTime);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });
};

export function DayView({
  currentDate,
  events,
  onCreateEvent,
}: DayViewProps) {
  const router = useRouter();

  const handleEventClick = (event: CalendarEvent) => {
    router.push(`/dashboard/calendar/event/${event.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Day Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {currentDate.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h2>
      </div>

      {/* Day View Events */}
      <div className="space-y-2">
        {getEventsForDay(currentDate, events).map((event) => (
          <div
            key={event.id}
            onClick={() => handleEventClick(event)}
            className="p-4 rounded-lg border border-slate-200 bg-white/80 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">{event.title}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endTime).toLocaleTimeString()}
                </p>
              </div>
              {event.isGoogleEvent && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border">
                  <GoogleIcon className="w-3 h-3" />
                  <span>Google</span>
                </div>
              )}
            </div>
            {event.description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{event.description}</p>
            )}
          </div>
        ))}
        {getEventsForDay(currentDate, events).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No events scheduled for this day
          </div>
        )}
      </div>
    </div>
  );
}