"use client";

import { Button } from "~/components/ui/button";
import { Modal } from "~/components/ui/modal";
import { WalletForm } from "~/components/wallet/wallet-form";
import type { Bank, WalletWithBank } from "~/entities/api/wallet";

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
	isLoading,
}: WalletFormModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={editingWallet ? "Edit Wallet" : "Create New Wallet"}
			description={
				editingWallet
					? "Update your wallet information"
					: "Add a new wallet to manage your transactions"
			}
			size="2xl"
			closeOnOverlayClick={true}
			closeOnEscape={true}
			footer={
				<div className="flex w-full gap-3">
					<button
						type="button"
						onClick={onCancel}
						disabled={isLoading}
						className="flex-1 cursor-pointer rounded-lg bg-gray-100 py-2.5 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						form="wallet-form"
						disabled={isLoading}
						className="flex-1 cursor-pointer rounded-lg bg-blue-600 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isLoading
							? "Saving..."
							: editingWallet
								? "Update Wallet"
								: "Create Wallet"}
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
