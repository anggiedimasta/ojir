import type { LucideIcon } from "lucide-react";
import { Icon } from "../atoms/icon";
import { Button } from "../atoms/button";
import { cn } from "~/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
  isLoading?: boolean;
  className?: string;
}

export function EmptyState({
  icon: IconComponent,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  isLoading = false,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-16", className)}>
      <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon icon={IconComponent} size="xl" className="text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          disabled={isLoading}
          isLoading={isLoading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {ActionIcon && <Icon icon={ActionIcon} size="sm" className="mr-2" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}