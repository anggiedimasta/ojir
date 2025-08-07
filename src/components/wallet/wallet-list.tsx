"use client";

import { Edit, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

import { BankIcon } from "~/components/ui/bank-icon";
import { WALLET_COLORS } from "~/components/ui/color-picker";
import type { WalletWithBank } from "~/entities/api/wallet";

interface WalletListProps {
	wallets: WalletWithBank[];
	selectedWalletIds: string[];
	onSelectWallets: (walletIds: string[]) => void;
	onAddWallet: () => void;
	onEditWallet: (wallet: WalletWithBank) => void;
	onDeleteWallet: (walletId: string) => void;
	isLoading?: boolean;
}

export function WalletList({
	wallets,
	selectedWalletIds,
	onSelectWallets,
	onAddWallet,
	onEditWallet,
	onDeleteWallet,
	isLoading,
}: WalletListProps) {
	const formatCurrency = (amount: string) => {
		const num = Number.parseFloat(amount);
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(Math.abs(num));
	};

	return (
		<div className="space-y-4">
			{wallets.length === 0 ? (
				<Card className="border-2 border-yellow-200 bg-yellow-50/50 p-8 text-center">
					<div className="mb-4 text-gray-700">
						<BankIcon bankName="unknown" className="mx-auto mb-4 h-12 w-12" />
						<h4 className="mb-2 font-medium text-lg">
							Create Your First Wallet
						</h4>
						<p className="mb-3 text-sm">
							You need to create at least one wallet before you can sync emails
							and import transactions
						</p>
						<div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-100 p-3">
							<p className="font-medium text-sm text-yellow-800">
								🔒 Email sync is locked until you create a wallet
							</p>
						</div>
					</div>
					<Button
						onClick={onAddWallet}
						className="bg-blue-600 text-white hover:bg-blue-700"
					>
						Create Your First Wallet
					</Button>
				</Card>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{wallets.map((wallet) => (
						<WalletCard
							key={wallet.id}
							wallet={wallet}
							isSelected={selectedWalletIds.includes(wallet.id)}
							onSelect={() => {
								const newSelectedIds = selectedWalletIds.includes(wallet.id)
									? selectedWalletIds.filter((id) => id !== wallet.id)
									: [...selectedWalletIds, wallet.id];
								onSelectWallets(newSelectedIds);
							}}
							onEdit={() => onEditWallet(wallet)}
							onDelete={() => onDeleteWallet(wallet.id)}
							formatCurrency={formatCurrency}
						/>
					))}

					{/* Add Wallet Button at the end */}
					<Card
						className="cursor-pointer border-2 border-gray-300 border-dashed p-2 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50"
						onClick={onAddWallet}
					>
						<div className="flex h-full min-h-[80px] flex-col items-center justify-center text-gray-500 hover:text-blue-600">
							<div className="mb-2 flex h-6 w-6 items-center justify-center rounded bg-blue-100">
								<svg
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									role="img"
									aria-label="Add wallet"
								>
									<title>Add wallet</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									/>
								</svg>
							</div>
							<p className="font-medium text-xs">Add Wallet</p>
						</div>
					</Card>
				</div>
			)}
		</div>
	);
}

interface WalletCardProps {
	wallet: WalletWithBank;
	isSelected: boolean;
	onSelect: () => void;
	onEdit: () => void;
	onDelete: () => void;
	formatCurrency: (amount: string) => string;
}

function WalletCard({
	wallet,
	isSelected,
	onSelect,
	onEdit,
	onDelete,
	formatCurrency,
}: WalletCardProps) {
	const getWalletTypeLabel = (type: string) => {
		switch (type) {
			case "debit":
				return "Debit";
			case "credit":
				return "Credit";
			case "savings":
				return "Savings";
			case "current":
				return "Current";
			case "investment":
				return "Investment";
			default:
				return type;
		}
	};

	const getWalletGradient = (
		color: string | null | undefined,
		isSelected: boolean,
	) => {
		const colorConfig = WALLET_COLORS.find((c) => c.value === color);
		if (isSelected) {
			return `bg-gradient-to-br ${colorConfig?.gradient || "from-slate-800 via-slate-700 to-slate-900"}`;
		}
		// Muted version for unselected wallets - flat, matte appearance
		return "bg-slate-500";
	};

	return (
		<div
			className="group relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
			onClick={onSelect}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onSelect();
				}
			}}
		>
			{/* Credit Card Style Container */}
			<div
				className={`relative flex h-[200px] flex-col overflow-hidden rounded-xl p-4 text-white shadow-lg transition-all duration-300 ${getWalletGradient(wallet.color, isSelected)}`}
			>
				{/* Decorative circles */}
				<div className="-translate-y-10 absolute top-0 right-0 h-20 w-20 translate-x-10 rounded-full bg-white/10" />
				<div className="-translate-x-8 absolute bottom-0 left-0 h-16 w-16 translate-y-8 rounded-full bg-white/5" />

				{/* Card Header */}
				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white/20 backdrop-blur-sm">
							<BankIcon bankName={wallet.bankCode} className="h-full w-full" />
						</div>
						<div>
							<h4 className="font-semibold text-sm text-white">
								{wallet.name}
							</h4>
							<p className="text-white/70 text-xs">
								{wallet.bank?.name || "Unknown Bank"}
							</p>
						</div>
					</div>

					{/* Action buttons */}
					<div
						className={`flex gap-1 transition-opacity duration-200 ${
							isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
						}`}
					>
						{wallet.name !== "Uncategorized" && (
							<>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										onEdit();
									}}
									className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
									title="Edit wallet"
								>
									<Edit className="h-4 w-4" />
								</button>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										onDelete();
									}}
									className="rounded-lg p-1.5 text-red-300 transition-colors hover:bg-white/20 hover:text-red-200"
									title="Delete wallet"
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</>
						)}
					</div>
				</div>

				{/* Card Number - Only show if account number exists */}
				{wallet.accountNumber && (
					<div className="mb-4">
						<p className="mb-1 text-white/60 text-xs">Card Number</p>
						<p className="font-mono text-lg text-white tracking-wider">
							**** **** **** {wallet.accountNumber.slice(-4)}
						</p>
					</div>
				)}

				{/* Spacer to push footer to bottom */}
				<div className="flex-1" />

				{/* Card Footer - Always at bottom */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="rounded-lg bg-white/20 px-2 py-1 text-white text-xs backdrop-blur-sm">
							{getWalletTypeLabel(wallet.type)}
						</span>
						{wallet.isDefault && (
							<span className="rounded-lg bg-white/20 px-2 py-1 text-white text-xs backdrop-blur-sm">
								Default
							</span>
						)}
					</div>

					<div className="text-right">
						<p className="mb-1 text-white/60 text-xs">Balance</p>
						<p className="font-bold text-lg text-white">
							{formatCurrency(wallet.balance)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
