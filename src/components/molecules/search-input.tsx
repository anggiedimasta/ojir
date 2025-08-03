import { Search } from "lucide-react";
import { Input } from "../atoms/input";
import { Icon } from "../atoms/icon";
import { cn } from "~/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search...", className }: SearchInputProps) {
  return (
    <div className={cn("relative flex-1 max-w-md", className)}>
      <Icon
        icon={Search}
        size="sm"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}