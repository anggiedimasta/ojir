"use client";

import { ChevronDown, List } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";

interface LimitFilterProps {
	value: number;
	onChange: (value: number) => void;
	className?: string;
}

export function LimitFilter({
	value,
	onChange,
	className = "",
}: LimitFilterProps) {
	const [isOpen, setIsOpen] = useState(false);

	const limitOptions = [
		{ value: 10, label: "10 per page" },
		{ value: 25, label: "25 per page" },
		{ value: 50, label: "50 per page" },
		{ value: 100, label: "100 per page" },
	];

	const selectedOption = limitOptions.find((option) => option.value === value);

	const handleSelect = (selectedValue: number) => {
		onChange(selectedValue);
		setIsOpen(false);
	};

	return (
		<div className={`relative ${className}`}>
			<Button
				color="gray"
				className="rounded-lg border-slate-200 bg-white px-3 py-2 text-slate-700 transition-all duration-200 hover:bg-slate-50"
				onClick={() => setIsOpen(!isOpen)}
				title={selectedOption?.label || "10 per page"}
			>
				<List className="h-4 w-4 text-slate-500" />
				<ChevronDown
					className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</Button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="absolute top-full left-0 z-50 mt-1 w-max min-w-[200px] rounded-md border border-slate-200 bg-white shadow-lg">
					{limitOptions.map((option) => (
						<button
							key={option.value}
							className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-slate-50 ${
								option.value === value
									? "bg-blue-50 text-blue-600"
									: "text-slate-700"
							}`}
							onClick={() => handleSelect(option.value)}
						>
							<List className="h-3 w-3 text-slate-500" />
							<span>{option.label}</span>
						</button>
					))}
				</div>
			)}

			{/* Backdrop to close dropdown when clicking outside */}
			{isOpen && (
				<div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
			)}
		</div>
	);
}
