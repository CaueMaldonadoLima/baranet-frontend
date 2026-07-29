// Usage:
// <Tabs defaultValue="geral">
//   <TabsList>
//     <TabsTrigger value="geral">Geral</TabsTrigger>
//     <TabsTrigger value="endereco">Endereço</TabsTrigger>
//   </TabsList>
//   <TabsContent value="geral">...</TabsContent>
//   <TabsContent value="endereco">...</TabsContent>
// </Tabs>

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Context ────────────────────────────────────────────────────────────────

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs: componente usado fora de <Tabs>");
  return ctx;
}

// ─── Tabs (root) ─────────────────────────────────────────────────────────────

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : internalValue;

  const handleChange = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value: activeValue, onChange: handleChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ─── TabsList ────────────────────────────────────────────────────────────────

export function TabsList({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-0 rounded-lg bg-muted p-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── TabsTrigger ─────────────────────────────────────────────────────────────

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({
  value,
  children,
  className,
  disabled,
  ...props
}: TabsTriggerProps) {
  const { value: activeValue, onChange } = useTabsContext();
  const isActive = value === activeValue;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => onChange(value)}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── TabsContent ─────────────────────────────────────────────────────────────

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({
  value,
  children,
  className,
  ...props
}: TabsContentProps) {
  const { value: activeValue } = useTabsContext();

  if (value !== activeValue) return null;

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      className={cn(
        "mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
