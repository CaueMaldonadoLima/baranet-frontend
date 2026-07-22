// Adicione <Toaster /> uma vez, no layout raiz (ao lado de <ToastProvider>).
//
// Usage no layout:
// <ToastProvider>
//   {children}
//   <Toaster />
// </ToastProvider>
//
// Usage em qualquer componente:
// const { success, error } = useToast();
// success("Salvo!", "Registro atualizado com sucesso.");

"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastContext, type ToastVariant } from "./toast-context";

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: React.ElementType; classes: string }
> = {
  success: {
    icon: CheckCircle2,
    classes: "border-success/30 bg-card text-foreground [&_svg]:text-success",
  },
  error: {
    icon: AlertCircle,
    classes: "border-destructive/30 bg-card text-foreground [&_svg]:text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    classes: "border-warning/30 bg-card text-foreground [&_svg]:text-warning",
  },
  info: {
    icon: Info,
    classes: "border-info/30 bg-card text-foreground [&_svg]:text-info",
  },
};

export function Toaster() {
  const ctx = React.useContext(ToastContext);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!ctx || !mounted) return null;

  const { toasts, dismiss } = ctx;

  return createPortal(
    <div
      aria-live="polite"
      aria-label="Notificações"
      className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col gap-2"
    >
      {toasts.map((t) => {
        const { icon: Icon, classes } = VARIANT_CONFIG[t.variant];

        return (
          <div
            key={t.id}
            role="alert"
            className={cn(
              "pointer-events-auto flex w-80 items-start gap-3 rounded-lg border p-4 shadow-md",
              "animate-in slide-in-from-right-4 fade-in-0 duration-200",
              classes
            )}
          >
            <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />

            <div className="flex-1 text-sm">
              <p className="font-medium leading-snug">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-muted-foreground">{t.description}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Fechar notificação"
              className="ml-auto -mr-1 -mt-0.5 rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
