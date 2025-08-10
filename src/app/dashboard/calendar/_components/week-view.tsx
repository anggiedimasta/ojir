"use client";

import { GoogleIcon } from "./google-icon";
import type { CalendarEvent } from "./types";

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
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

export function WeekView({ currentDate, events, onDayClick }: WeekViewProps) {
  const handleKeyDown = (event: React.KeyboardEvent, date: Date) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onDayClick(date);
    }
  };
  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startOfWeek);
      weekDay.setDate(startOfWeek.getDate() + i);
      weekDays.push(weekDay);
    }
    return weekDays;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 shadow-sm">
      <div className="grid grid-cols-7 border-slate-200 border-b">
        {getWeekDays(currentDate).map((day) => (
          <div
            key={day.toISOString()}
            className="border-slate-200 border-r p-2 text-center font-semibold text-slate-600 text-sm"
          >
            {day.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {getWeekDays(currentDate).map((day) => {
          const dayEvents = getEventsForDay(day, events);
          return (
            <div
              key={day.toISOString()}
              className="min-h-[200px] cursor-pointer border-slate-200 border-r border-b p-4 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => onDayClick(day)}
              onKeyDown={(e) => handleKeyDown(e, day)}
              aria-label={`View events for ${day.toLocaleDateString()}`}
            >
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
