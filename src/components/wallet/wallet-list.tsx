"use client";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Edit, Trash2 } from "lucide-react";

import { BankIcon } from "~/components/ui/bank-icon";
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
  isLoading
}: WalletListProps) {
  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(num));
  };

  return (
    <div className="space-y-4">
      {wallets.length === 0 ? (
        <Card className="p-8 text-center border-2 border-yellow-200 bg-yellow-50/50">
          <div className="text-gray-700 mb-4">
            <BankIcon bankName="unknown" className="w-12 h-12 mx-auto mb-4" />
            <h4 className="text-lg font-medium mb-2">Create Your First Wallet</h4>
            <p className="text-sm mb-3">
              You need to create at least one wallet before you can sync emails and import transactions
            </p>
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800 font-medium">
                🔒 Email sync is locked until you create a wallet
              </p>
            </div>
          </div>
          <Button onClick={onAddWallet} className="bg-blue-600 hover:bg-blue-700 text-white">
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
                  ? selectedWalletIds.filter(id => id !== wallet.id)
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
            className="p-2 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
            onClick={onAddWallet}
          >
            <div className="flex flex-col items-center justify-center h-full min-h-[80px] text-gray-500 hover:text-blue-600">
              <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-xs font-medium">Add Wallet</p>
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
  formatCurrency
}: WalletCardProps) {
  const getWalletTypeLabel = (type: string) => {
    switch (type) {
      case 'debit': return 'Debit';
      case 'credit': return 'Credit';
      case 'savings': return 'Savings';
      case 'current': return 'Current';
      case 'investment': return 'Investment';
      default: return type;
    }
  };



  return (
    <Card
      className={`p-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'ring-2 ring-blue-500 bg-blue-50'
          : 'hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center overflow-hidden">
            <BankIcon bankName={wallet.bankCode} className="w-full h-full" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 text-sm">{wallet.name}</h4>
            <p className="text-xs text-gray-500">{wallet.bank?.name || 'Unknown Bank'}</p>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-0.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800"
            title="Edit"
          >
            <Edit className="w-3 h-3" />
          </button>
          {wallet.name !== 'Uncategorized' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-0.5 hover:bg-gray-100 rounded text-red-500 hover:text-red-700"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1">
          <span className="px-1 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
            {getWalletTypeLabel(wallet.type)}
          </span>
          {wallet.isDefault && (
            <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
              Default
            </span>
          )}
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(wallet.balance)}
          </p>
          {wallet.accountNumber && (
            <p className="text-xs text-gray-500">
              ****{wallet.accountNumber}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}