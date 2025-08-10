import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "../atoms/button";
import { Icon } from "../atoms/icon";

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
    <div className={cn("py-16 text-center", className)}>
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <Icon icon={IconComponent} size="xl" className="text-slate-400" />
      </div>
      <h3 className="mb-3 font-semibold text-slate-900 text-xl">{title}</h3>
      <p className="mx-auto mb-6 max-w-md text-slate-600">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          disabled={isLoading}
          isLoading={isLoading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
        >
          {ActionIcon && <Icon icon={ActionIcon} size="sm" className="mr-2" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
