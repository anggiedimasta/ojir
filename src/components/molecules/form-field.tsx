import { forwardRef } from "react";
import { Label } from "../atoms/label";
import { Input } from "../atoms/input";
import { cn } from "~/lib/utils";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ className, label, error, helperText, required = false, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <Label variant={required ? 'required' : 'default'}>
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          variant={error ? 'error' : 'default'}
          className={cn(className)}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export { FormField }; 