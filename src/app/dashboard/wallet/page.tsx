"use client";

import { useEffect, useState } from "react";
import { useSidebarStore, useWalletFiltersStore, useLoadingStore } from "~/store";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { WalletHeader } from "~/components/wallet/wallet-header";
import { WalletSummary } from "~/components/wallet/wallet-summary";
import { WalletFilters } from "~/components/wallet/wallet-filters";
import { TransactionList } from "~/components/wallet/transaction-list";
import { WalletList } from "~/components/wallet/wallet-list";
import { WalletForm } from "~/components/wallet/wallet-form";
import { Modal } from "~/components/ui/modal";

import type { DateRange } from "~/entities/api/wallet";

export default function WalletPage() {
  const { isCollapsed } = useSidebarStore();
  const { toast } = useToast();
  const { isLoading, setLoading } = useLoadingStore();

  // Wallet management state
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState<any | null>(null);
  const [selectedWalletIds, setSelectedWalletIds] = useState<string[]>([]);

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
  }, [dateFilter, customStartDate, customEndDate, searchQuery, recipientBank, paymentMethod, sortBy, sortOrder]);

  // Get transactions with server-side filtering, sorting, and pagination
  const { data: transactions, refetch: refetchTransactions } = api.wallet.getTransactions.useQuery({
    limit: pageSize,
    offset: currentPage * pageSize,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    searchQuery: searchQuery.trim() || undefined,
    recipientBank: recipientBank,
    paymentMethod: paymentMethod,
    sortBy: sortBy,
    sortOrder: sortOrder,
  });

  // Get total count for pagination
  const { data: totalCount } = api.wallet.getTransactionCount.useQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    searchQuery: searchQuery.trim() || undefined,
    recipientBank: recipientBank,
    paymentMethod: paymentMethod,
  });

  // Get summary with date filtering and selected wallets
  const { data: summary } = api.wallet.getSummary.useQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    walletIds: selectedWalletIds.length > 0 ? selectedWalletIds : undefined,
  });

  // Get user wallets
  const { data: walletsData = [] } = api.wallet.getWallets.useQuery();

  // Check if user has any non-uncategorized wallets
  const hasWallets = walletsData.some(wallet => wallet.name !== 'Uncategorized');

  // Set all wallets as selected by default
  useEffect(() => {
    if (walletsData.length > 0 && selectedWalletIds.length === 0) {
      const allWalletIds = walletsData.map(wallet => wallet.id);
      setSelectedWalletIds(allWalletIds);
    }
  }, [walletsData, selectedWalletIds.length]);

  // Auto-resync effect - runs when wallets are updated or on initial load
  useEffect(() => {
    if (hasWallets && walletsData.some(wallet => wallet.accountNumber)) {
      // Only trigger if user has wallets with account numbers
      const timer = setTimeout(() => {
        autoResyncMutation.mutate({ maxResults: 100 });
      }, 2000); // 2 second delay to avoid too frequent calls

      return () => clearTimeout(timer);
    }
  }, [hasWallets, walletsData.length]); // Trigger when wallets change

  // Get banks for wallet form
  const { data: banksData = [] } = api.masterData.getBanks.useQuery();

  // Get tRPC utils for query invalidation
  const utils = api.useUtils();



  // Wallet management mutations
  const createWalletMutation = api.wallet.createWallet.useMutation({
    onSuccess: () => {
      toast({
        title: "Wallet Created",
        description: "Your wallet has been created successfully.",
      });
      setShowWalletForm(false);
      setEditingWallet(null);
      // Invalidate and refetch wallet queries
      api.useUtils().wallet.getWallets.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Wallet",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateWalletMutation = api.wallet.updateWallet.useMutation({
    onSuccess: () => {
      toast({
        title: "Wallet Updated",
        description: "Your wallet has been updated successfully.",
      });
      setShowWalletForm(false);
      setEditingWallet(null);
      // Invalidate and refetch wallet queries
      api.useUtils().wallet.getWallets.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Failed to Update Wallet",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteWalletMutation = api.wallet.deleteWallet.useMutation({
    onSuccess: () => {
      toast({
        title: "Wallet Deleted",
        description: "Your wallet has been deleted successfully.",
      });
      // Invalidate and refetch wallet queries
      api.useUtils().wallet.getWallets.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Failed to Delete Wallet",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Auto-resync mutation
  const autoResyncMutation = api.wallet.syncTransactions.useMutation({
    onMutate: () => {
      // Set global loading when starting sync
      setLoading(true, "Syncing emails and updating transactions...");
    },
    onSuccess: (data) => {
      // Invalidate with specific parameters to ensure proper refetch
      utils.wallet.getTransactions.invalidate({
        limit: pageSize,
        offset: currentPage * pageSize,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        searchQuery: searchQuery.trim() || undefined,
        recipientBank: recipientBank,
        paymentMethod: paymentMethod,
        sortBy: sortBy,
        sortOrder: sortOrder,
      });

      utils.wallet.getTransactionCount.invalidate({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        searchQuery: searchQuery.trim() || undefined,
        recipientBank: recipientBank,
        paymentMethod: paymentMethod,
      });

      utils.wallet.getSummary.invalidate({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        walletIds: selectedWalletIds.length > 0 ? selectedWalletIds : undefined,
      });

      utils.wallet.getWallets.invalidate();

      // Show success toast if there were changes
      if (data.newTransactions > 0 || data.remappedTransactions > 0) {
        toast({
          title: "Sync Completed",
          description: `${data.newTransactions} new transactions imported, ${data.remappedTransactions} transactions remapped to correct wallets.`,
        });
      }
    },
    onError: (error) => {
      console.error("Auto-resync failed:", error);
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Clear global loading when sync completes (success or error)
      setLoading(false);
    },
  });

  // Wallet management handlers
  const handleAddWallet = () => {
    setEditingWallet(null);
    setShowWalletForm(true);
  };

  const handleEditWallet = (wallet: any) => {
    setEditingWallet(wallet);
    setShowWalletForm(true);
  };

  const handleDeleteWallet = async (walletId: string) => {
    if (window.confirm('Are you sure you want to delete this wallet? This cannot be undone.')) {
      await deleteWalletMutation.mutateAsync({ id: walletId });
    }
  };

  const handleWalletSubmit = async (data: any) => {
    if (editingWallet) {
      await updateWalletMutation.mutateAsync(data);
    } else {
      await createWalletMutation.mutateAsync(data);
    }
  };

  const handleCancelWalletForm = () => {
    setShowWalletForm(false);
    setEditingWallet(null);
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);

    // Handle negative numbers properly
    const isNegative = num < 0;
    const absNum = Math.abs(num);

    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(absNum);

    // Return with proper negative sign
    return isNegative ? `-${formatted}` : formatted;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className={`transition-all duration-200 ease-out transform-gpu ${isCollapsed ? 'pl-20' : 'pl-72'}`}>
      <div className="min-h-screen">
        <div className="pt-2 pb-4 px-4 sm:pt-3 sm:pb-6 sm:px-6 lg:pt-4 lg:pb-8 lg:px-8">
                      <WalletHeader
              hasWallets={hasWallets}
            />

          {/* Wallet Management Section */}
          <div className="mb-6">
                         <WalletList
               wallets={walletsData as any}
               selectedWalletIds={selectedWalletIds}
               onSelectWallets={setSelectedWalletIds}
               onAddWallet={handleAddWallet}
               onEditWallet={handleEditWallet}
               onDeleteWallet={handleDeleteWallet}
               isLoading={isLoading}
             />
          </div>

          {/* Wallet Form Modal */}
          <Modal
            isOpen={showWalletForm}
            onClose={handleCancelWalletForm}
            title={editingWallet ? 'Edit Wallet' : 'Create New Wallet'}
            description={editingWallet ? 'Update your wallet information' : 'Add a new wallet to manage your transactions'}
            size="2xl"
            closeOnOverlayClick={true}
            closeOnEscape={true}
            footer={
              <div className="flex gap-3 w-full">
                                 <button
                   type="button"
                   onClick={handleCancelWalletForm}
                   disabled={createWalletMutation.isPending || updateWalletMutation.isPending}
                   className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   form="wallet-form"
                   disabled={createWalletMutation.isPending || updateWalletMutation.isPending}
                   className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                 >
                  {createWalletMutation.isPending || updateWalletMutation.isPending ? 'Saving...' : (editingWallet ? 'Update Wallet' : 'Create Wallet')}
                </button>
              </div>
            }
          >
            <WalletForm
              wallet={editingWallet}
              banks={banksData as any}
              onSubmit={handleWalletSubmit}
              onCancel={handleCancelWalletForm}
              isLoading={createWalletMutation.isPending || updateWalletMutation.isPending}
            />
          </Modal>



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
            totalCount={totalCount || 0}
            dateRange={dateRange}
          />

          <TransactionList
            transactions={transactions}
            totalCount={totalCount || 0}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            isLoading={isLoading || autoResyncMutation.isPending}
            hasWallets={hasWallets}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
}