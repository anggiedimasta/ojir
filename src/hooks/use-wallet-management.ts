import { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import type {
	CreateWalletInput,
	UpdateWalletInput,
	WalletWithBank,
} from "~/entities/api/wallet";
import { api } from "~/trpc/react";

export function useWalletManagement() {
	const { toast } = useToast();
	const utils = api.useUtils();

	// Wallet management state
	const [showWalletForm, setShowWalletForm] = useState(false);
	const [editingWallet, setEditingWallet] = useState<WalletWithBank | null>(
		null,
	);

	// Wallet management mutations
	const createWalletMutation = api.wallet.createWallet.useMutation({
		onSuccess: () => {
			toast({
				title: "Wallet Created",
				description: "Your wallet has been created successfully.",
			});
			setShowWalletForm(false);
			setEditingWallet(null);
			// Invalidate and refetch wallet queries
			utils.wallet.getWallets.invalidate();
		},
		onError: (error) => {
			toast({
				title: "Failed to Create Wallet",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const updateWalletMutation = api.wallet.updateWallet.useMutation({
		onSuccess: () => {
			toast({
				title: "Wallet Updated",
				description: "Your wallet has been updated successfully.",
			});
			setShowWalletForm(false);
			setEditingWallet(null);
			// Invalidate and refetch wallet queries
			utils.wallet.getWallets.invalidate();
		},
		onError: (error) => {
			toast({
				title: "Failed to Update Wallet",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const deleteWalletMutation = api.wallet.deleteWallet.useMutation({
		onSuccess: () => {
			toast({
				title: "Wallet Deleted",
				description: "Your wallet has been deleted successfully.",
			});
			// Invalidate and refetch wallet queries
			utils.wallet.getWallets.invalidate();
		},
		onError: (error) => {
			toast({
				title: "Failed to Delete Wallet",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	// Wallet management handlers
	const handleAddWallet = () => {
		setEditingWallet(null);
		setShowWalletForm(true);
	};

	const handleEditWallet = (wallet: WalletWithBank) => {
		setEditingWallet(wallet);
		setShowWalletForm(true);
	};

	const handleDeleteWallet = async (walletId: string) => {
		if (
			window.confirm(
				"Are you sure you want to delete this wallet? This cannot be undone.",
			)
		) {
			await deleteWalletMutation.mutateAsync({ id: walletId });
		}
	};

	const handleWalletSubmit = async (
		data: CreateWalletInput | UpdateWalletInput,
	) => {
		if (editingWallet) {
			await updateWalletMutation.mutateAsync(data as UpdateWalletInput);
		} else {
			await createWalletMutation.mutateAsync(data as CreateWalletInput);
		}
	};

	const handleCancelWalletForm = () => {
		setShowWalletForm(false);
		setEditingWallet(null);
	};

	return {
		// State
		showWalletForm,
		editingWallet,

		// Mutations
		createWalletMutation,
		updateWalletMutation,
		deleteWalletMutation,

		// Handlers
		handleAddWallet,
		handleEditWallet,
		handleDeleteWallet,
		handleWalletSubmit,
		handleCancelWalletForm,
	};
}
