import type { LucideIcon } from "lucide-react";
import { Badge } from "../atoms/badge";
import { Icon } from "../atoms/icon";
import { cn } from "~/lib/utils";

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending';
  label: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatusBadge({ status, label, icon, className }: StatusBadgeProps) {
  const statusConfig = {
    success: {
      variant: 'success' as const,
      iconColor: 'text-green-600'
    },
    warning: {
      variant: 'warning' as const,
      iconColor: 'text-yellow-600'
    },
    error: {
      variant: 'destructive' as const,
      iconColor: 'text-red-600'
    },
    info: {
      variant: 'secondary' as const,
      iconColor: 'text-blue-600'
    },
    pending: {
      variant: 'outline' as const,
      iconColor: 'text-slate-600'
    }
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      className={cn("flex items-center gap-1", className)}
    >
      {icon && (
        <Icon
          icon={icon}
          size="xs"
          className={config.iconColor}
        />
      )}
      {label}
    </Badge>
  );
}