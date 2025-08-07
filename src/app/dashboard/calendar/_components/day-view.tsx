"use client";

import { useRouter } from "next/navigation";
import { GoogleIcon } from "./google-icon";
import type { CalendarEvent } from "./types";

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

export function DayView({ currentDate, events, onCreateEvent }: DayViewProps) {
	const router = useRouter();

	const handleEventClick = (event: CalendarEvent) => {
		router.push(`/dashboard/calendar/event/${event.id}`);
	};

	const handleKeyDown = (
		event: React.KeyboardEvent,
		calendarEvent: CalendarEvent,
	) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleEventClick(calendarEvent);
		}
	};

	return (
		<div className="space-y-6">
			{/* Day Header */}
			<div className="text-center">
				<h2 className="font-bold text-2xl text-gray-900">
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
						onKeyDown={(e) => handleKeyDown(e, event)}
						aria-label={`View event: ${event.title}`}
						className="group cursor-pointer rounded-lg border border-slate-200 bg-white/80 p-4 transition-all hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<h4 className="font-medium text-gray-900 transition-colors group-hover:text-emerald-600">
									{event.title}
								</h4>
								<p className="text-gray-500 text-sm">
									{new Date(event.startTime).toLocaleTimeString()} -{" "}
									{new Date(event.endTime).toLocaleTimeString()}
								</p>
							</div>
							{event.isGoogleEvent && (
								<div className="flex items-center gap-1.5 rounded-full border bg-gray-100 px-2.5 py-0.5 font-medium text-gray-700 text-xs">
									<GoogleIcon className="h-3 w-3" />
									<span>Google</span>
								</div>
							)}
						</div>
						{event.description && (
							<p className="mt-2 line-clamp-2 text-gray-600 text-sm">
								{event.description}
							</p>
						)}
					</div>
				))}
				{getEventsForDay(currentDate, events).length === 0 && (
					<div className="py-8 text-center text-gray-500">
						No events scheduled for this day
					</div>
				)}
			</div>
		</div>
	);
}
