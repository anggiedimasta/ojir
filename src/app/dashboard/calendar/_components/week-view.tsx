'use client';

import type { CalendarEvent } from "./types";
import { GoogleIcon } from "./google-icon";

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

export function WeekView({
  currentDate,
  events,
  onDayClick,
}: WeekViewProps) {
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
      <div className="grid grid-cols-7 border-b border-slate-200">
        {getWeekDays(currentDate).map((day) => (
          <div
            key={day.toISOString()}
            className="border-r border-slate-200 p-2 text-center text-sm font-semibold text-slate-600"
          >
            {day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {getWeekDays(currentDate).map((day) => {
          const dayEvents = getEventsForDay(day, events);
          return (
            <div
              key={day.toISOString()}
              className="min-h-[200px] border-b border-r border-slate-200 p-4hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => onDayClick(day)}
            >
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