"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useSidebarStore } from "~/store/sidebar-store";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Card } from "~/components/ui/card";
import { useToast } from "~/components/ui/use-toast";
import { type TRPCClientError } from "@trpc/client";
import { type UseQueryOptions } from "@tanstack/react-query";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  isGoogleEvent?: boolean;
}

type CalendarView = 'month' | 'week' | 'day';

export default function CalendarPage() {
  const { isCollapsed } = useSidebarStore();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Get view from URL path or default to 'month'
  const currentView = pathname === '/dashboard/calendar' ? 'month' : (pathname.split('/').pop() as CalendarView);

  const updateView = (newView: CalendarView) => {
    if (newView === 'month') {
      router.push('/dashboard/calendar');
    } else {
      router.push(`/dashboard/calendar/${newView}`);
    }
  };

  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const { data: events = [], error } = api.calendar.getByDateRange.useQuery({
    startDate,
    endDate,
    includeGoogleEvents: true,
  });

  useEffect(() => {
    if (error) {
      if (error.data?.code === "UNAUTHORIZED") {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: error.message || "Your Google Calendar session has expired. Please sign in again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch calendar events. Please try again.",
        });
      }
    }
  }, [error, toast]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  const nextWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const prevDay = () => {
    setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
  };

  const nextDay = () => {
    setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      );
    });
  };

  const getWeekDays = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    const weekStart = new Date(date.setDate(diff));
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      weekDays.push(d);
    }
    return weekDays;
  };

  const isMonth = currentView === 'month';
  const isWeek = currentView === 'week';
  const isDay = currentView === 'day';

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatWeek = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (!hasMounted) return null;

  return (
    <div className={`transition-all duration-200 ease-out transform-gpu ${isCollapsed ? 'pl-20' : 'pl-72'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="p-6">
          {/* Calendar Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                color="gray"
                size="icon"
                rounded="full"
                onClick={isMonth ? prevMonth : isWeek ? prevWeek : prevDay}
                aria-label={isMonth ? 'Previous Month' : isWeek ? 'Previous Week' : 'Previous Day'}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {isMonth ? formatDate(currentDate) : isWeek ? formatWeek(currentDate) : formatDay(currentDate)}
              </h2>
              <Button
                color="gray"
                size="icon"
                rounded="full"
                onClick={isMonth ? nextMonth : isWeek ? nextWeek : nextDay}
                aria-label={isMonth ? 'Next Month' : isWeek ? 'Next Week' : 'Next Day'}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                color="gray"
                active={currentView === 'month'}
                onClick={() => updateView('month')}
              >
                Month
              </Button>
              <Button
                color="gray"
                active={currentView === 'week'}
                onClick={() => updateView('week')}
              >
                Week
              </Button>
              <Button
                color="gray"
                active={currentView === 'day'}
                onClick={() => updateView('day')}
              >
                Day
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          {isMonth ? (
            <div className="grid grid-cols-1 gap-6" style={{ contain: 'layout', willChange: 'transform' }}>
              <div className="col-span-1">
                <div className="rounded-xl border border-slate-200 bg-white/80 shadow-sm">
                  <div className="grid grid-cols-7 border-b border-slate-200">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="border-r border-slate-200 p-2 text-center text-sm font-semibold text-slate-600 last:border-r-0"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="min-h-[120px] border-b border-r border-slate-200 p-4 text-center last:border-r-0"
                      />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                      const dayNum = index + 1;
                      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
                      const dayEvents = getEventsForDay(date);
                      return (
                        <div
                          key={dayNum}
                          className="min-h-[120px] border-b border-r border-slate-200 p-4 last:border-r-0 hover:bg-slate-50 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedDay(date);
                            updateView('day');
                          }}
                        >
                          <div className="font-semibold text-slate-900 mb-2">{dayNum}</div>
                          <div className="space-y-1.5">
                            {dayEvents.map((event) => (
                              <div
                                key={event.id}
                                className={`rounded p-1.5 text-xs ${
                                  event.isGoogleEvent
                                    ? "bg-blue-50 text-blue-600"
                                    : "bg-rose-50 text-rose-600"
                                }`}
                                title={`${event.description ?? ""}\n${
                                  event.isGoogleEvent ? "(Google Calendar)" : "(Local Calendar)"
                                }`}
                              >
                                {event.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : isDay ? (
            <div className="grid grid-cols-1 gap-6" style={{ contain: 'layout', willChange: 'transform' }}>
              {/* Day Events */}
              <div className="col-span-1">
                <div className="rounded-xl border border-slate-200 bg-white/80 shadow-sm p-6 min-h-[200px]">
                  <h3 className="text-lg font-semibold mb-4">Events</h3>
                  <div className="space-y-2">
                    {getEventsForDay(selectedDay).length === 0 ? (
                      <div className="text-slate-500">No events for this day.</div>
                    ) : (
                      getEventsForDay(selectedDay)
                        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                        .map((event) => (
                          <div
                            key={event.id}
                            className={`rounded p-3 text-sm flex flex-col gap-1 border ${
                              event.isGoogleEvent
                                ? "bg-blue-50 text-blue-600 border-blue-200"
                                : "bg-rose-50 text-rose-600 border-rose-200"
                            }`}
                          >
                            <span className="font-semibold">{event.title}</span>
                            <span className="text-xs">
                              {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {event.endTime &&
                                ` - ${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                            </span>
                            {event.description && <span className="text-xs text-slate-500">{event.description}</span>}
                            <span className="text-xs">
                              {event.isGoogleEvent ? "(Google Calendar)" : "(Local Calendar)"}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6" style={{ contain: 'layout', willChange: 'transform' }}>
              {/* Week Grid */}
              <div className="col-span-1">
                <div className="rounded-xl border border-slate-200 bg-white/80 shadow-sm">
                  <div className="grid grid-cols-7 border-b border-slate-200">
                    {getWeekDays(selectedDay).map((day) => (
                      <div
                        key={day.toISOString()}
                        className="border-r border-slate-200 p-2 text-center text-sm font-semibold text-slate-600 last:border-r-0"
                      >
                        {day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {getWeekDays(selectedDay).map((day) => {
                      const dayEvents = getEventsForDay(day);
                      return (
                        <div
                          key={day.toISOString()}
                          className="min-h-[200px] border-b border-r border-slate-200 p-4 last:border-r-0 hover:bg-slate-50 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedDay(day);
                            updateView('day');
                          }}
                        >
                          <div className="space-y-1.5">
                            {dayEvents.map((event) => (
                              <div
                                key={event.id}
                                className={`rounded p-1.5 text-xs ${
                                  event.isGoogleEvent
                                    ? "bg-blue-50 text-blue-600"
                                    : "bg-rose-50 text-rose-600"
                                }`}
                                title={`${event.description ?? ""}\n${
                                  event.isGoogleEvent ? "(Google Calendar)" : "(Local Calendar)"
                                }`}
                              >
                                {event.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}