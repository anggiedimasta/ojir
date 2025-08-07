import { forwardRef } from "react";
import { cn } from "~/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?:
		| "default"
		| "secondary"
		| "destructive"
		| "outline"
		| "success"
		| "warning";
	size?: "sm" | "md" | "lg";
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
	(
		{ className, variant = "default", size = "md", children, ...props },
		ref,
	) => {
		const variants = {
			default: "bg-primary text-primary-foreground",
			secondary: "bg-secondary text-secondary-foreground",
			destructive: "bg-destructive text-destructive-foreground",
			outline: "text-foreground border border-input",
			success: "bg-green-100 text-green-800",
			warning: "bg-yellow-100 text-yellow-800",
		};

		const sizes = {
			sm: "px-2 py-0.5 text-xs",
			md: "px-2.5 py-0.5 text-sm",
			lg: "px-3 py-1 text-base",
		};

		return (
			<div
				ref={ref}
				className={cn(
					"inline-flex items-center rounded-full font-medium",
					variants[variant],
					sizes[size],
					className,
				)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

Badge.displayName = "Badge";

export { Badge };
