// Wallet Mutations
// This file contains all wallet-related mutation hooks

import { api } from '~/utils/api';
import type { CreateTransactionInput, UpdateTransactionInput } from '~/entities/types/wallet';

// Bulk update transactions mutation
export const useBulkUpdateTransactions = () => {
  return api.wallet.bulkUpdateTransactions.useMutation({
    onSuccess: () => {
      // Invalidate relevant queries
      api.useContext().wallet.getTransactions.invalidate();
    },
  });
};

// Create transaction mutation
export const useCreateTransaction = () => {
  return api.wallet.createTransaction.useMutation({
    onSuccess: () => {
      // Invalidate relevant queries
      api.useContext().wallet.getTransactions.invalidate();
    },
  });
};

// Update transaction mutation
export const useUpdateTransaction = () => {
  return api.wallet.updateTransaction.useMutation({
    onSuccess: () => {
      // Invalidate relevant queries
      api.useContext().wallet.getTransactions.invalidate();
    },
  });
};

// Delete transaction mutation
export const useDeleteTransaction = () => {
  return api.wallet.deleteTransaction.useMutation({
    onSuccess: () => {
      // Invalidate relevant queries
      api.useContext().wallet.getTransactions.invalidate();
    },
  });
};

// Create wallet mutation
export const useCreateWallet = () => {
  return api.wallet.create.useMutation({
    onSuccess: () => {
      // Invalidate relevant queries
      api.useContext().wallet.getAll.invalidate();
    },
  });
};

// Update wallet mutation
export const useUpdateWallet = () => {
  return api.wallet.update.useMutation({
    onSuccess: () => {
      // Invalidate relevant queries
      api.useContext().wallet.getAll.invalidate();
    },
  });
};

// Delete wallet mutation
export const useDeleteWallet = () => {
  return api.wallet.delete.useMutation({
    onSuccess: () => {
      // Invalidate relevant queries
      api.useContext().wallet.getAll.invalidate();
    },
  });
};