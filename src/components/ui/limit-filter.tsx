"use client";

import { useState } from "react";
import { ChevronDown, List } from "lucide-react";
import { Button } from "./button";

interface LimitFilterProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function LimitFilter({ value, onChange, className = "" }: LimitFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const limitOptions = [
    { value: 10, label: '10 per page' },
    { value: 25, label: '25 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' },
  ];

  const selectedOption = limitOptions.find(option => option.value === value);

  const handleSelect = (selectedValue: number) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        color="gray"
        className="px-3 py-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 rounded-lg transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        title={selectedOption?.label || '10 per page'}
      >
        <List className="w-4 h-4 text-slate-500" />
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 min-w-[200px] w-max">
          {limitOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-xs ${
                option.value === value ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
              }`}
              onClick={() => handleSelect(option.value)}
            >
              <List className="w-3 h-3 text-slate-500" />
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
  );
}