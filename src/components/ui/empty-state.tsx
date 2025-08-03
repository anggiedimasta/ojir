import { Button } from "./button";
import type { LucideIcon } from "lucide-react";
import type { EmptyStateProps } from "~/entities/api/wallet";

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
    <div className={`text-center py-16 ${className}`}>
      <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {ActionIcon && <ActionIcon className="w-4 h-4 mr-2" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}