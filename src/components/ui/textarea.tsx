import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-[--text-primary] mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[100px] w-full rounded-[--radius-md] border border-[--border] bg-[--surface] px-3 py-2 text-sm",
            "placeholder:text-[--text-muted]",
            "transition-all duration-200",
            "focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-y",
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
Textarea.displayName = "Textarea";

export { Textarea };
