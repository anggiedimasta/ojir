import { Search } from "lucide-react";
import type { SearchInputProps } from "~/entities/api/wallet";

export function SearchInput({ value, onChange, placeholder = "Search...", className = "" }: SearchInputProps) {
  return (
    <div className={`relative flex-1 max-w-md ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      />
    </div>
  );
}