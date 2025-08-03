import { Card } from "~/components/ui/card";
import { DateFilter } from "~/components/ui/date-filter";
import { SearchInput } from "~/components/ui/search-input";
import { SortControls } from "~/components/ui/sort-controls";
import { DateRangeDisplay } from "~/components/ui/date-range-display";
import { BankFilter } from "~/components/ui/bank-filter";
import { PaymentMethodFilter } from "~/components/ui/payment-method-filter";
import type { WalletFiltersProps } from "~/entities/api/wallet";



export function WalletFilters({
  dateFilter,
  onDateFilterChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
  searchQuery,
  onSearchQueryChange,
  recipientBank,
  onRecipientBankChange,
  paymentMethod,
  onPaymentMethodChange,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  totalCount,
  dateRange,
}: WalletFiltersProps) {
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

        <BankFilter
          value={recipientBank}
          onChange={onRecipientBankChange}
        />

        <PaymentMethodFilter
          value={paymentMethod}
          onChange={onPaymentMethodChange}
        />

        <SearchInput
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search transactions..."
        />

        <SortControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={onSortByChange}
          onSortOrderChange={onSortOrderChange}
        />

        <div className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-2 rounded-lg flex-shrink-0">
          {totalCount || 0} transaction{(totalCount || 0) !== 1 ? 's' : ''}
        </div>
      </div>

      <DateRangeDisplay
        dateFilter={dateFilter}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        className="mt-3"
      />
    </Card>
  );
}