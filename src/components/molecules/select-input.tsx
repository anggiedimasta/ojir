import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { Icon } from "../atoms/icon";

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
	required = false,
}: SelectInputProps) {
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			{label && (
				<label className="font-medium text-slate-700 text-sm">
					{label}
					{required && <span className="ml-1 text-red-500">*</span>}
				</label>
			)}
			<div className="relative">
				<select
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="h-10 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-gray-900 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="" disabled className="text-gray-500">
						{placeholder}
					</option>
					{options.map((option) => (
						<option
							key={option.value}
							value={option.value}
							className="bg-white text-gray-900"
						>
							{option.label}
						</option>
					))}
				</select>
				<Icon
					icon={ChevronDown}
					size="sm"
					className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 transform text-slate-400"
				/>
			</div>
		</div>
	);
}
