import { useState } from "react";
import { api } from "~/trpc/react";

export interface ChartDateRange {
  startDate: Date;
  endDate: Date;
}

export interface ChartFilters {
  walletId?: string;
  walletIds?: string[];
  groupBy?: "day" | "week" | "month";
}

export function useChartData() {
  const [dateRange, setDateRange] = useState<ChartDateRange>(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1); // Last 6 months
    const endDate = new Date();
    return { startDate, endDate };
  });

  const [filters, setFilters] = useState<ChartFilters>({
    groupBy: "month",
  });

  // Spending trend data
  const spendingTrend = api.wallet.getSpendingTrend.useQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    walletId: filters.walletId,
    walletIds: filters.walletIds,
    groupBy: filters.groupBy,
  });

  // Category distribution data
  const categoryDistribution = api.wallet.getCategoryDistribution.useQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    walletId: filters.walletId,
    walletIds: filters.walletIds,
  });

  // Payment method distribution data
  const paymentMethodDistribution =
    api.wallet.getPaymentMethodDistribution.useQuery({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      walletId: filters.walletId,
      walletIds: filters.walletIds,
    });

  // Wallet balance history data
  const walletBalanceHistory = api.wallet.getWalletBalanceHistory.useQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    walletId: filters.walletId,
    walletIds: filters.walletIds,
    groupBy: filters.groupBy,
  });

  // Transaction type breakdown data
  const transactionTypeBreakdown =
    api.wallet.getTransactionTypeBreakdown.useQuery({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      walletId: filters.walletId,
      walletIds: filters.walletIds,
    });

  // Calendar analytics data
  const calendarAnalytics = api.calendar.getAnalytics.useQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    includeGoogleEvents: true,
  });

  // Wallet summary data
  const walletSummary = api.wallet.getSummary.useQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    walletId: filters.walletId,
    walletIds: filters.walletIds,
  });

  // Check if any data is loading
  const isLoading =
    spendingTrend.isLoading ||
    categoryDistribution.isLoading ||
    paymentMethodDistribution.isLoading ||
    walletBalanceHistory.isLoading ||
    transactionTypeBreakdown.isLoading ||
    calendarAnalytics.isLoading ||
    walletSummary.isLoading;

  // Check if any data has errors
  const hasErrors =
    spendingTrend.error ||
    categoryDistribution.error ||
    paymentMethodDistribution.error ||
    walletBalanceHistory.error ||
    transactionTypeBreakdown.error ||
    calendarAnalytics.error ||
    walletSummary.error;

  // Update date range
  const updateDateRange = (newRange: ChartDateRange) => {
    setDateRange(newRange);
  };

  // Update filters
  const updateFilters = (newFilters: Partial<ChartFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Refresh all data
  const refreshData = () => {
    spendingTrend.refetch();
    categoryDistribution.refetch();
    paymentMethodDistribution.refetch();
    walletBalanceHistory.refetch();
    transactionTypeBreakdown.refetch();
    calendarAnalytics.refetch();
    walletSummary.refetch();
  };

  return {
    // Data
    spendingTrend: spendingTrend.data || [],
    categoryDistribution: categoryDistribution.data || [],
    paymentMethodDistribution: paymentMethodDistribution.data || [],
    walletBalanceHistory: walletBalanceHistory.data || [],
    transactionTypeBreakdown: transactionTypeBreakdown.data || [],
    calendarAnalytics: calendarAnalytics.data,
    walletSummary: walletSummary.data,

    // State
    isLoading,
    hasErrors,
    dateRange,
    filters,

    // Actions
    updateDateRange,
    updateFilters,
    refreshData,
  };
}
