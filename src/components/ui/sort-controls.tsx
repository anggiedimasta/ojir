"use client";

import { useState } from "react";
import { SortAsc, SortDesc, ChevronDown } from "lucide-react";
import { Button } from "./button";
import type { SortControlsProps } from "~/entities/api/wallet";

export function SortControls({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  options = [
    { value: 'date', label: 'Sort by Date' },
    { value: 'amount', label: 'Sort by Amount' },
    { value: 'recipient', label: 'Sort by Recipient' },
  ]
}: SortControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === sortBy);

  const handleSelect = (selectedValue: 'date' | 'amount' | 'recipient') => {
    onSortByChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="relative">
        <Button
          color="gray"
          className="px-3 py-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 rounded-lg transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
          title={selectedOption?.label || 'Sort by Date'}
        >
          <SortAsc className="w-4 h-4 text-slate-500" />
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

                 {/* Dropdown Menu */}
         {isOpen && (
           <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 min-w-[200px] w-max">
             {options.map((option) => (
               <button
                 key={option.value}
                 className={`w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-xs ${
                   option.value === sortBy ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                 }`}
                 onClick={() => handleSelect(option.value)}
               >
                 <SortAsc className="w-3 h-3 text-slate-500" />
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
      </div>

      <Button
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-200"
        title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
      >
        {sortOrder === 'asc' ? (
          <SortAsc className="w-4 h-4" />
        ) : (
          <SortDesc className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}