"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends Omit<React.ComponentProps<"button">, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

function Switch({ checked = false, onCheckedChange, disabled, label, className, id, ...props }: SwitchProps) {
  const switchId = id ?? React.useId();

  return (
    <label
      htmlFor={switchId}
      className={cn("flex items-center gap-2.5 cursor-pointer", disabled && "cursor-not-allowed opacity-50")}
    >
      <button
        id={switchId}
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          checked ? "bg-primary" : "bg-muted",
          disabled && "pointer-events-none",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block size-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  );
}

export { Switch };
