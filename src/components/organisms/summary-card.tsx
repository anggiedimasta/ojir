import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Card } from "../atoms/card";
import { Icon } from "../atoms/icon";

interface SummaryCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	gradient?: string;
	borderColor?: string;
	iconBgColor?: string;
	iconColor?: string;
	valueColor?: string;
	titleColor?: string;
	className?: string;
}

export function SummaryCard({
	title,
	value,
	icon: IconComponent,
	gradient = "bg-gradient-to-br from-slate-50 to-slate-100",
	borderColor = "border-slate-200",
	iconBgColor = "bg-slate-100",
	iconColor = "text-slate-600",
	valueColor = "text-slate-900",
	titleColor = "text-slate-600",
	className,
}: SummaryCardProps) {
	return (
		<Card
			variant="elevated"
			className={cn(
				"border p-6 transition-all duration-200 hover:shadow-lg",
				gradient,
				borderColor,
				className,
			)}
		>
			<div className="flex items-center justify-between">
				<div className="flex-1">
					<p className={cn("mb-2 font-medium text-sm", titleColor)}>{title}</p>
					<p className={cn("font-bold text-2xl", valueColor)}>{value}</p>
				</div>
				<div className={cn("flex-shrink-0 rounded-xl p-3", iconBgColor)}>
					<Icon icon={IconComponent} size="lg" className={iconColor} />
				</div>
			</div>
		</Card>
	);
}
