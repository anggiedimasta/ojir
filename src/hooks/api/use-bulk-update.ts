import { useState } from 'react';
import { useBulkUpdateTransactions } from '../mutations/wallet';
import type { CreateTransactionInput } from '~/entities/types/wallet';

/**
 * Custom hook for bulk update operations
 * Provides a unified interface for bulk updating transactions
 */
export const useBulkUpdate = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Mutations
  const bulkUpdateTransactionsMutation = useBulkUpdateTransactions();

  // Bulk update transactions
  const bulkUpdateTransactions = async (updates: Partial<CreateTransactionInput>) => {
    if (selectedIds.length === 0) {
      throw new Error('No transactions selected for bulk update');
    }

    try {
      const result = await bulkUpdateTransactionsMutation.mutateAsync({
        ids: selectedIds,
        updates,
      });
      
      // Clear selection after successful update
      setSelectedIds([]);
      setIsSelectMode(false);
      
      return result;
    } catch (error) {
      console.error('Error bulk updating transactions:', error);
      throw error;
    }
  };

  // Toggle select mode
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (!isSelectMode) {
      setSelectedIds([]);
    }
  };

  // Select transaction
  const selectTransaction = (id: string) => {
    if (!isSelectMode) return;
    
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  // Select all transactions
  const selectAll = (allIds: string[]) => {
    setSelectedIds(allIds);
  };

  // Deselect all transactions
  const deselectAll = () => {
    setSelectedIds([]);
  };

  // Toggle selection of a transaction
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  // Check if transaction is selected
  const isSelected = (id: string) => {
    return selectedIds.includes(id);
  };

  // Get selection count
  const getSelectionCount = () => {
    return selectedIds.length;
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedIds([]);
    setIsSelectMode(false);
  };

  return {
    // State
    selectedIds,
    isSelectMode,
    
    // Loading state
    isBulkUpdating: bulkUpdateTransactionsMutation.isPending,
    
    // Actions
    bulkUpdateTransactions,
    toggleSelectMode,
    selectTransaction,
    selectAll,
    deselectAll,
    toggleSelection,
    clearSelection,
    
    // Utilities
    isSelected,
    getSelectionCount,
  };
}; 