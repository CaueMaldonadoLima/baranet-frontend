import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Rótulo + controle, no padrão dos formulários do cadastro.
export function Campo({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
