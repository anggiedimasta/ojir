"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useSidebarStoreHydrated } from "~/store/sidebar-store";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Card } from "~/components/ui/card";
import { useToast } from "~/components/ui/use-toast";
import { MonthView } from "./_components/month-view";
import { WeekView } from "./_components/week-view";
import { DayView } from "./_components/day-view";
import { type CalendarView } from "~/app/dashboard/calendar/_components/types";

export default function CalendarPage() {
  const { isCollapsed, hasHydrated } = useSidebarStoreHydrated();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  // Get view and date from URL path
  const pathParts = pathname.split('/');
  const currentView = pathname === '/dashboard/calendar' ? 'month' : (pathParts[3] as CalendarView);
  const dateFromUrl = pathParts[4];

  const parseDateFromUrl = (dateStr: string) => {
    const parts = dateStr.split('-').map(Number);
    if (parts.length === 3 && parts.every(part => !isNaN(part))) {
      // We know these are numbers because of the every() check above
      const year = parts[0] as number;
      const month = parts[1] as number;
      const day = parts[2] as number;
      return new Date(year, month - 1, day);
    }
    return new Date();
  };

  // Initialize currentDate from URL or use today's date
  const [currentDate, setCurrentDate] = useState(() => {
    if (dateFromUrl) {
      return parseDateFromUrl(dateFromUrl);
    }
    return new Date();
  });

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Update currentDate if URL changes
  useEffect(() => {
    if (dateFromUrl) {
      const newDate = parseDateFromUrl(dateFromUrl);
      if (!isNaN(newDate.getTime())) {
        setCurrentDate(newDate);
      }
    }
  }, [dateFromUrl]);

  // Calculate date range based on current view
  const getDateRange = () => {
    if (currentView === 'day') {
      return {
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
      };
    }
    return {
      startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    };
  };

  const { startDate, endDate } = getDateRange();

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
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const updateView = (newView: CalendarView) => {
    if (newView === 'month') {
      router.push('/dashboard/calendar');
    } else if (newView === 'day') {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      router.push(`/dashboard/calendar/${newView}/${dateStr}`);
    } else {
      router.push(`/dashboard/calendar/${newView}`);
    }
  };

  if (!hasMounted || !hasHydrated) return null;

  return (
    <div className={`transition-all duration-200 ease-out transform-gpu ${isCollapsed ? 'pl-20' : 'pl-72'}`}>
      <div className="mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="p-6">
          {/* Calendar Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                              <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={isMonth ? prevMonth : isWeek ? prevWeek : prevDay}
                  aria-label={isMonth ? 'Previous Month' : isWeek ? 'Previous Week' : 'Previous Day'}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              <h2 className="text-xl font-semibold">
                {isMonth ? formatDate(currentDate) : isWeek ? formatWeek(currentDate) : formatDay(currentDate)}
              </h2>
                              <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={isMonth ? nextMonth : isWeek ? nextWeek : nextDay}
                  aria-label={isMonth ? 'Next Month' : isWeek ? 'Next Week' : 'Next Day'}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex items-center gap-2">
                              <Button
                  variant={currentView === 'month' ? 'secondary' : 'outline'}
                  onClick={() => updateView('month')}
                >
                  Month
                </Button>
                <Button
                  variant={currentView === 'week' ? 'secondary' : 'outline'}
                  onClick={() => updateView('week')}
                >
                  Week
                </Button>
                <Button
                  variant={currentView === 'day' ? 'secondary' : 'outline'}
                  onClick={() => updateView('day')}
                >
                  Day
                </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          {isMonth ? (
            <MonthView
              currentDate={currentDate}
              events={events}
              weekDays={weekDays}
              firstDayOfMonth={firstDayOfMonth}
              daysInMonth={daysInMonth}
              onDayClick={(date) => {
                // Create date string in YYYY-MM-DD format to avoid timezone issues
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;

                setCurrentDate(date);
                router.push(`/dashboard/calendar/day/${dateStr}`);
              }}
            />
          ) : isWeek ? (
            <WeekView
              currentDate={currentDate}
              events={events}
              onDayClick={(date) => {
                // Create date string in YYYY-MM-DD format to avoid timezone issues
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;

                setCurrentDate(date);
                router.push(`/dashboard/calendar/day/${dateStr}`);
              }}
            />
          ) : (
            <DayView
              currentDate={currentDate}
              events={events}
              onCreateEvent={() => {
                // TODO: Implement create event functionality
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
}