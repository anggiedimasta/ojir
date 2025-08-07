import { Calendar } from "lucide-react";
import { cn } from "~/lib/utils";
import { Icon } from "../atoms/icon";
import { Input } from "../atoms/input";

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
	required = false,
}: DateInputProps) {
	const inputId = `date-input-${Math.random().toString(36).substr(2, 9)}`;
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			{label && (
				<label htmlFor={inputId} className="font-medium text-slate-700 text-sm">
					{label}
					{required && <span className="ml-1 text-red-500">*</span>}
				</label>
			)}
			<div className="relative">
				<Icon
					icon={Calendar}
					size="sm"
					className="-translate-y-1/2 absolute top-1/2 left-3 transform text-slate-400"
				/>
				<Input
					id={inputId}
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
