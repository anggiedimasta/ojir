import { ChevronDown } from "lucide-react";
import { Icon } from "../atoms/icon";
import { cn } from "~/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  required?: boolean;
}

export function SelectInput({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label,
  className,
  required = false
}: SelectInputProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 px-3 py-2 text-sm text-gray-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
        >
          <option value="" disabled className="text-gray-500">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-gray-900 bg-white">
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          icon={ChevronDown}
          size="sm"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
    </div>
  );
}