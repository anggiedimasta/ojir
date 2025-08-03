"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./button";
import { PaymentMethodIcon } from "./payment-method-icon";
import { api } from "~/trpc/react";
import type { PaymentMethodFilterType } from "~/entities/api/wallet";

interface PaymentMethodFilterProps {
  value: PaymentMethodFilterType;
  onChange: (value: PaymentMethodFilterType) => void;
  className?: string;
}

export function PaymentMethodFilter({ value, onChange, className = "" }: PaymentMethodFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: paymentMethods, isLoading, error } = api.masterData.getPaymentMethods.useQuery();

  // Create options from master data
  const paymentMethodOptions = [
    { value: 'all' as const, label: 'All Methods', icon: null },
    ...(paymentMethods?.map(method => ({
      value: method.code as PaymentMethodFilterType,
      label: method.displayName,
      icon: method.name,
    })) || []),
  ];

  const selectedMethod = paymentMethodOptions.find(option => option.value === value);

  const handleSelect = (selectedValue: PaymentMethodFilterType) => {
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
            <PaymentMethodIcon methodName="loading" className="w-4 h-4" />
            Loading methods...
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </div>
    );
  }

  // If no payment methods are available, show a disabled state
  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <Button
          color="gray"
          className="w-full justify-between bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
          disabled
        >
          <span className="flex items-center gap-2">
            <PaymentMethodIcon methodName="no-methods" className="w-4 h-4" />
            No methods available
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
          {selectedMethod?.icon ? (
            <PaymentMethodIcon methodName={selectedMethod.icon} className="w-4 h-4" />
          ) : (
            <PaymentMethodIcon methodName="all" className="w-4 h-4" />
          )}
          {selectedMethod?.label || 'All Methods'}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {paymentMethodOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 ${
                option.value === value ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.icon ? (
                <PaymentMethodIcon methodName={option.icon} className="w-4 h-4" />
              ) : (
                <PaymentMethodIcon methodName="all" className="w-4 h-4" />
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