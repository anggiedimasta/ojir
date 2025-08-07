import { AlertCircle, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { WalletHeaderProps } from "~/entities/api/wallet";

export function WalletHeader({
	hasWallets = true,
	selectedWalletIds = [],
	wallets = [],
	onClearSelection,
}: WalletHeaderProps) {
	const selectedWallets = wallets.filter((wallet) =>
		selectedWalletIds.includes(wallet.id),
	);
	const isAllWalletsSelected =
		selectedWalletIds.length === wallets.length && wallets.length > 0;

	return (
		<div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div className="flex flex-col gap-2">
				<h1 className="font-bold text-2xl text-slate-900">Wallet Management</h1>

				{/* Selected wallets indicator */}
				{selectedWalletIds.length > 0 ? (
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-slate-600 text-sm">
							{isAllWalletsSelected
								? "Showing transactions from all wallets"
								: `Showing transactions from ${selectedWalletIds.length} selected wallet${selectedWalletIds.length > 1 ? "s" : ""}`}
						</span>
						{!isAllWalletsSelected && (
							<Button
								color="ghost"
								size="sm"
								onClick={onClearSelection}
								className="h-6 px-2 text-slate-500 text-xs hover:text-slate-700"
							>
								<X className="mr-1 h-3 w-3" />
								Clear
							</Button>
						)}
					</div>
				) : (
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-slate-500 text-sm">
							No wallets selected - select wallets to view transactions
						</span>
						<Button
							color="ghost"
							size="sm"
							onClick={onClearSelection}
							className="h-6 px-2 text-slate-500 text-xs hover:text-slate-700"
						>
							Select All
						</Button>
					</div>
				)}
			</div>

			<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
				{!hasWallets && (
					<div className="flex items-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
						<AlertCircle className="h-4 w-4" />
						<span>Create a wallet to sync emails</span>
					</div>
				)}
			</div>
		</div>
	);
}
