import { Card } from "./card";
import type { LucideIcon } from "lucide-react";
import type { SummaryCardProps } from "~/entities/api/wallet";

export function SummaryCard({
  title,
  value,
  icon: Icon,
  gradient,
  borderColor,
  iconBgColor,
  iconColor,
  valueColor,
  titleColor,
}: SummaryCardProps) {
  return (
    <Card className={`p-6 ${gradient} ${borderColor} shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <p className={`text-sm font-medium ${titleColor}`}>{title}</p>
          <div className={`${iconBgColor} p-3 rounded-xl flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
        <div className="flex-1 flex items-end">
          <p className={`text-xl font-bold ${valueColor}`}>
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}