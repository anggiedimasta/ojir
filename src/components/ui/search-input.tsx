import { Search } from "lucide-react";
import type { SearchInputProps } from "~/entities/api/wallet";

export function SearchInput({
	value,
	onChange,
	placeholder = "Search...",
	className = "",
}: SearchInputProps) {
	return (
		<div className={`relative flex-1 ${className}`}>
			<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-slate-400" />
			<input
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-4 pl-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
	);
}
