import { useState } from 'react';
import { 
  useCreateTransaction, 
  useUpdateTransaction, 
  useDeleteTransaction,
  useBulkUpdateTransactions 
} from '../mutations/wallet';
import { useTransactions, useTransaction } from '../queries/wallet';
import type { CreateTransactionInput, TransactionFilters } from '~/entities/types/wallet';

/**
 * Custom hook for transaction management operations
 * Provides a unified interface for transaction CRUD operations
 */
export const useTransactionManagement = () => {
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
    limit: 10,
    offset: 0,
    dateRange: {
      start: new Date(),
      end: new Date(),
    },
  });

  // Queries
  const { 
    data: transactions, 
    isLoading: isLoadingTransactions, 
    refetch: refetchTransactions 
  } = useTransactions(filters);
  
  const { 
    data: selectedTransaction, 
    isLoading: isLoadingSelectedTransaction 
  } = useTransaction(selectedTransactionId || '');

  // Mutations
  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();
  const bulkUpdateTransactionsMutation = useBulkUpdateTransactions();

  // Create transaction
  const createTransaction = async (input: CreateTransactionInput) => {
    try {
      const result = await createTransactionMutation.mutateAsync(input);
      await refetchTransactions();
      return result;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  };

  // Update transaction
  const updateTransaction = async (id: string, input: Partial<CreateTransactionInput>) => {
    try {
      const result = await updateTransactionMutation.mutateAsync({ id, ...input });
      await refetchTransactions();
      if (selectedTransactionId === id) {
        // Refetch selected transaction if it's the one being updated
        // Note: This would need to be implemented if we have a refetch function for individual transaction
      }
      return result;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    try {
      const result = await deleteTransactionMutation.mutateAsync({ id });
      await refetchTransactions();
      if (selectedTransactionId === id) {
        setSelectedTransactionId(null);
      }
      return result;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  // Bulk update transactions
  const bulkUpdateTransactions = async (ids: string[], updates: Partial<CreateTransactionInput>) => {
    try {
      const result = await bulkUpdateTransactionsMutation.mutateAsync({ ids, updates });
      await refetchTransactions();
      return result;
    } catch (error) {
      console.error('Error bulk updating transactions:', error);
      throw error;
    }
  };

  // Select transaction
  const selectTransaction = (id: string) => {
    setSelectedTransactionId(id);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedTransactionId(null);
  };

  // Update filters
  const updateFilters = (newFilters: Partial<TransactionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    // Data
    transactions,
    selectedTransaction,
    filters,
    
    // Loading states
    isLoadingTransactions,
    isLoadingSelectedTransaction,
    isCreatingTransaction: createTransactionMutation.isPending,
    isUpdatingTransaction: updateTransactionMutation.isPending,
    isDeletingTransaction: deleteTransactionMutation.isPending,
    isBulkUpdating: bulkUpdateTransactionsMutation.isPending,
    
    // Actions
    createTransaction,
    updateTransaction,
    deleteTransaction,
    bulkUpdateTransactions,
    selectTransaction,
    clearSelection,
    updateFilters,
    refetchTransactions,
    
    // Selection state
    selectedTransactionId,
  };
}; 