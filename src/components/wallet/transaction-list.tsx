import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Download, Wallet, RefreshCw } from "lucide-react";
import { TransactionItem } from "~/components/ui/transaction-item";
import { EmptyState } from "~/components/ui/empty-state";
import { PaginationControls } from "~/components/ui/pagination-controls";
import type { TransactionListProps } from "~/entities/api/wallet";



export function TransactionList({
  transactions,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  isLoading,
  hasWallets = true,
  formatCurrency,
  formatDate,
}: TransactionListProps) {
  const totalPages = Math.ceil((totalCount || 0) / pageSize);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Recent Transactions</h2>
          <Button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {!transactions || transactions.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title={hasWallets ? "No transactions found" : "Create a wallet first"}
          description={
            hasWallets
              ? "Auto sync is enabled. New bank transactions will be automatically imported when emails arrive."
              : "You must create at least one wallet before syncing emails"
          }
          actionLabel={hasWallets ? undefined : "Create Wallet"}
          onAction={undefined}
          actionIcon={undefined}
          isLoading={isLoading}
        />
      ) : (
        <>
          <div className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            ))}
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </>
      )}
    </Card>
  );
}