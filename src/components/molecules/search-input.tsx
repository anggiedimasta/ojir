import { Search } from "lucide-react";
import { cn } from "~/lib/utils";
import { Icon } from "../atoms/icon";
import { Input } from "../atoms/input";

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
}

export function SearchInput({
	value,
	onChange,
	placeholder = "Search...",
	className,
}: SearchInputProps) {
	return (
		<div className={cn("relative max-w-md flex-1", className)}>
			<Icon
				icon={Search}
				size="sm"
				className="-translate-y-1/2 absolute top-1/2 left-3 transform text-slate-400"
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
