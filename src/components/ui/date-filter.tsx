"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "./button";
import type { DateFilterProps } from "~/entities/api/wallet";

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
    { value: 'all' as const, label: 'All Time' },
    { value: 'current-month' as const, label: 'Current Month' },
    { value: 'last-month' as const, label: 'Last Month' },
    { value: 'current-week' as const, label: 'This Week' },
    { value: 'current-day' as const, label: 'Today' },
  ];

  const selectedOption = dateOptions.find(option => option.value === dateFilter);

  const handleSelect = (selectedValue: typeof dateFilter) => {
    onDateFilterChange(selectedValue);
    setIsOpen(false);
    setShowCustomSubmenu(false);
  };

  const handleCustomRangeClick = () => {
    setShowCustomSubmenu(!showCustomSubmenu);
  };

  const handleApplyCustomRange = () => {
    onDateFilterChange('custom');
    setIsOpen(false);
    setShowCustomSubmenu(false);
  };

  const getDateRangeDisplay = () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return null;

    switch (dateFilter) {
      case 'current-day':
        return <span>Showing <span className="font-semibold text-blue-700">today's</span> transactions</span>;
      case 'current-week':
        return (
          <span>
            Showing transactions from{' '}
            <span className="font-semibold text-blue-700">
              {dateRange.startDate.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long'
              })}
            </span>
            {' '}to{' '}
            <span className="font-semibold text-blue-700">
              {dateRange.endDate.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long'
              })}
            </span>
          </span>
        );
      case 'current-month':
        return <span>Showing <span className="font-semibold text-blue-700">this month's</span> transactions</span>;
      case 'last-month':
        return <span>Showing <span className="font-semibold text-blue-700">last month's</span> transactions</span>;
      default:
        return (
          <span>
            Showing transactions from{' '}
            <span className="font-semibold text-blue-700">
              {dateRange.startDate.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            {' '}to{' '}
            <span className="font-semibold text-blue-700">
              {dateRange.endDate.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </span>
        );
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCustomSubmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        color="gray"
        className="px-3 py-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 rounded-lg transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        title={selectedOption?.label || (dateFilter === 'custom' ? 'Custom Range' : 'All Time')}
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

          {/* Custom Range Option with Submenu */}
          <div className="relative">
            <button
              className={`w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs ${
                dateFilter === 'custom' ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
              }`}
              onClick={handleCustomRangeClick}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>Custom Range</span>
              </div>
              <ChevronRight className={`w-3 h-3 transition-transform ${showCustomSubmenu ? 'rotate-90' : ''}`} />
            </button>

            {/* Custom Date Range Submenu */}
            {showCustomSubmenu && (
              <div className="absolute left-full top-0 ml-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 p-4 w-[320px]">
                <div className="space-y-4">
                  <div className="text-sm font-medium text-slate-700">Select Date Range</div>

                  {/* Date Range Display */}
                  {getDateRangeDisplay() && (
                    <div className="text-xs text-slate-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                      {getDateRangeDisplay()}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-600 font-medium">From Date</label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => onCustomStartDateChange(e.target.value)}
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-600 font-medium">To Date</label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => onCustomEndDateChange(e.target.value)}
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleApplyCustomRange}
                      className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => setShowCustomSubmenu(false)}
                      className="px-3 py-1.5 text-xs bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
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