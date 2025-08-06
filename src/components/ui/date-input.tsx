import { forwardRef } from "react";
import { cn } from "~/lib/utils";

export interface DateInputProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onChange, placeholder, className, disabled, ...props }, ref) => {
    const formatDateForInput = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    return (
      <input
        type="date"
        value={value ? formatDateForInput(value) : ""}
        onChange={(e) => {
          if (e.target.value) {
            onChange?.(new Date(e.target.value));
          }
        }}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    );
  }
);
DateInput.displayName = "DateInput";

export { DateInput };