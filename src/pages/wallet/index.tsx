"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useSidebarHydrated } from "~/hooks/state";
import { useWalletFiltersStore, useLoadingStore } from "~/store";
import { api } from "~/trpc/react";
import { WalletHeader, WalletSummary, WalletFilters, WalletList } from "~/components/features/wallet";
import { TransactionList } from "~/components/tables";
import { TransactionEditForm } from "~/components/forms";
import { WalletFormModal, BulkUpdateModal } from "~/components/modals";
import { useWalletManagement, useBulkUpdate, useTransactionManagement } from "~/hooks/features/wallet";
import { formatCurrency, formatDate } from "~/utils/formatting";

import type { DateRange } from "~/entities/api/wallet";

export default function WalletPage() {
  const { isCollapsed, hasHydrated } = useSidebarHydrated();
  const { isLoading, setLoading } = useLoadingStore();

  // Wallet selection state
  const [selectedWalletIds, setSelectedWalletIds] = useState<string[]>([]);

  // Custom hooks
  const walletManagement = useWalletManagement();
  const bulkUpdate = useBulkUpdate();
  const transactionManagement = useTransactionManagement();

  // Use global wallet filters store
  const {
    dateFilter,
    setDateFilter,
    customStartDate,
    customEndDate,
    setCustomStartDate,
    setCustomEndDate,
    searchQuery,
    setSearchQuery,
    recipientBank,
    setRecipientBank,
    paymentMethod,
    setPaymentMethod,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
  } = useWalletFiltersStore();

  // Calculate date ranges
  const getDateRange = () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    switch (dateFilter) {
      case 'all':
        return { startDate: undefined, endDate: undefined };
      case 'current-month':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth(), 1),
          endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
        };
      case 'last-month':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
          endDate: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
        };
      case 'current-week':
        const startOfWeek = new Date(now);
        // Get Monday (1) instead of Sunday (0)
        const dayOfWeek = now.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday becomes 6 days back, others become day-1
        startOfWeek.setDate(now.getDate() - daysToMonday);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Monday to Sunday (7 days)
        endOfWeek.setHours(23, 59, 59, 999);
        return { startDate: startOfWeek, endDate: endOfWeek };
      case 'current-day':
        return { startDate: startOfDay, endDate: endOfDay };
      case 'custom':
        return {
          startDate: customStartDate ? new Date(customStartDate) : undefined,
          endDate: customEndDate ? new Date(customEndDate + 'T23:59:59.999') : undefined
        };
      default:
        return { startDate: undefined, endDate: undefined };
    }
  };

  const dateRange: DateRange = getDateRange();

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [dateFilter, customStartDate, customEndDate, searchQuery, recipientBank, paymentMethod, sortBy, sortOrder, pageSize, selectedWalletIds]);

  // Get transactions with server-side filtering, sorting, and pagination
  const { data: transactions, refetch: refetchTransactions } = api.wallet.getTransactions.useQuery({
    limit: pageSize,
    offset: currentPage * pageSize,
    startDate: dateRange.startDate?.toISOString(),
    endDate: dateRange.endDate?.toISOString(),
    search: searchQuery.trim() || undefined,
    bankFilter: recipientBank,
    paymentMethodFilter: paymentMethod,
    sortBy: sortBy === 'recipient' ? 'description' : sortBy,
    sortOrder: sortOrder,
    walletId: selectedWalletIds.length > 0 ? selectedWalletIds[0] : undefined,
  }, {
    enabled: selectedWalletIds.length > 0, // Only fetch when wallets are selected
  });

  // Get total count for pagination - using getTransactions to get count
  const { data: totalCount } = api.wallet.getTransactions.useQuery({
    limit: 1,
    offset: 0,
    startDate: dateRange.startDate?.toISOString(),
    endDate: dateRange.endDate?.toISOString(),
    search: searchQuery.trim() || undefined,
    bankFilter: recipientBank,
    paymentMethodFilter: paymentMethod,
    walletId: selectedWalletIds.length > 0 ? selectedWalletIds[0] : undefined,
  }, {
    enabled: selectedWalletIds.length > 0, // Only fetch when wallets are selected
    select: (data) => data.total,
  });

  // Get summary with date filtering and selected wallets
  const { data: summary } = api.wallet.getSummary.useQuery({
    startDate: dateRange.startDate?.toISOString() || new Date().toISOString(),
    endDate: dateRange.endDate?.toISOString() || new Date().toISOString(),
  }, {
    enabled: selectedWalletIds.length > 0, // Only fetch when wallets are selected
  });

  // Get user wallets
  const { data: walletsData = [] } = api.wallet.getAll.useQuery();

  // Check if user has any non-uncategorized wallets
  const hasWallets = walletsData.some(wallet => wallet.name !== 'Uncategorized');

  // Set all wallets as selected by default (only on initial load)
  useEffect(() => {
    if (walletsData.length > 0 && selectedWalletIds.length === 0) {
      const allWalletIds = walletsData.map(wallet => wallet.id);
      setSelectedWalletIds(allWalletIds);
    }
  }, [walletsData]); // Remove selectedWalletIds.length dependency to allow empty selection

  // Auto-resync effect - disabled for now since syncTransactions doesn't exist
  // useEffect(() => {
  //   if (hasWallets && walletsData.some(wallet => wallet.accountNumber)) {
  //     // Only trigger if user has wallets with account numbers
  //     const timer = setTimeout(() => {
  //       autoResyncMutation.mutate({ maxResults: 100 });
  //     }, 2000); // 2 second delay to avoid too frequent calls

  //     return () => clearTimeout(timer);
  //   }
  // }, [hasWallets, walletsData.length]); // Trigger when wallets change

  // Get banks for wallet form
  const { data: banksData = [] } = api.masterData.getBanks.useQuery();

  // Get tRPC utils for query invalidation
  const utils = api.useUtils();

  // Auto-resync mutation - disabled for now since syncTransactions doesn't exist
  // const autoResyncMutation = api.wallet.syncTransactions.useMutation({
  //   // ... mutation logic
  // });

  const handleWalletSelectionChange = (newSelectedIds: string[]) => {
    // Simple wallet selection without bulk update
    setSelectedWalletIds(newSelectedIds);
  };

  const handleExportTransactions = () => {
    // TODO: Implement export functionality
    console.log('Export transactions');
  };

  // Don't render until hydration is complete
  if (!hasHydrated) {
    return (
      <div className="transition-all duration-200 ease-out transform-gpu pl-72">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-200 ease-out transform-gpu ${isCollapsed ? 'pl-20' : 'pl-72'}`}>
      <div className="min-h-screen">
        <div className="pt-2 pb-4 px-4 sm:pt-3 sm:pb-6 sm:px-6 lg:pt-4 lg:pb-8 lg:px-8">


          {/* Wallet Management Section */}
          <div className="mb-6">
            <WalletList
              wallets={walletsData as any}
              selectedWalletIds={selectedWalletIds}
              onSelectWallets={handleWalletSelectionChange}
              onAddWallet={walletManagement.handleAddWallet}
              onEditWallet={walletManagement.handleEditWallet}
              onDeleteWallet={walletManagement.handleDeleteWallet}
              isLoading={isLoading}
            />
          </div>

          {/* Wallet Form Modal */}
          <WalletFormModal
            isOpen={walletManagement.showWalletForm}
            onClose={walletManagement.handleCancelWalletForm}
            editingWallet={walletManagement.editingWallet}
            banks={banksData as any}
            onSubmit={walletManagement.handleWalletSubmit}
            onCancel={walletManagement.handleCancelWalletForm}
            isLoading={walletManagement.createWalletMutation.isPending || walletManagement.updateWalletMutation.isPending}
          />



          <WalletSummary
            summary={summary || {
              totalIncome: 0,
              totalExpense: 0,
              transactionCount: 0,
              topMerchants: [],
              monthlyTrend: []
            }}
            formatCurrency={formatCurrency}
          />

          <WalletFilters
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCustomStartDateChange={setCustomStartDate}
            onCustomEndDateChange={setCustomEndDate}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            recipientBank={recipientBank}
            onRecipientBankChange={setRecipientBank}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            totalCount={totalCount || 0}
            dateRange={dateRange}
            onSync={() => autoResyncMutation.mutate({ maxResults: 100 })}
            isSyncPending={autoResyncMutation.isPending}
            onExport={handleExportTransactions}
          />

          <TransactionList
            transactions={transactions}
            totalCount={totalCount || 0}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            isLoading={isLoading || autoResyncMutation.isPending}
            hasWallets={hasWallets}
            selectedWalletIds={selectedWalletIds}
            wallets={walletsData as any}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            onEditTransaction={transactionManagement.handleEditTransaction}
          />

          {/* Transaction Edit Form Modal */}
          <TransactionEditForm
            transaction={transactionManagement.editingTransaction}
            isOpen={transactionManagement.showTransactionEditForm}
            onClose={transactionManagement.handleCloseTransactionEditForm}
            onSuccess={transactionManagement.handleTransactionEditSuccess}
          />


        </div>
      </div>
    </div>
  );
}