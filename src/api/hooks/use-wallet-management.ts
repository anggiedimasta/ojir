import { useState } from 'react';
import { useCreateWallet, useUpdateWallet, useDeleteWallet } from '../mutations/wallet';
import { useWallets, useWallet } from '../queries/wallet';
import type { CreateWalletInput, UpdateWalletInput } from '@/entities/types/wallet';

/**
 * Custom hook for wallet management operations
 * Provides a unified interface for wallet CRUD operations
 */
export const useWalletManagement = () => {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  // Queries
  const { data: wallets, isLoading: isLoadingWallets, refetch: refetchWallets } = useWallets();
  const { data: selectedWallet, isLoading: isLoadingSelectedWallet } = useWallet(selectedWalletId || '');

  // Mutations
  const createWalletMutation = useCreateWallet();
  const updateWalletMutation = useUpdateWallet();
  const deleteWalletMutation = useDeleteWallet();

  // Create wallet
  const createWallet = async (input: CreateWalletInput) => {
    try {
      const result = await createWalletMutation.mutateAsync(input);
      await refetchWallets();
      return result;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  };

  // Update wallet
  const updateWallet = async (id: string, input: UpdateWalletInput) => {
    try {
      const result = await updateWalletMutation.mutateAsync({ id, ...input });
      await refetchWallets();
      if (selectedWalletId === id) {
        // Refetch selected wallet if it's the one being updated
        // Note: This would need to be implemented if we have a refetch function for individual wallet
      }
      return result;
    } catch (error) {
      console.error('Error updating wallet:', error);
      throw error;
    }
  };

  // Delete wallet
  const deleteWallet = async (id: string) => {
    try {
      const result = await deleteWalletMutation.mutateAsync({ id });
      await refetchWallets();
      if (selectedWalletId === id) {
        setSelectedWalletId(null);
      }
      return result;
    } catch (error) {
      console.error('Error deleting wallet:', error);
      throw error;
    }
  };

  // Select wallet
  const selectWallet = (id: string) => {
    setSelectedWalletId(id);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedWalletId(null);
  };

  return {
    // Data
    wallets,
    selectedWallet,
    
    // Loading states
    isLoadingWallets,
    isLoadingSelectedWallet,
    isCreatingWallet: createWalletMutation.isPending,
    isUpdatingWallet: updateWalletMutation.isPending,
    isDeletingWallet: deleteWalletMutation.isPending,
    
    // Actions
    createWallet,
    updateWallet,
    deleteWallet,
    selectWallet,
    clearSelection,
    refetchWallets,
    
    // Selection state
    selectedWalletId,
  };
}; 