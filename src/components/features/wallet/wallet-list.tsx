"use client";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Edit, Trash2 } from "lucide-react";

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

  const getWalletGradient = (color: string | null | undefined, isSelected: boolean) => {
    const colorConfig = WALLET_COLORS.find(c => c.value === color);
    if (isSelected) {
      return `bg-gradient-to-br ${colorConfig?.gradient || 'from-slate-800 via-slate-700 to-slate-900'}`;
    } else {
      // Muted version for unselected wallets - flat, matte appearance
      return `bg-slate-500`;
    }
  };



  return (
    <div
      className="relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group"
      onClick={onSelect}
    >
             {/* Credit Card Style Container */}
       <div className={`relative overflow-hidden rounded-xl p-4 text-white shadow-lg h-[200px] transition-all duration-300 flex flex-col ${getWalletGradient(wallet.color, isSelected)}`}>

         {/* Decorative circles */}
         <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
         <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>



         {/* Card Header */}
         <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden backdrop-blur-sm">
               <BankIcon bankName={wallet.bankCode} className="w-full h-full" />
             </div>
             <div>
               <h4 className="font-semibold text-white text-sm">{wallet.name}</h4>
               <p className="text-xs text-white/70">{wallet.bank?.name || 'Unknown Bank'}</p>
             </div>
           </div>

                       {/* Action buttons */}
            <div className={`flex gap-1 transition-opacity duration-200 ${
              isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              {wallet.name !== 'Uncategorized' && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                    className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors"
                    title="Edit wallet"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="p-1.5 hover:bg-white/20 rounded-lg text-red-300 hover:text-red-200 transition-colors"
                    title="Delete wallet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
         </div>

         {/* Card Number - Only show if account number exists */}
         {wallet.accountNumber && (
           <div className="mb-4">
             <p className="text-xs text-white/60 mb-1">Card Number</p>
             <p className="font-mono text-lg tracking-wider text-white">
               **** **** **** {wallet.accountNumber.slice(-4)}
             </p>
           </div>
         )}

         {/* Spacer to push footer to bottom */}
         <div className="flex-1"></div>

         {/* Card Footer - Always at bottom */}
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-lg backdrop-blur-sm">
               {getWalletTypeLabel(wallet.type)}
             </span>
                           {wallet.isDefault && (
                <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-lg backdrop-blur-sm">
                  Default
                </span>
              )}
           </div>

           <div className="text-right">
             <p className="text-xs text-white/60 mb-1">Balance</p>
             <p className="text-lg font-bold text-white">
               {formatCurrency(wallet.balance)}
             </p>
           </div>
         </div>
       </div>
    </div>
  );
}