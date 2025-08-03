"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./button";
import { BankIcon } from "./bank-icon";
import { api } from "~/trpc/react";
import type { BankFilterType } from "~/entities/api/wallet";

interface BankFilterProps {
  value: BankFilterType;
  onChange: (value: BankFilterType) => void;
  className?: string;
}

export function BankFilter({ value, onChange, className = "" }: BankFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: banks, isLoading, error } = api.masterData.getBanks.useQuery();

  // Create options from master data
  const bankOptions = [
    { value: 'all' as const, label: 'All Banks', icon: null },
    ...(banks?.map(bank => ({
      value: bank.code as BankFilterType,
      label: bank.displayName,
      icon: bank.name,
    })) || []),
  ];

  const selectedBank = bankOptions.find(option => option.value === value);

  const handleSelect = (selectedValue: BankFilterType) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className={`relative ${className}`}>
        <Button
          color="gray"
          className="w-full justify-between bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
          disabled
        >
          <span className="flex items-center gap-2">
            <BankIcon bankName="loading" className="w-4 h-4" />
            Loading banks...
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </div>
    );
  }

  // If no banks are available, show a disabled state
  if (!banks || banks.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <Button
          color="gray"
          className="w-full justify-between bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
          disabled
        >
          <span className="flex items-center gap-2">
            <BankIcon bankName="no-banks" className="w-4 h-4" />
            No banks available
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        color="gray"
        className="w-full justify-between bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          {selectedBank?.icon ? (
            <BankIcon bankName={selectedBank.icon} className="w-4 h-4" />
          ) : (
            <BankIcon bankName="all" className="w-4 h-4" />
          )}
          {selectedBank?.label || 'All Banks'}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {bankOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 ${
                option.value === value ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.icon ? (
                <BankIcon bankName={option.icon} className="w-4 h-4" />
              ) : (
                <BankIcon bankName="all" className="w-4 h-4" />
              )}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Backdrop to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}