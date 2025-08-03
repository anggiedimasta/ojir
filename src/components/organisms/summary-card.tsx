import type { LucideIcon } from "lucide-react";
import { Card } from "../atoms/card";
import { Icon } from "../atoms/icon";
import { cn } from "~/lib/utils";

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
        "p-6 border transition-all duration-200 hover:shadow-lg",
        gradient,
        borderColor,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={cn("text-sm font-medium mb-2", titleColor)}>{title}</p>
          <p className={cn("text-2xl font-bold", valueColor)}>{value}</p>
        </div>
        <div className={cn("p-3 rounded-xl flex-shrink-0", iconBgColor)}>
          <Icon icon={IconComponent} size="lg" className={iconColor} />
        </div>
      </div>
    </Card>
  );
}