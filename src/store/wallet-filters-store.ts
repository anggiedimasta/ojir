import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  BankFilterValue,
  DateFilterType,
  PaymentMethodFilterValue,
  SortByType,
  SortOrderType,
} from "~/entities/api/wallet";

interface WalletFiltersStore {
  // Date filter state
  dateFilter: DateFilterType;
  setDateFilter: (filter: DateFilterType) => void;
  customStartDate: string;
  customEndDate: string;
  setCustomStartDate: (date: string) => void;
  setCustomEndDate: (date: string) => void;

  // Search and sort state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortByType;
  setSortBy: (sortBy: SortByType) => void;
  sortOrder: SortOrderType;
  setSortOrder: (order: SortOrderType) => void;

  // New filter states
  recipientBank: BankFilterValue;
  setRecipientBank: (bank: BankFilterValue) => void;
  paymentMethod: PaymentMethodFilterValue;
  setPaymentMethod: (method: PaymentMethodFilterValue) => void;

  // Pagination state
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;

  // Reset all filters
  resetFilters: () => void;
}

// Get default date range (last 30 days)
const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);
  return {
    startDate: startDate.toISOString().split("T")[0] || "",
    endDate: endDate.toISOString().split("T")[0] || "",
  };
};

const defaultRange = getDefaultDateRange();

export const useWalletFiltersStore = create<WalletFiltersStore>()(
  persist(
    (set, get) => ({
      // Date filter state
      dateFilter: "current-month",
      setDateFilter: (dateFilter) => set({ dateFilter }),
      customStartDate: defaultRange.startDate,
      customEndDate: defaultRange.endDate,
      setCustomStartDate: (customStartDate) => set({ customStartDate }),
      setCustomEndDate: (customEndDate) => set({ customEndDate }),

      // Search and sort state
      searchQuery: "",
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      sortBy: "date",
      setSortBy: (sortBy) => set({ sortBy }),
      sortOrder: "desc",
      setSortOrder: (sortOrder) => set({ sortOrder }),

      // New filter states
      recipientBank: ["all"],
      setRecipientBank: (recipientBank) => set({ recipientBank }),
      paymentMethod: ["all"],
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

      // Pagination state
      currentPage: 0,
      setCurrentPage: (currentPage) => set({ currentPage }),
      pageSize: 10,
      setPageSize: (pageSize) => set({ pageSize }),

      // Reset all filters
      resetFilters: () =>
        set({
          dateFilter: "current-month",
          customStartDate: defaultRange.startDate,
          customEndDate: defaultRange.endDate,
          searchQuery: "",
          recipientBank: ["all"],
          paymentMethod: ["all"],
          sortBy: "date",
          sortOrder: "desc",
          currentPage: 0,
        }),
    }),
    {
      name: "wallet-filters-storage",
      partialize: (state) => ({
        dateFilter: state.dateFilter,
        customStartDate: state.customStartDate,
        customEndDate: state.customEndDate,
        searchQuery: state.searchQuery,
        recipientBank: state.recipientBank,
        paymentMethod: state.paymentMethod,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        pageSize: state.pageSize,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Migrate old single-value format to array format
          if (state.recipientBank && !Array.isArray(state.recipientBank)) {
            state.recipientBank = [state.recipientBank];
          }
          if (state.paymentMethod && !Array.isArray(state.paymentMethod)) {
            state.paymentMethod = [state.paymentMethod];
          }
        }
      },
    },
  ),
);
