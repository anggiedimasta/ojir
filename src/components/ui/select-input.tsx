import { forwardRef } from "react";
import { cn } from "~/lib/utils";

export interface SelectOption {
	value: string;
	label: string;
}

export interface SelectInputProps {
	value?: string;
	onChange?: (value: string) => void;
	options: SelectOption[];
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
	(
		{ value, onChange, options, placeholder, className, disabled, ...props },
		ref,
	) => {
		return (
			<select
				value={value || ""}
				onChange={(e) => onChange?.(e.target.value)}
				className={cn(
					"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				disabled={disabled}
				ref={ref}
				{...props}
			>
				{placeholder && (
					<option value="" disabled>
						{placeholder}
					</option>
				)}
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		);
	},
);
SelectInput.displayName = "SelectInput";

export { SelectInput };
