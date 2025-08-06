import { Card } from "~/components/ui/card";
import { DateFilter } from "~/components/ui/date-filter";
import { SearchInput } from "~/components/ui/search-input";
import { SortControls } from "~/components/ui/sort-controls";
import { DateRangeDisplay } from "~/components/ui/date-range-display";
import { BankFilter } from "~/components/ui/bank-filter";
import { PaymentMethodFilter } from "~/components/ui/payment-method-filter";
import { LimitFilter } from "~/components/ui/limit-filter";
import { RefreshCw, Download } from "lucide-react";
import { Button } from "~/components/ui/button";
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
  pageSize,
  onPageSizeChange,
  totalCount,
  dateRange,
  onSync,
  isSyncPending = false,
  onExport,
}: WalletFiltersProps & { onSync?: () => void; isSyncPending?: boolean; onExport?: () => void }) {
  return (
    <Card className="p-4 mb-6 bg-white border-slate-200 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-3 items-center">
        <div className="flex gap-2 items-center flex-shrink-0">
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
        </div>

        <SearchInput
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search transactions..."
        />

        <div className="flex gap-2 items-center flex-shrink-0">
          <SortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={onSortByChange}
            onSortOrderChange={onSortOrderChange}
          />

          <LimitFilter
            value={pageSize}
            onChange={onPageSizeChange}
          />

          <div className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-2 rounded-lg flex-shrink-0">
            {totalCount || 0} transaction{(totalCount || 0) !== 1 ? 's' : ''}
          </div>

          {onSync && (
            <Button
              onClick={onSync}
              disabled={isSyncPending}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-200"
              title="Sync emails"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncPending ? 'animate-spin' : ''}`} />
            </Button>
          )}

          {onExport && (
            <Button
              onClick={onExport}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-200"
              title="Export transactions"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
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