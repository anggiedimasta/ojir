import { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import type { TransactionResponse } from "~/entities/api/wallet";

export function useBulkUpdate() {
  const { toast } = useToast();
  const utils = api.useUtils();

  // Bulk update state
  const [showBulkUpdateConfirm, setShowBulkUpdateConfirm] = useState(false);
  const [pendingWalletChange, setPendingWalletChange] = useState<{ fromIds: string[], toId: string } | null>(null);

  // Bulk update transactions mutation
  const bulkUpdateTransactionsMutation = api.wallet.bulkUpdateTransactionWallets.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Transactions Updated",
        description: data.message,
      });
      // Refresh transactions and summary
      utils.wallet.getTransactions.invalidate();
      utils.wallet.getTransactionCount.invalidate();
      utils.wallet.getSummary.invalidate();
      setShowBulkUpdateConfirm(false);
      setPendingWalletChange(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to Update Transactions",
        description: error.message,
        variant: "destructive",
      });
      setShowBulkUpdateConfirm(false);
      setPendingWalletChange(null);
    },
  });

  const handleConfirmBulkUpdate = async (transactions: TransactionResponse[] | undefined) => {
    if (!pendingWalletChange || !transactions) return;

    // Get transaction IDs from the old wallets
    const transactionIds = transactions
      .filter(t => t.walletId && pendingWalletChange.fromIds.includes(t.walletId))
      .map(t => t.id as string);

    if (transactionIds.length === 0) {
      setShowBulkUpdateConfirm(false);
      setPendingWalletChange(null);
      return;
    }

    await bulkUpdateTransactionsMutation.mutateAsync({
      walletId: pendingWalletChange.toId!,
      transactionIds: transactionIds,
    });
  };

  const handleCancelBulkUpdate = () => {
    setShowBulkUpdateConfirm(false);
    setPendingWalletChange(null);
  };

  const showBulkUpdateDialog = (fromIds: string[], toId: string) => {
    setPendingWalletChange({ fromIds, toId });
    setShowBulkUpdateConfirm(true);
  };

  return {
    // State
    showBulkUpdateConfirm,
    pendingWalletChange,

    // Mutation
    bulkUpdateTransactionsMutation,

    // Handlers
    handleConfirmBulkUpdate,
    handleCancelBulkUpdate,
    showBulkUpdateDialog,
  };
}