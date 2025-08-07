import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "../atoms/button";
import { Icon } from "../atoms/icon";

interface WalletHeaderProps {
	onSync: () => void;
	onClear: () => void;
	isLoading: boolean;
	isSyncPending: boolean;
	isClearPending: boolean;
	hasWallets?: boolean;
}

export function WalletHeader({
	onSync,
	onClear,
	isLoading,
	isSyncPending,
	isClearPending,
	hasWallets = true,
}: WalletHeaderProps) {
	return (
		<div className="mb-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text font-bold text-4xl text-transparent tracking-tight">
						Wallet Dashboard
					</h1>
					<p className="mt-2 text-lg text-slate-600">
						Track your transactions from bank emails
					</p>
				</div>
				<div className="flex gap-3">
					<Button
						onClick={onSync}
						disabled={isLoading || isSyncPending || !hasWallets}
						variant="outline"
						className={cn(
							"flex items-center gap-2",
							!hasWallets && "cursor-not-allowed opacity-50",
						)}
						title={
							!hasWallets
								? "Create at least one wallet to enable email sync"
								: undefined
						}
					>
						<Icon
							icon={RefreshCw}
							size="sm"
							className={cn(isLoading || isSyncPending ? "animate-spin" : "")}
						/>
						Sync Emails
					</Button>
					<Button
						onClick={onClear}
						disabled={isClearPending}
						variant="outline"
						className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
					>
						<Icon icon={Trash2} size="sm" />
						Clear All
					</Button>
					<Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl">
						<Icon icon={Plus} size="sm" />
						Add Transaction
					</Button>
				</div>
			</div>
		</div>
	);
}
