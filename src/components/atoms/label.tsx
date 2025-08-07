import { forwardRef } from "react";
import { cn } from "~/lib/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
	variant?: "default" | "required" | "optional";
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
	({ className, variant = "default", children, ...props }, ref) => {
		const variants = {
			default:
				"text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
			required:
				"text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 after:content-['*'] after:ml-0.5 after:text-red-500",
			optional:
				"text-sm font-medium leading-none text-gray-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
		};

		return (
			<label
				ref={ref}
				className={cn(variants[variant], className)}
				{...props}
				htmlFor={props.htmlFor}
			>
				{children}
			</label>
		);
	},
);

Label.displayName = "Label";

export { Label };
