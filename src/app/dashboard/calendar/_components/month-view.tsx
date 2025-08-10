"use client";

import { GoogleIcon } from "./google-icon";
import type { CalendarEvent } from "./types";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  weekDays: string[];
  firstDayOfMonth: number;
  daysInMonth: number;
  onDayClick: (date: Date) => void;
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

export function MonthView({
  currentDate,
  events,
  weekDays,
  firstDayOfMonth,
  daysInMonth,
  onDayClick,
}: MonthViewProps) {
  const handleKeyDown = (event: React.KeyboardEvent, date: Date) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onDayClick(date);
    }
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 shadow-sm">
      <div className="grid grid-cols-7 border-slate-200 border-b">
        {weekDays.map((day) => (
          <div
            key={day}
            className="border-slate-200 border-r p-4 text-center font-semibold text-slate-600 text-sm"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div
            key={`empty-day-${currentDate.getFullYear()}-${currentDate.getMonth()}-${index}`}
            className="min-h-[120px] border-slate-200 border-r border-b p-4 text-center "
          />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const dayNum = index + 1;
          const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            dayNum,
          );
          const dayEvents = getEventsForDay(date, events);
          return (
            <div
              key={dayNum}
              className="min-h-[120px] cursor-pointer border-slate-200 border-r border-b p-4 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => onDayClick(date)}
              onKeyDown={(e) => handleKeyDown(e, date)}
              aria-label={`View events for ${date.toLocaleDateString()}`}
            >
              <div className="mb-2 font-semibold text-slate-900">{dayNum}</div>
              <div className="space-y-1.5">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-center gap-1.5 rounded p-1.5 text-xs ${
                      event.isGoogleEvent
                        ? "border border-blue-200 bg-blue-50 text-blue-700"
                        : "border border-rose-200 bg-rose-50 text-rose-700"
                    }`}
                    title={`${event.description ?? ""}\n${
                      event.isGoogleEvent
                        ? "(Google Calendar)"
                        : "(Local Calendar)"
                    }`}
                  >
                    {event.isGoogleEvent && (
                      <GoogleIcon className="h-3 w-3 flex-shrink-0" />
                    )}
                    <span>{event.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
