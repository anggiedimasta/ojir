import { forwardRef } from "react";
import { cn } from "~/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "outlined" | "elevated";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
	({ className, variant = "default", children, ...props }, ref) => {
		const variants = {
			default: "bg-card text-card-foreground",
			outlined: "border border-border bg-card text-card-foreground",
			elevated: "bg-card text-card-foreground shadow-lg",
		};

		return (
			<div
				ref={ref}
				className={cn("rounded-lg", variants[variant], className)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

Card.displayName = "Card";

export { Card };
