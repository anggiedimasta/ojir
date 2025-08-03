import { Calendar } from "lucide-react";
import { Input } from "../atoms/input";
import { Icon } from "../atoms/icon";
import { cn } from "~/lib/utils";

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function DateInput({
  value,
  onChange,
  label,
  placeholder = "Select date",
  className,
  required = false
}: DateInputProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <Icon
          icon={Calendar}
          size="sm"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
        />
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}