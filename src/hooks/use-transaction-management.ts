import { useState } from "react";
import type { TransactionResponse } from "~/entities/api/wallet";
import { api } from "~/trpc/react";

export function useTransactionManagement() {
	// Transaction edit state
	const [editingTransaction, setEditingTransaction] =
		useState<TransactionResponse | null>(null);
	const [showTransactionEditForm, setShowTransactionEditForm] = useState(false);

	const utils = api.useUtils();

	const handleEditTransaction = (transaction: TransactionResponse) => {
		setEditingTransaction(transaction);
		setShowTransactionEditForm(true);
	};

	const handleCloseTransactionEditForm = () => {
		setShowTransactionEditForm(false);
		setEditingTransaction(null);
	};

	const handleTransactionEditSuccess = () => {
		// Refresh transactions after successful edit
		utils.wallet.getTransactions.invalidate();
		utils.wallet.getTransactionCount.invalidate();
		utils.wallet.getSummary.invalidate();
	};

	return {
		// State
		editingTransaction,
		showTransactionEditForm,

		// Handlers
		handleEditTransaction,
		handleCloseTransactionEditForm,
		handleTransactionEditSuccess,
	};
}
