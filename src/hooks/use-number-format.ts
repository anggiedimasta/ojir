import { useCallback, useEffect, useState } from "react";

interface UseNumberFormatOptions {
  locale?: string;
  debounceMs?: number;
}

export function useNumberFormat(options: UseNumberFormatOptions = {}) {
  const { locale = "id-ID", debounceMs = 300 } = options;
  const [formattedValue, setFormattedValue] = useState("");
  const [timeout, setTimeoutState] = useState<NodeJS.Timeout | null>(null);

  // Format number using Indonesian locale (dots as thousand separators)
  const formatNumber = useCallback(
    (value: string): string => {
      if (!value) {
        return "";
      }

      // Handle cases where user is typing decimal
      if (value.endsWith(".") || value.endsWith(",")) {
        const separator = value.endsWith(".") ? "." : ",";
        const number = Number.parseFloat(value.slice(0, -1));
        if (Number.isNaN(number)) {
          return value;
        }
        // Format as integer with Indonesian locale and add the separator back
        const formatted = Math.round(number).toLocaleString(locale);
        const result = `${formatted}${separator}`;
        return result;
      }

      // Check if value contains Indonesian format (dots as thousand separators, comma as decimal)
      if (value.includes(".") && value.includes(",")) {
        // Indonesian format: 14.000,50
        const parts = value.split(",");
        const integerPart = (parts[0] || "").replace(/\./g, ""); // Remove thousand separators
        const decimalPart = parts[1] || "";
        const number = Number.parseFloat(`${integerPart}.${decimalPart}`);
        if (Number.isNaN(number)) {
          return value;
        }
        // Format as integer with Indonesian locale
        const result = Math.round(number).toLocaleString(locale);
        return result;
      }

      // Check if value contains dots that should be treated as thousand separators
      if (value.includes(".") && !value.endsWith(".")) {
        // Always treat dots as thousand separators when user is typing
        // Remove all dots and parse as integer
        const cleanValue = value.replace(/\./g, "");
        const number = Number.parseFloat(cleanValue);
        if (Number.isNaN(number)) {
          return value;
        }
        // Format as integer with Indonesian locale
        const result = Math.round(number).toLocaleString(locale);
        return result;
      }

      // Handle simple number (could be decimal or integer)
      const number = Number.parseFloat(value);
      if (Number.isNaN(number)) {
        return value;
      }
      // Format as integer with Indonesian locale
      const result = Math.round(number).toLocaleString(locale);
      return result;
    },
    [locale],
  );

  // Clean input value (only allow digits and dots)
  const cleanInputValue = useCallback((value: string): string => {
    return value.replace(/[^\d.]/g, "");
  }, []);

  // Handle input change with debouncing
  const handleInputChange = useCallback(
    (value: string, onValueChange: (cleanValue: string) => void) => {
      // Only allow digits and dots (for thousand separators)
      const cleanValue = cleanInputValue(value);

      const formatted = formatNumber(cleanValue);

      setFormattedValue(formatted);

      // Clear previous timeout
      if (timeout) {
        clearTimeout(timeout);
      }

      // Set new timeout for debounced update
      const newTimeout = setTimeout(() => {
        // Convert the cleaned value to a number and back to string to remove any dots
        const numericValue = Number.parseFloat(cleanValue.replace(/\./g, ""));
        const finalValue = numericValue.toString();
        onValueChange(finalValue);
      }, debounceMs);

      setTimeoutState(newTimeout);
    },
    [timeout, formatNumber, cleanInputValue, debounceMs],
  );

  // Initialize formatted value from a number or string
  const initializeValue = useCallback(
    (value: string | number) => {
      if (typeof value === "number") {
        setFormattedValue(value.toLocaleString(locale));
      } else {
        setFormattedValue(formatNumber(value));
      }
    },
    [formatNumber, locale],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [timeout]);

  return {
    formattedValue,
    setFormattedValue,
    formatNumber,
    cleanInputValue,
    handleInputChange,
    initializeValue,
  };
}
