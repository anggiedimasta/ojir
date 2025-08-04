"use client";

import { Modal } from "~/components/ui/modal";
import { Button } from "~/components/ui/button";
import type { TransactionResponse, WalletWithBank } from "~/entities/api/wallet";

interface BulkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pendingWalletChange: { fromIds: string[], toId: string } | null;
  transactions: TransactionResponse[] | undefined;
  wallets: WalletWithBank[];
  isPending: boolean;
}

export function BulkUpdateModal({
  isOpen,
  onClose,
  onConfirm,
  pendingWalletChange,
  transactions,
  wallets,
  isPending
}: BulkUpdateModalProps) {
  const transactionCount = pendingWalletChange && transactions
    ? transactions.filter(t => t.walletId && pendingWalletChange.fromIds.includes(t.walletId)).length
    : 0;

  const targetWalletName = pendingWalletChange
    ? wallets.find(w => w.id === pendingWalletChange.toId)?.name || 'the selected wallet'
    : '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Move Transactions"
      description="Move transactions to the selected wallet"
      footer={
        <div className="flex gap-3 w-full">
          <Button
            type="button"
            color="gray"
            onClick={onClose}
            disabled={isPending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            color="blue"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Moving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Move Transactions
              </div>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-medium text-blue-900">Confirm Transaction Move</h4>
          </div>
          <p className="text-sm text-blue-700">
            {pendingWalletChange && (
              <>
                Move <strong>{transactionCount}</strong> transactions from the current wallet selection to{' '}
                <strong>{targetWalletName}</strong>?
              </>
            )}
          </p>
        </div>

        <div className="text-sm text-gray-600">
          <p>This action will:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Update all selected transactions to the new wallet</li>
            <li>Update transaction summaries and balances</li>
            <li>Cannot be undone automatically</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}