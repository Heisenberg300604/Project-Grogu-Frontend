import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Button styles. Exported separately so a `<Link>` can be styled as a button:
 * `<Link className={buttonVariants()}>` — or use `<Button asChild><Link/></Button>`.
 *
 * Hierarchy, strongest to weakest: primary → secondary → outline → ghost → link.
 * A screen should carry exactly one primary action. `grape` and `ink` are
 * bold alternates for marketing surfaces.
 */
const POP =
  "border-2 border-line shadow-[3px_3px_0_var(--shadow-ink)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_var(--shadow-ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none";

export const buttonVariants = cva(
  [
    "btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap",
    "rounded-lg font-bold",
    "transition-[transform,box-shadow,background-color,color,opacity] duration-[120ms]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // Bordered "arcade" buttons: hard shadow that grows on hover and
        // collapses when pressed.
        primary: `${POP} bg-primary text-primary-foreground hover:bg-primary-hover`,
        secondary: `${POP} bg-surface text-surface-foreground hover:bg-elevated`,
        outline: `${POP} bg-transparent text-foreground hover:bg-elevated`,
        grape: `${POP} bg-grape text-white hover:brightness-110`,
        ink: `${POP} border-ink bg-ink text-white dark:border-foreground dark:bg-foreground dark:text-background`,
        destructive: `${POP} bg-destructive text-destructive-foreground hover:brightness-110`,
        success: `${POP} bg-success text-success-foreground hover:brightness-110`,
        // Flat variants: no border or shadow.
        ghost: "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
        link: "text-secondary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-sm",
        xl: "h-12 px-7 text-base",
        icon: "size-10",
        "icon-sm": "size-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      type,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        type={type ?? "button"}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
