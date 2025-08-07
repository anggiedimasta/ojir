"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { useToast } from "~/components/ui/use-toast";
import { useSidebarStoreHydrated } from "~/store/sidebar-store";
import { api } from "~/trpc/react";
import { DayView } from "../../../_components/day-view";

export default function DayClient({ date }: { date: string }) {
	const { isCollapsed, hasHydrated } = useSidebarStoreHydrated();
	const { toast } = useToast();
	const router = useRouter();
	const [currentDate, setCurrentDate] = useState<Date | null>(null);

	useEffect(() => {
		const [year, month, day] = date.split("-").map(Number);
		if (year && month && day) {
			const d = new Date(year, month - 1, day);
			d.setHours(0, 0, 0, 0);
			setCurrentDate(d);
		}
	}, [date]);

	const { data: events = [], error } = api.calendar.getByDateRange.useQuery(
		currentDate
			? {
					startDate: new Date(
						currentDate.getFullYear(),
						currentDate.getMonth(),
						currentDate.getDate(),
						0,
						0,
						0,
						0,
					),
					endDate: new Date(
						currentDate.getFullYear(),
						currentDate.getMonth(),
						currentDate.getDate(),
						23,
						59,
						59,
						999,
					),
					includeGoogleEvents: true,
				}
			: {
					startDate: new Date(),
					endDate: new Date(),
					includeGoogleEvents: true,
				},
		{
			enabled: !!currentDate,
		},
	);

	useEffect(() => {
		if (error) {
			toast({
				variant: "destructive",
				title:
					error.data?.code === "UNAUTHORIZED"
						? "Authentication Error"
						: "Error",
				description:
					error.message || "Failed to fetch calendar events. Please try again.",
			});
		}
	}, [error, toast]);

	const navigateToDay = (offset: number) => {
		if (!currentDate) return;
		const next = new Date(currentDate);
		next.setDate(next.getDate() + offset);
		const year = next.getFullYear();
		const month = String(next.getMonth() + 1).padStart(2, "0");
		const day = String(next.getDate()).padStart(2, "0");
		router.push(`/dashboard/calendar/day/${year}-${month}-${day}`);
	};

	if (!currentDate) return null;

	return (
		<div
			className={`transform-gpu transition-all duration-200 ease-out ${isCollapsed ? "pl-20" : "pl-72"}`}
		>
			<div className="mx-auto p-4 sm:p-6 lg:p-8">
				<Card className="p-6">
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Button
								color="gray"
								size="icon"
								rounded="full"
								onClick={() => navigateToDay(-1)}
								aria-label="Previous Day"
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<h2 className="font-semibold text-xl">
								{currentDate.toLocaleDateString("en-US", {
									weekday: "long",
									month: "long",
									day: "numeric",
									year: "numeric",
								})}
							</h2>
							<Button
								color="gray"
								size="icon"
								rounded="full"
								onClick={() => navigateToDay(1)}
								aria-label="Next Day"
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
						<div className="flex items-center gap-2">
							<Button
								color="gray"
								onClick={() => router.push("/dashboard/calendar")}
							>
								Month
							</Button>
							<Button
								color="gray"
								onClick={() => router.push("/dashboard/calendar/week")}
							>
								Week
							</Button>
							<Button color="gray" active>
								Day
							</Button>
						</div>
					</div>

					<DayView
						currentDate={currentDate}
						events={events}
						onCreateEvent={() => {}}
					/>
				</Card>
			</div>
		</div>
	);
}
