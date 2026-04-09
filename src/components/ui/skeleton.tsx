import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[--border]",
        variant === "circular" && "rounded-full",
        variant === "text" && "rounded-[--radius-sm] h-4",
        variant === "rectangular" && "rounded-[--radius-md]",
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
}

export { Skeleton };
