// Usage:
// <Alert variant="success" title="Salvo!" description="Registro atualizado com sucesso." />
// <Alert variant="error" title="Erro" description="Não foi possível salvar." dismissible onDismiss={() => {}} />

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative flex gap-3 rounded-md border p-4 text-sm",
  {
    variants: {
      variant: {
        success: "border-success/30 bg-success/10 text-success [&_svg]:text-success",
        error:   "border-destructive/30 bg-destructive/10 text-destructive [&_svg]:text-destructive",
        warning: "border-warning/30 bg-warning/10 text-warning [&_svg]:text-warning",
        info:    "border-info/30 bg-info/10 text-info [&_svg]:text-info",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const ICONS = {
  success: CheckCircle2,
  error:   AlertCircle,
  warning: AlertTriangle,
  info:    Info,
} as const;

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  description?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Alert({
  variant = "info",
  title,
  description,
  dismissible = false,
  onDismiss,
  className,
  children,
  ...props
}: AlertProps) {
  const Icon = ICONS[variant ?? "info"];

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />

      <div className="flex-1">
        {title && <p className="font-medium leading-snug">{title}</p>}
        {description && (
          <p className={cn("leading-snug text-current/80", title && "mt-0.5")}>
            {description}
          </p>
        )}
        {children}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar alerta"
          className="ml-auto -mr-1 -mt-0.5 rounded p-1 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
