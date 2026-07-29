// Usage:
// <Badge variant="success">Ativo</Badge>
// <Badge variant="warning" size="sm">Pendente</Badge>

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium leading-none",
  {
    variants: {
      variant: {
        default:     "bg-primary/15 text-primary",
        success:     "bg-success/15 text-success",
        error:       "bg-destructive/15 text-destructive",
        warning:     "bg-warning/15 text-warning",
        info:        "bg-info/15 text-info",
        outline:     "border border-border bg-transparent text-foreground",
        muted:       "bg-muted text-muted-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ variant, size, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { badgeVariants };
