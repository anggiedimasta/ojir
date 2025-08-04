import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Download, Wallet, RefreshCw } from "lucide-react";
import { TransactionItem } from "~/components/ui/transaction-item";
import { EmptyState } from "~/components/ui/empty-state";
import { PaginationControls } from "~/components/ui/pagination-controls";
import { TransactionListSkeleton } from "~/components/ui/transaction-skeleton";
import type { TransactionListProps } from "~/entities/api/wallet";



export function TransactionList({
  transactions,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  isLoading,
  hasWallets = true,
  selectedWalletIds = [],
  wallets = [],
  formatCurrency,
  formatDate,
  onEditTransaction,
}: TransactionListProps) {
  const totalPages = Math.ceil((totalCount || 0) / pageSize);

    // Generate dynamic title based on selected wallets
  const getTransactionTitle = () => {
    if (!selectedWalletIds || selectedWalletIds.length === 0) {
      return "No Wallets Selected";
    }

    if (selectedWalletIds.length === wallets.length) {
      return "All Wallet Transactions";
    }

    if (selectedWalletIds.length === 1) {
      const wallet = wallets.find(w => w.id === selectedWalletIds[0]);
      return `${wallet?.name || 'Wallet'} Transactions`;
    }

    return `${selectedWalletIds.length} Wallet Transactions`;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">

      {!transactions || transactions.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title={
            !hasWallets
              ? "Create a wallet first"
              : selectedWalletIds.length === 0
              ? "No wallets selected"
              : "No transactions found"
          }
          description={
            !hasWallets
              ? "You must create at least one wallet before syncing emails"
              : selectedWalletIds.length === 0
              ? "Select one or more wallets to view their transactions"
              : "Auto sync is enabled. New bank transactions will be automatically imported when emails arrive."
          }
          actionLabel={!hasWallets ? "Create Wallet" : selectedWalletIds.length === 0 ? "Select Wallets" : undefined}
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
                onEdit={onEditTransaction}
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