// Usage:
// <Skeleton variant="text" lines={3} />
// <Skeleton variant="card" />
// <Skeleton variant="table-row" />
// <Skeleton variant="avatar" />
// <Skeleton className="h-10 w-40" />  ← dimensão customizada

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const skeletonBase =
  "animate-pulse rounded-md bg-muted";

const skeletonVariants = cva(skeletonBase, {
  variants: {
    variant: {
      text:       "",  // usa `lines` abaixo
      card:       "h-36 w-full",
      "table-row": "h-10 w-full",
      avatar:     "size-10 rounded-full",
    },
  },
});

// Skeleton de linha de texto
function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            skeletonBase,
            "h-4",
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  lines?: number;
}

export function Skeleton({ variant, lines = 1, className, ...props }: SkeletonProps) {
  if (variant === "text") {
    return <SkeletonText lines={lines} className={className} />;
  }

  return (
    <div
      aria-hidden
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  );
}
