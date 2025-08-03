import { Card } from "../atoms/card";
import { DateFilter } from "./date-filter";
import { SearchAndSort } from "./search-and-sort";
import { Badge } from "../atoms/badge";

interface WalletFiltersProps {
  dateFilter: 'all' | 'current-month' | 'last-month' | 'current-week' | 'current-day' | 'custom';
  onDateFilterChange: (filter: 'all' | 'current-month' | 'last-month' | 'current-week' | 'current-day' | 'custom') => void;
  customStartDate: string;
  customEndDate: string;
  onCustomStartDateChange: (date: string) => void;
  onCustomEndDateChange: (date: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  sortBy: 'date' | 'amount' | 'recipient';
  sortOrder: 'asc' | 'desc';
  onSortByChange: (sortBy: 'date' | 'amount' | 'recipient') => void;
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
  totalCount: number;
  dateRange: { startDate?: Date; endDate?: Date };
}

export function WalletFilters({
  dateFilter,
  onDateFilterChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
  searchQuery,
  onSearchQueryChange,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  totalCount,
  dateRange,
}: WalletFiltersProps) {
  const getDateRangeDisplay = () => {
    if (!dateRange.startDate || !dateRange.endDate) return null;

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

  return (
    <Card className="p-4 mb-6 bg-white border-slate-200 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <DateFilter
          dateFilter={dateFilter}
          onDateFilterChange={onDateFilterChange}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          onCustomStartDateChange={onCustomStartDateChange}
          onCustomEndDateChange={onCustomEndDateChange}
        />

        <SearchAndSort
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={onSortByChange}
          onSortOrderChange={onSortOrderChange}
        />

        <div className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-2 rounded-lg flex-shrink-0">
          {totalCount || 0} transaction{(totalCount || 0) !== 1 ? 's' : ''}
        </div>
      </div>

      {getDateRangeDisplay() && (
        <div className="text-xs text-slate-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 mt-3">
          {getDateRangeDisplay()}
        </div>
      )}
    </Card>
  );
}