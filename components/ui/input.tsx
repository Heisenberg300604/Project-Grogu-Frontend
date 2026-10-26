import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/** Shared field styling. `Textarea` and `SelectTrigger` mirror these values. */
export const fieldClassName = [
  "w-full rounded-lg border-2 border-line bg-input text-sm text-foreground",
  "transition-[box-shadow,border-color] duration-[150ms]",
  "placeholder:text-subtle-foreground",
  "focus-visible:outline-none focus-visible:shadow-[4px_4px_0_var(--grape)]",
  "aria-[invalid=true]:border-destructive",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(fieldClassName, "flex h-10 px-3 py-2", className)}
      {...props}
    />
  ),
);
Input.displayName = "Input";
