import type { LucideIcon } from "lucide-react";
import type { EmptyStateProps } from "~/entities/api/wallet";
import { Button } from "./button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  isLoading = false,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`py-16 text-center ${className}`}>
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="mb-3 font-semibold text-slate-900 text-xl">{title}</h3>
      <p className="mx-auto mb-6 max-w-md text-slate-600">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
        >
          {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
