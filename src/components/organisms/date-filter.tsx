import { Calendar } from "lucide-react";
import type { DateFilterType } from "~/entities/api/wallet";
import { cn } from "~/lib/utils";
import { Icon } from "../atoms/icon";
import { DateInput } from "../molecules/date-input";
import { SelectInput } from "../molecules/select-input";

interface DateFilterProps {
  dateFilter: DateFilterType;
  onDateFilterChange: (filter: DateFilterType) => void;
  customStartDate: string;
  customEndDate: string;
  onCustomStartDateChange: (date: string) => void;
  onCustomEndDateChange: (date: string) => void;
}

export function DateFilter({
  dateFilter,
  onDateFilterChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
}: DateFilterProps) {
  const filterOptions = [
    { value: "all", label: "All Time" },
    { value: "current-month", label: "Current Month" },
    { value: "last-month", label: "Last Month" },
    { value: "current-week", label: "This Week" },
    { value: "current-day", label: "Today" },
    { value: "custom", label: "Custom Range" },
  ];

  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon
        icon={Calendar}
        size="sm"
        className="flex-shrink-0 text-slate-500"
      />
      <SelectInput
        value={dateFilter}
        onChange={(value) => onDateFilterChange(value as DateFilterType)}
        options={filterOptions}
        className="min-w-0"
      />

      {/* Custom Date Range Inputs */}
      {dateFilter === "custom" && (
        <div className="flex items-center gap-1">
          <DateInput
            value={customStartDate}
            onChange={onCustomStartDateChange}
            className="w-28 text-sm"
          />
          <span className="text-slate-500 text-xs">to</span>
          <DateInput
            value={customEndDate}
            onChange={onCustomEndDateChange}
            className="w-28 text-sm"
          />
        </div>
      )}
    </div>
  );
}
