import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={selectId}
            className="block text-sm font-medium text-[--text-primary] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              "flex h-10 w-full appearance-none rounded-[--radius-md] border border-[--border] bg-[--surface] px-3 py-2 pr-10 text-sm",
              "transition-all duration-200",
              "focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-[--danger] focus:border-[--danger]",
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[--text-muted] pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-[--danger]">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
