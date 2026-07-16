"use client";

import * as React from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  /** Duração em ms. Default: 4000. 0 = não fecha automaticamente */
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  toast: (item: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

export const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...item, id }]);

    const duration = item.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast: envolva o app com <ToastProvider>");

  // Atalhos por variante
  const { toast, dismiss } = ctx;
  return {
    toast,
    dismiss,
    success: (title: string, description?: string) =>
      toast({ variant: "success", title, description }),
    error: (title: string, description?: string) =>
      toast({ variant: "error", title, description }),
    warning: (title: string, description?: string) =>
      toast({ variant: "warning", title, description }),
    info: (title: string, description?: string) =>
      toast({ variant: "info", title, description }),
  };
}
