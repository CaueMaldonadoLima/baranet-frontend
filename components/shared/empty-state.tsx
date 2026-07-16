// Usage:
// <EmptyState
//   icon={Users}
//   title="Nenhum cliente encontrado"
//   description="Tente ajustar os filtros ou cadastre um novo cliente."
//   action={{ label: "Novo cliente", onClick: () => router.push("/clientes/novo") }}
// />

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg py-16 text-center",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-7" aria-hidden />
        </div>
      )}

      <div className="max-w-xs space-y-1">
        <p className="font-semibold text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {action && (
        <Button size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
