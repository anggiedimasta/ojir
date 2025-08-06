import { LoadingSpinner } from './loading-spinner';
import { cn } from '~/utils';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Loading...',
  className,
  children,
}) => {
  if (!isLoading) return children ? <>{children}</> : null;

  return (
    <div className={cn('relative', className)}>
      {children}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-2">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};