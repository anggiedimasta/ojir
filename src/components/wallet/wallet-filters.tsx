import { Card } from "~/components/ui/card";
import { DateFilter } from "~/components/ui/date-filter";
import { SearchInput } from "~/components/ui/search-input";
import { SortControls } from "~/components/ui/sort-controls";

import { Download, RefreshCw } from "lucide-react";
import { BankFilter } from "~/components/ui/bank-filter";
import { Button } from "~/components/ui/button";
import { LimitFilter } from "~/components/ui/limit-filter";
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
  pageSize,
  onPageSizeChange,
  totalCount,
  dateRange,
  onSync,
  isSyncPending = false,
  onExport,
}: WalletFiltersProps & {
  onSync?: () => void;
  isSyncPending?: boolean;
  onExport?: () => void;
}) {
  return (
    <Card className="mb-6 border-slate-200 bg-white p-4 shadow-lg">
      <div className="flex flex-col items-center gap-3 lg:flex-row">
        <div className="flex flex-shrink-0 items-center gap-2">
          <DateFilter
            dateFilter={dateFilter}
            onDateFilterChange={onDateFilterChange}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCustomStartDateChange={onCustomStartDateChange}
            onCustomEndDateChange={onCustomEndDateChange}
            dateRange={dateRange}
          />

          <BankFilter value={recipientBank} onChange={onRecipientBankChange} />

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

        <div className="flex flex-shrink-0 items-center gap-2">
          <SortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={onSortByChange}
            onSortOrderChange={onSortOrderChange}
          />

          <LimitFilter value={pageSize} onChange={onPageSizeChange} />

          <div className="flex-shrink-0 rounded-lg bg-slate-100 px-3 py-2 font-medium text-slate-600 text-sm">
            {totalCount || 0} transaction{(totalCount || 0) !== 1 ? "s" : ""}
          </div>

          {onSync && (
            <Button
              onClick={onSync}
              disabled={isSyncPending}
              className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 transition-all duration-200 hover:bg-slate-200"
              title="Sync emails"
            >
              <RefreshCw
                className={`h-4 w-4 ${isSyncPending ? "animate-spin" : ""}`}
              />
            </Button>
          )}

          {onExport && (
            <Button
              onClick={onExport}
              className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 transition-all duration-200 hover:bg-slate-200"
              title="Export transactions"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
