"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type {
  PaymentMethodFilterType,
  PaymentMethodFilterValue,
} from "~/entities/api/wallet";
import { api } from "~/trpc/react";
import { Button } from "./button";
import { PaymentMethodIcon } from "./payment-method-icon";

interface PaymentMethodFilterProps {
  value: PaymentMethodFilterValue;
  onChange: (value: PaymentMethodFilterValue) => void;
  className?: string;
}

export function PaymentMethodFilter({
  value,
  onChange,
  className = "",
}: PaymentMethodFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: paymentMethods,
    isLoading,
    error,
  } = api.masterData.getPaymentMethods.useQuery();

  // Create options from master data
  const paymentMethodOptions = [
    { value: "all" as const, label: "All Methods", icon: null },
    ...(paymentMethods?.map((method) => ({
      value: method.code as PaymentMethodFilterType,
      label: method.name,
      icon: method.name,
    })) || []),
  ];

  // Handle multiple selections
  const isAllSelected = value.includes("all") || value.length === 0;

  const handleSelect = (selectedValue: PaymentMethodFilterType) => {
    if (selectedValue === "all") {
      onChange(["all"]);
    } else {
      if (isAllSelected) {
        // If "all" was selected, replace with just this value
        onChange([selectedValue]);
      } else {
        // Toggle the selection
        const newSelection = value.includes(selectedValue)
          ? value.filter((method) => method !== selectedValue)
          : [...value, selectedValue];

        onChange(newSelection.length === 0 ? ["all"] : newSelection);
      }
    }
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className={`relative ${className}`}>
        <Button
          color="gray"
          className="rounded-lg border-slate-200 bg-white px-3 py-2 text-slate-700 transition-all duration-200 hover:bg-slate-50"
          disabled
        >
          <PaymentMethodIcon methodName="loading" className="h-4 w-4" />
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </div>
    );
  }

  if (!paymentMethods || paymentMethods.length === 0) {
    // If no payment methods are available, show a disabled state
    return (
      <div className={`relative ${className}`}>
        <Button
          color="gray"
          className="rounded-lg border-slate-200 bg-white px-3 py-2 text-slate-700 transition-all duration-200 hover:bg-slate-50"
          disabled
        >
          <PaymentMethodIcon methodName="no-methods" className="h-4 w-4" />
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        color="gray"
        className="rounded-lg border-slate-200 bg-white px-3 py-2 text-slate-700 transition-all duration-200 hover:bg-slate-50"
        onClick={() => setIsOpen(!isOpen)}
        title={
          isAllSelected
            ? "All Methods"
            : `${value.length} method${value.length !== 1 ? "s" : ""} selected`
        }
      >
        {isAllSelected ? (
          <PaymentMethodIcon methodName="all" className="h-4 w-4" />
        ) : value.length === 1 ? (
          <PaymentMethodIcon
            methodName={
              paymentMethodOptions.find((opt) => opt.value === value[0])
                ?.icon || "all"
            }
            className="h-4 w-4"
          />
        ) : (
          <PaymentMethodIcon methodName="multiple" className="h-4 w-4" />
        )}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-max min-w-[200px] overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
          {paymentMethodOptions.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <button
                type="button"
                key={option.value}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-slate-50 ${
                  isSelected ? "bg-blue-50 text-blue-600" : "text-slate-700"
                }`}
                onClick={() => handleSelect(option.value)}
              >
                <div
                  className={`h-3 w-3 rounded border ${isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}
                >
                  {isSelected && (
                    <svg
                      className="mx-auto mt-0.5 h-2 w-2 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      role="img"
                      aria-label="Selected payment method"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                {option.icon ? (
                  <PaymentMethodIcon
                    methodName={option.icon}
                    className="h-3 w-3"
                  />
                ) : (
                  <PaymentMethodIcon methodName="all" className="h-3 w-3" />
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
          role="button"
          tabIndex={0}
          aria-label="Close dropdown"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(false);
            }
          }}
        />
      )}
    </div>
  );
}
