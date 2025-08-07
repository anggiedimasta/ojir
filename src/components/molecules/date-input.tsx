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
				<Input
					id={inputId}
					type="date"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="h-10 pr-8 text-sm [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
					placeholder={placeholder}
				/>
				<button
					type="button"
					onClick={() => document.getElementById(inputId)?.showPicker?.()}
					className="-translate-y-1/2 absolute top-1/2 right-2 flex h-3 w-3 cursor-pointer items-center justify-center text-slate-400 transition-colors hover:text-slate-600"
				>
					<Icon icon={Calendar} size="xs" />
				</button>
			</div>
		</div>
	);
}
