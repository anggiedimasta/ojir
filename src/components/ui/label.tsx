import { forwardRef } from "react";
import { cn } from "~/lib/utils";

export interface LabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
	({ className, ...props }, ref) => {
		return (
			// biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
			<label
				htmlFor={props.htmlFor}
				className={cn(
					"font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Label.displayName = "Label";

export { Label };
