"use client";

import { ChevronDown, SortAsc, SortDesc } from "lucide-react";
import { useState } from "react";
import type { SortControlsProps } from "~/entities/api/wallet";
import { Button } from "./button";

export function SortControls({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  options = [
    { value: "date", label: "Sort by Date" },
    { value: "amount", label: "Sort by Amount" },
    { value: "recipient", label: "Sort by Recipient" },
  ],
}: SortControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === sortBy);

  const handleSelect = (selectedValue: "date" | "amount" | "recipient") => {
    onSortByChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Button
          color="gray"
          className="rounded-lg border-slate-200 bg-white px-3 py-2 text-slate-700 transition-all duration-200 hover:bg-slate-50"
          onClick={() => setIsOpen(!isOpen)}
          title={selectedOption?.label || "Sort by Date"}
        >
          <SortAsc className="h-4 w-4 text-slate-500" />
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-1 w-max min-w-[200px] rounded-md border border-slate-200 bg-white shadow-lg">
            {options.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-slate-50 ${
                  option.value === sortBy
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700"
                }`}
                onClick={() => handleSelect(option.value)}
              >
                <SortAsc className="h-3 w-3 text-slate-500" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Backdrop to close dropdown when clicking outside */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close dropdown"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsOpen(false);
              }
            }}
          />
        )}
      </div>

      <Button
        onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
        className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 transition-all duration-200 hover:bg-slate-200"
        title={sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
      >
        {sortOrder === "asc" ? (
          <SortAsc className="h-4 w-4" />
        ) : (
          <SortDesc className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
