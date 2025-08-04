"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./button";
import { PaymentMethodIcon } from "./payment-method-icon";
import { api } from "~/trpc/react";
import type { PaymentMethodFilterType, PaymentMethodFilterValue } from "~/entities/api/wallet";

interface PaymentMethodFilterProps {
  value: PaymentMethodFilterValue;
  onChange: (value: PaymentMethodFilterValue) => void;
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

  // Handle multiple selections
  const isAllSelected = value.includes('all') || value.length === 0;

  const handleSelect = (selectedValue: PaymentMethodFilterType) => {
    if (selectedValue === 'all') {
      onChange(['all']);
    } else {
      if (isAllSelected) {
        // If "all" was selected, replace with just this value
        onChange([selectedValue]);
      } else {
        // Toggle the selection
        const newSelection = value.includes(selectedValue)
          ? value.filter(method => method !== selectedValue)
          : [...value, selectedValue];

        onChange(newSelection.length === 0 ? ['all'] : newSelection);
      }
    }
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className={`relative ${className}`}>
        <Button
          color="gray"
          className="px-3 py-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 rounded-lg transition-all duration-200"
          disabled
        >
          <PaymentMethodIcon methodName="loading" className="w-4 h-4" />
          <ChevronDown className="w-4 h-4 opacity-50" />
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
          className="px-3 py-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 rounded-lg transition-all duration-200"
          disabled
        >
          <PaymentMethodIcon methodName="no-methods" className="w-4 h-4" />
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
             <Button
         color="gray"
         className="px-3 py-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 rounded-lg transition-all duration-200"
         onClick={() => setIsOpen(!isOpen)}
         title={isAllSelected ? 'All Methods' : `${value.length} method${value.length !== 1 ? 's' : ''} selected`}
       >
         {isAllSelected ? (
           <PaymentMethodIcon methodName="all" className="w-4 h-4" />
         ) : value.length === 1 ? (
           <PaymentMethodIcon methodName={paymentMethodOptions.find(opt => opt.value === value[0])?.icon || 'all'} className="w-4 h-4" />
         ) : (
           <PaymentMethodIcon methodName="multiple" className="w-4 h-4" />
         )}
         <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
       </Button>

             {/* Dropdown Menu */}
       {isOpen && (
         <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 min-w-[200px] w-max max-h-60 overflow-y-auto">
           {paymentMethodOptions.map((option) => {
             const isSelected = value.includes(option.value);
             return (
               <button
                 key={option.value}
                 className={`w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-xs ${
                   isSelected ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                 }`}
                 onClick={() => handleSelect(option.value)}
               >
                 <div className={`w-3 h-3 border rounded ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                   {isSelected && (
                     <svg className="w-2 h-2 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                     </svg>
                   )}
                 </div>
                 {option.icon ? (
                   <PaymentMethodIcon methodName={option.icon} className="w-3 h-3" />
                 ) : (
                   <PaymentMethodIcon methodName="all" className="w-3 h-3" />
                 )}
                 <span>{option.label}</span>
               </button>
             );
           })}
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