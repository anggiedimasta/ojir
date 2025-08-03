import { forwardRef } from "react";
import { cn } from "~/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', type, ...props }, ref) => {
    const variants = {
      default: "border-input bg-background ring-offset-background",
      error: "border-destructive bg-background ring-offset-background",
      success: "border-green-500 bg-background ring-offset-background"
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input }; 