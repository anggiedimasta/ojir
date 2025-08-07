"use client";

import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import type { BankFilterType, BankFilterValue } from "~/entities/api/wallet";
import { api } from "~/trpc/react";
import { BankIcon } from "./bank-icon";
import { Button } from "./button";

interface BankFilterProps {
	value: BankFilterValue;
	onChange: (value: BankFilterValue) => void;
	className?: string;
}

export function BankFilter({
	value,
	onChange,
	className = "",
}: BankFilterProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { data: banks, isLoading, error } = api.masterData.getBanks.useQuery();

	// Helper function to map bank codes to valid enum values
	const mapBankCodeToFilterType = (code: string): BankFilterType => {
		const validCodes = ["mandiri", "bca", "bni", "bri", "cimb"];
		if (validCodes.includes(code.toLowerCase())) {
			return code.toLowerCase() as BankFilterType;
		}
		return "other"; // Map unknown codes to 'other'
	};

	// Create options from master data with deduplication
	const bankOptionsMap = new Map<
		string,
		{ value: BankFilterType; label: string; icon: string | null }
	>();

	// Add "All Banks" option
	bankOptionsMap.set("all", { value: "all", label: "All Banks", icon: null });

	// Process banks and deduplicate by filter type
	banks?.forEach((bank) => {
		const filterType = mapBankCodeToFilterType(bank.code);
		const existing = bankOptionsMap.get(filterType);

		if (existing) {
			// If multiple banks map to the same filter type (like "other"),
			// combine their labels or use a generic label
			if (filterType === "other") {
				existing.label = "Other Banks";
			} else {
				// For known banks, keep the first one found
				existing.label = bank.displayName;
				existing.icon = bank.name;
			}
		} else {
			bankOptionsMap.set(filterType, {
				value: filterType,
				label: filterType === "other" ? "Other Banks" : bank.displayName,
				icon: bank.name,
			});
		}
	});

	const bankOptions = Array.from(bankOptionsMap.values());

	// Handle multiple selections
	const isAllSelected = value.includes("all") || value.length === 0;

	const handleSelect = (selectedValue: BankFilterType) => {
		if (selectedValue === "all") {
			onChange(["all"]);
		} else {
			if (isAllSelected) {
				// If "all" was selected, replace with just this value
				onChange([selectedValue]);
			} else {
				// Toggle the selection
				const newSelection = value.includes(selectedValue)
					? value.filter((bank) => bank !== selectedValue)
					: [...value, selectedValue];

				onChange(newSelection.length === 0 ? ["all"] : newSelection);
			}
		}
		setIsOpen(false);
	};

	if (isLoading) {
		return (
			<div className={`relative ${className}`}>
				<Button
					color="gray"
					className="w-full justify-between border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
					disabled
				>
					<span className="flex items-center gap-2">
						<BankIcon bankName="loading" className="h-4 w-4" />
						Loading banks...
					</span>
					<ChevronDown className="h-4 w-4 opacity-50" />
				</Button>
			</div>
		);
	}

	// If no banks are available, show a disabled state
	if (!banks || banks.length === 0) {
		return (
			<div className={`relative ${className}`}>
				<Button
					color="gray"
					className="w-full justify-between border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
					disabled
				>
					<span className="flex items-center gap-2">
						<BankIcon bankName="no-banks" className="h-4 w-4" />
						No banks available
					</span>
					<ChevronDown className="h-4 w-4 opacity-50" />
				</Button>
			</div>
		);
	}

	return (
		<div className={`relative ${className}`}>
			<Button
				color="gray"
				className="rounded-lg border-slate-200 bg-white px-3 py-2 text-slate-700 transition-all duration-200 hover:bg-slate-50"
				onClick={() => setIsOpen(!isOpen)}
				title={
					isAllSelected
						? "All Banks"
						: `${value.length} bank${value.length !== 1 ? "s" : ""} selected`
				}
			>
				{isAllSelected ? (
					<BankIcon bankName="all" className="h-4 w-4" />
				) : value.length === 1 ? (
					<BankIcon
						bankName={
							bankOptions.find((opt) => opt.value === value[0])?.icon || "all"
						}
						className="h-4 w-4"
					/>
				) : (
					<BankIcon bankName="multiple" className="h-4 w-4" />
				)}
				<ChevronDown
					className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</Button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-max min-w-[200px] overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
					{bankOptions.map((option) => {
						const isSelected = value.includes(option.value);
						return (
							<button
								key={option.value}
								className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-slate-50 ${
									isSelected ? "bg-blue-50 text-blue-600" : "text-slate-700"
								}`}
								onClick={() => handleSelect(option.value)}
							>
								<div
									className={`h-3 w-3 rounded border ${isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}
								>
									{isSelected && (
										<svg
											className="mx-auto mt-0.5 h-2 w-2 text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									)}
								</div>
								{option.icon ? (
									<BankIcon bankName={option.icon} className="h-3 w-3" />
								) : (
									<BankIcon bankName="all" className="h-3 w-3" />
								)}
								<span>{option.label}</span>
							</button>
						);
					})}
				</div>
			)}

			{/* Backdrop to close dropdown when clicking outside */}
			{isOpen && (
				<div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
			)}
		</div>
	);
}
