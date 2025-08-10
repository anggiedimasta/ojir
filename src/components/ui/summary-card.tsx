import type { LucideIcon } from "lucide-react";
import type { SummaryCardProps } from "~/entities/api/wallet";
import { Card } from "./card";

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
    <Card
      className={`p-6 ${gradient} ${borderColor} shadow-lg transition-all duration-300 hover:shadow-xl`}
    >
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <p className={`font-medium text-sm ${titleColor}`}>{title}</p>
          <div className={`${iconBgColor} flex-shrink-0 rounded-xl p-3`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
        <div className="flex flex-1 items-end">
          <p className={`font-bold text-xl ${valueColor}`}>{value}</p>
        </div>
      </div>
    </Card>
  );
}
