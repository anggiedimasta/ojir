"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "./button";
import type { DateFilterProps } from "~/entities/api/wallet";

export function DateFilter({
  dateFilter,
  onDateFilterChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
}: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dateOptions = [
    { value: 'all' as const, label: 'All Time' },
    { value: 'current-month' as const, label: 'Current Month' },
    { value: 'last-month' as const, label: 'Last Month' },
    { value: 'current-week' as const, label: 'This Week' },
    { value: 'current-day' as const, label: 'Today' },
    { value: 'custom' as const, label: 'Custom Range' },
  ];

  const selectedOption = dateOptions.find(option => option.value === dateFilter);

  const handleSelect = (selectedValue: typeof dateFilter) => {
    onDateFilterChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        color="gray"
        className="px-3 py-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 rounded-lg transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        title={selectedOption?.label || 'All Time'}
      >
        <Calendar className="w-4 h-4 text-slate-500" />
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

             {/* Dropdown Menu */}
       {isOpen && (
         <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 min-w-[200px] w-max">
           {dateOptions.map((option) => (
             <button
               key={option.value}
               className={`w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-xs ${
                 option.value === dateFilter ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
               }`}
               onClick={() => handleSelect(option.value)}
             >
               <Calendar className="w-3 h-3 text-slate-500" />
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
        />
      )}

      {/* Custom Date Range Inputs */}
      {dateFilter === 'custom' && (
        <div className="flex gap-2 items-center mt-2">
          <input
            type="date"
            value={customStartDate}
            onChange={(e) => onCustomStartDateChange(e.target.value)}
            className="px-2 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-slate-500 text-xs">to</span>
          <input
            type="date"
            value={customEndDate}
            onChange={(e) => onCustomEndDateChange(e.target.value)}
            className="px-2 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}
    </div>
  );
}