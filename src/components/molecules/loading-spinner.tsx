import { Spinner } from "../atoms/spinner";
import { cn } from "~/lib/utils";

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ text, size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Spinner size={size} />
      {text && (
        <p className="text-sm text-slate-600">{text}</p>
      )}
    </div>
  );
}