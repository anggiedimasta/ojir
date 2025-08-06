"use client";

import { Modal } from "~/components/ui/modal";
import { Button } from "~/components/ui/button";
import { WalletForm } from "~/components/wallet/wallet-form";
import type { WalletWithBank, Bank } from "~/entities/api/wallet";

interface WalletFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingWallet: WalletWithBank | null;
  banks: Bank[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function WalletFormModal({
  isOpen,
  onClose,
  editingWallet,
  banks,
  onSubmit,
  onCancel,
  isLoading
}: WalletFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingWallet ? 'Edit Wallet' : 'Create New Wallet'}
      description={editingWallet ? 'Update your wallet information' : 'Add a new wallet to manage your transactions'}
      size="2xl"
      closeOnOverlayClick={true}
      closeOnEscape={true}
      footer={
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="wallet-form"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? 'Saving...' : (editingWallet ? 'Update Wallet' : 'Create Wallet')}
          </button>
        </div>
      }
    >
      <WalletForm
        wallet={editingWallet || undefined}
        banks={banks}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isLoading={isLoading}
      />
    </Modal>
  );
}