"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}>({});

function RadioGroup({ value, onValueChange, name, className, children, ...props }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, name }}>
      <div role="radiogroup" className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
  value: string;
  label?: string;
}

function RadioGroupItem({ value, label, className, id, ...props }: RadioGroupItemProps) {
  const ctx = React.useContext(RadioGroupContext);
  const inputId = id ?? `radio-${value}`;

  return (
    <label
      htmlFor={inputId}
      className="flex items-center gap-2.5 cursor-pointer group"
    >
      <input
        id={inputId}
        type="radio"
        name={ctx.name}
        value={value}
        checked={ctx.value === value}
        onChange={() => ctx.onValueChange?.(value)}
        className={cn(
          "size-4 cursor-pointer accent-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          className
        )}
        {...props}
      />
      {label && (
        <span className="text-sm text-foreground group-has-[:disabled]:text-muted-foreground">
          {label}
        </span>
      )}
    </label>
  );
}

export { RadioGroup, RadioGroupItem };
