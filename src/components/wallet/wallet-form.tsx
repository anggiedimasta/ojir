"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { BankIcon } from "~/components/ui/bank-icon";
import type { CreateWalletInput, UpdateWalletInput, Bank, Wallet } from "~/entities/api/wallet";

interface WalletFormProps {
  wallet?: Wallet;
  banks: Bank[];
  onSubmit: (data: CreateWalletInput | UpdateWalletInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onRenderFooter?: (props: {
    handleSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    formData: any;
  }) => React.ReactNode;
}

const walletTypes = [
  { value: 'debit', label: 'Debit Card' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'savings', label: 'Savings Account' },
  { value: 'current', label: 'Current Account' },
  { value: 'investment', label: 'Investment Account' },
] as const;

export function WalletForm({ wallet, banks, onSubmit, onCancel, isLoading, onRenderFooter }: WalletFormProps) {
  const [formData, setFormData] = useState({
    name: wallet?.name || '',
    type: wallet?.type || 'debit',
    bankCode: wallet?.bankCode || '',
    accountNumber: wallet?.accountNumber || '',
    balance: wallet?.balance ? parseFloat(wallet.balance) : 0,
    currency: wallet?.currency || 'IDR',
    isDefault: wallet?.isDefault || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      balance: formData.balance,
    };

    if (wallet) {
      // Update existing wallet
      onSubmit({
        id: wallet.id,
        ...submitData,
      } as UpdateWalletInput);
    } else {
      // Create new wallet
      onSubmit(submitData as CreateWalletInput);
    }
  };

  const selectedBank = banks.find(bank => bank.code === formData.bankCode);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6" id="wallet-form">
        {/* Wallet Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wallet Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Mandiri Debit, BCA Savings"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 cursor-text"
            required
          />
        </div>

        {/* Bank Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank *
          </label>
          <select
            value={formData.bankCode}
            onChange={(e) => setFormData({ ...formData, bankCode: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 cursor-pointer"
            required
          >
            <option value="" className="text-gray-500">Select a bank</option>
            {banks.map((bank) => (
              <option key={bank.code} value={bank.code} className="text-gray-900">
                {bank.name}
              </option>
            ))}
          </select>
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last 4 Digits of Account Number
          </label>
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            placeholder="1234"
            maxLength={4}
            pattern="\d{4}"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 cursor-text"
          />
          <p className="text-sm text-gray-500 mt-1">
            Required for email syncing. Only the last 4 digits for security.
          </p>
        </div>

        {/* Wallet Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 cursor-pointer"
            required
          >
            {walletTypes.map((type) => (
              <option key={type.value} value={type.value} className="text-gray-900">
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Initial Balance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Balance
          </label>
          <input
            type="number"
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            step="0.01"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 cursor-text"
          />
        </div>



        {/* Default Wallet */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="isDefault"
            checked={formData.isDefault}
            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
            Set as default wallet
          </label>
        </div>
      </form>
    </div>
  );
}