import { SortAsc, SortDesc } from "lucide-react";
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
  return (
    <div className="flex gap-2 items-center">
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as 'date' | 'amount' | 'recipient')}
        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <Button
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-200"
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