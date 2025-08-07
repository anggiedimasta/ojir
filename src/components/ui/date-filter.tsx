"use client";

import { Calendar, ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { DateFilterProps } from "~/entities/api/wallet";
import { Button } from "./button";

interface ExtendedDateFilterProps extends DateFilterProps {
	dateRange?: { startDate?: Date; endDate?: Date };
}

export function DateFilter({
	dateFilter,
	onDateFilterChange,
	customStartDate,
	customEndDate,
	onCustomStartDateChange,
	onCustomEndDateChange,
	dateRange,
}: ExtendedDateFilterProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [showCustomSubmenu, setShowCustomSubmenu] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const dateOptions = [
		{ value: "all" as const, label: "All Time" },
		{ value: "current-month" as const, label: "Current Month" },
		{ value: "last-month" as const, label: "Last Month" },
		{ value: "current-week" as const, label: "This Week" },
		{ value: "current-day" as const, label: "Today" },
	];

	const selectedOption = dateOptions.find(
		(option) => option.value === dateFilter,
	);

	const handleSelect = (selectedValue: typeof dateFilter) => {
		onDateFilterChange(selectedValue);
		setIsOpen(false);
		setShowCustomSubmenu(false);
	};

	const handleCustomRangeClick = () => {
		setShowCustomSubmenu(!showCustomSubmenu);
	};

	const handleApplyCustomRange = () => {
		onDateFilterChange("custom");
		setIsOpen(false);
		setShowCustomSubmenu(false);
	};

	const getDateRangeDisplay = () => {
		if (!dateRange?.startDate || !dateRange?.endDate) return null;

		switch (dateFilter) {
			case "current-day":
				return (
					<span>
						Showing <span className="font-semibold text-blue-700">today's</span>{" "}
						transactions
					</span>
				);
			case "current-week":
				return (
					<span>
						Showing transactions from{" "}
						<span className="font-semibold text-blue-700">
							{dateRange.startDate.toLocaleDateString("id-ID", {
								day: "numeric",
								month: "long",
							})}
						</span>{" "}
						to{" "}
						<span className="font-semibold text-blue-700">
							{dateRange.endDate.toLocaleDateString("id-ID", {
								day: "numeric",
								month: "long",
							})}
						</span>
					</span>
				);
			case "current-month":
				return (
					<span>
						Showing{" "}
						<span className="font-semibold text-blue-700">this month's</span>{" "}
						transactions
					</span>
				);
			case "last-month":
				return (
					<span>
						Showing{" "}
						<span className="font-semibold text-blue-700">last month's</span>{" "}
						transactions
					</span>
				);
			default:
				return (
					<span>
						Showing transactions from{" "}
						<span className="font-semibold text-blue-700">
							{dateRange.startDate.toLocaleDateString("id-ID", {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						</span>{" "}
						to{" "}
						<span className="font-semibold text-blue-700">
							{dateRange.endDate.toLocaleDateString("id-ID", {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						</span>
					</span>
				);
		}
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
				setShowCustomSubmenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			<Button
				color="gray"
				className="rounded-lg border-slate-200 bg-white px-3 py-2 text-slate-700 transition-all duration-200 hover:bg-slate-50"
				onClick={() => setIsOpen(!isOpen)}
				title={
					selectedOption?.label ||
					(dateFilter === "custom" ? "Custom Range" : "All Time")
				}
			>
				<Calendar className="h-4 w-4 text-slate-500" />
				<ChevronDown
					className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</Button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="absolute top-full left-0 z-50 mt-1 w-max min-w-[200px] rounded-md border border-slate-200 bg-white shadow-lg">
					{dateOptions.map((option) => (
						<button
							key={option.value}
							className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-slate-50 ${
								option.value === dateFilter
									? "bg-blue-50 text-blue-600"
									: "text-slate-700"
							}`}
							onClick={() => handleSelect(option.value)}
						>
							<Calendar className="h-3 w-3 text-slate-500" />
							<span>{option.label}</span>
						</button>
					))}

					{/* Custom Range Option with Submenu */}
					<div className="relative">
						<button
							className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-slate-50 ${
								dateFilter === "custom"
									? "bg-blue-50 text-blue-600"
									: "text-slate-700"
							}`}
							onClick={handleCustomRangeClick}
						>
							<div className="flex items-center gap-2">
								<Calendar className="h-3 w-3 text-slate-500" />
								<span>Custom Range</span>
							</div>
							<ChevronRight
								className={`h-3 w-3 transition-transform ${showCustomSubmenu ? "rotate-90" : ""}`}
							/>
						</button>

						{/* Custom Date Range Submenu */}
						{showCustomSubmenu && (
							<div className="absolute top-0 left-full z-50 ml-1 w-[320px] rounded-md border border-slate-200 bg-white p-4 shadow-lg">
								<div className="space-y-4">
									<div className="font-medium text-slate-700 text-sm">
										Select Date Range
									</div>

									{/* Date Range Display */}
									{getDateRangeDisplay() && (
										<div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-slate-600 text-xs">
											{getDateRangeDisplay()}
										</div>
									)}

									<div className="space-y-3">
										<div className="space-y-2">
											<label className="font-medium text-slate-600 text-xs">
												From Date
											</label>
											<input
												type="date"
												value={customStartDate}
												onChange={(e) =>
													onCustomStartDateChange(e.target.value)
												}
												className="w-full rounded-lg border border-slate-300 px-2 py-2 text-xs focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>

										<div className="space-y-2">
											<label className="font-medium text-slate-600 text-xs">
												To Date
											</label>
											<input
												type="date"
												value={customEndDate}
												onChange={(e) => onCustomEndDateChange(e.target.value)}
												className="w-full rounded-lg border border-slate-300 px-2 py-2 text-xs focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>
									</div>

									<div className="flex gap-2 pt-2">
										<button
											onClick={handleApplyCustomRange}
											className="rounded-md bg-blue-600 px-3 py-1.5 text-white text-xs transition-colors hover:bg-blue-700"
										>
											Apply
										</button>
										<button
											onClick={() => setShowCustomSubmenu(false)}
											className="rounded-md bg-slate-200 px-3 py-1.5 text-slate-700 text-xs transition-colors hover:bg-slate-300"
										>
											Cancel
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
