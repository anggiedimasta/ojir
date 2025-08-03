import { Calendar } from "lucide-react";
import type { DateFilterProps } from "~/entities/api/wallet";

export function DateFilter({
  dateFilter,
  onDateFilterChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
}: DateFilterProps) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
      <select
        value={dateFilter}
        onChange={(e) => onDateFilterChange(e.target.value as 'all' | 'current-month' | 'last-month' | 'current-week' | 'current-day' | 'custom')}
        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-0"
      >
        <option value="all">All Time</option>
        <option value="current-month">Current Month</option>
        <option value="last-month">Last Month</option>
        <option value="current-week">This Week</option>
        <option value="current-day">Today</option>
        <option value="custom">Custom Range</option>
      </select>

      {/* Custom Date Range Inputs */}
      {dateFilter === 'custom' && (
        <div className="flex gap-2 items-center">
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