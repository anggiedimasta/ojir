import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "../atoms/button";
import { Icon } from "../atoms/icon";

interface IconButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	icon: LucideIcon;
	iconSize?: "xs" | "sm" | "md" | "lg" | "xl";
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
	size?: "default" | "sm" | "lg" | "icon";
	isLoading?: boolean;
}

export function IconButton({
	icon: IconComponent,
	iconSize = "md",
	variant = "default",
	size = "icon",
	isLoading = false,
	className,
	children,
	...props
}: IconButtonProps) {
	return (
		<Button
			variant={variant}
			size={size}
			isLoading={isLoading}
			className={cn(className)}
			{...props}
		>
			<Icon icon={IconComponent} size={iconSize} />
			{children}
		</Button>
	);
}
