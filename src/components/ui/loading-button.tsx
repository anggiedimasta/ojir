import { Button, ButtonProps } from './button';
import { LoadingSpinner } from './loading-spinner';
import { cn } from '~/utils';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText = 'Loading...',
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <Button
      disabled={disabled || loading}
      className={cn(
        loading && 'cursor-not-allowed opacity-70',
        className
      )}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="sm" className="mr-2" />
      )}
      {loading ? loadingText : children}
    </Button>
  );
};