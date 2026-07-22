// Usage:
// <FormSection title="Dados pessoais" description="Informações básicas do cliente.">
//   <Field>...</Field>
//   <Field>...</Field>
// </FormSection>

import * as React from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
  ...props
}: FormSectionProps) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      <div className="space-y-1 border-b border-border pb-4">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="grid gap-4">{children}</div>
    </div>
  );
}
