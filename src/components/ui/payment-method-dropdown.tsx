"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "./button";
import { Card } from "./card";
import { DynamicIcon } from "./dynamic-icon";

interface PaymentMethodDropdownProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function PaymentMethodDropdown({
  value,
  onChange,
  className = "",
  placeholder = "Select payment method",
}: PaymentMethodDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch payment methods from database
  const { data: paymentMethods = [], isLoading } =
    api.masterData.getPaymentMethods.useQuery();

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (methodValue: string) => {
    onChange(methodValue);
    setIsOpen(false);
  };

  const selectedMethod = paymentMethods.find((method) => method.code === value);

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <Button
        type="button"
        color="ghost"
        className="h-10 w-full justify-between border border-gray-300 bg-white text-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select payment method"
        disabled={isLoading}
      >
        <div className="flex min-w-0 items-center gap-2">
          <DynamicIcon
            iconName={selectedMethod?.icon || undefined}
            className="h-4 w-4"
          />
          <span className="truncate">
            {selectedMethod ? selectedMethod.name : placeholder}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        )}
      </Button>

      {isOpen && (
        <Card className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto">
          <div className="space-y-0.5 p-1">
            {isLoading ? (
              <div className="px-2 py-1.5 text-gray-500 text-sm">
                Loading...
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="px-2 py-1.5 text-gray-500 text-sm">
                No payment methods available
              </div>
            ) : (
              paymentMethods.map((method) => (
                <button
                  key={method.code}
                  type="button"
                  className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100 ${
                    value === method.code ? "bg-gray-50" : ""
                  }`}
                  onClick={() => handleSelect(method.code)}
                >
                  <DynamicIcon
                    iconName={method.icon || undefined}
                    className="h-4 w-4"
                  />
                  <span className="flex-1">{method.name}</span>
                </button>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
