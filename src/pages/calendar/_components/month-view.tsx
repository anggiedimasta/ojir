'use client';

import type { CalendarEvent } from "./types";
import { GoogleIcon } from "./google-icon";

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
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 shadow-sm">
      <div className="grid grid-cols-7 border-b border-slate-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="border-r border-slate-200 p-4 text-center text-sm font-semibold text-slate-600"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="min-h-[120px] border-b border-r border-slate-200 p-4 text-center "
          />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const dayNum = index + 1;
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
          const dayEvents = getEventsForDay(date, events);
          return (
            <div
              key={dayNum}
              className="min-h-[120px] border-b border-r border-slate-200 p-4  hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => onDayClick(date)}
            >
              <div className="font-semibold text-slate-900 mb-2">{dayNum}</div>
              <div className="space-y-1.5">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`rounded p-1.5 text-xs flex items-center gap-1.5 ${
                      event.isGoogleEvent
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                    title={`${event.description ?? ""}\n${
                      event.isGoogleEvent ? "(Google Calendar)" : "(Local Calendar)"
                    }`}
                  >
                    {event.isGoogleEvent && <GoogleIcon className="w-3 h-3 flex-shrink-0" />}
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