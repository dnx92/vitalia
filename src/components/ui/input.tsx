import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-[--text-primary] mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-[--radius-md] border border-[--border] bg-[--surface] px-3 py-2 text-sm",
            "placeholder:text-[--text-muted]",
            "transition-all duration-200",
            "focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[--danger] focus:border-[--danger] focus:ring-[--danger]/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn(
            "mt-1.5 text-xs",
            error ? "text-[--danger]" : "text-[--text-muted]"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
