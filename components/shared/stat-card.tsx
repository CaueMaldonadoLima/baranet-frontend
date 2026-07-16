// Usage:
// <StatCard label="Clientes ativos" value="1.240" delta={8.3} trend="up" icon={Users} />
// <StatCard label="Vendas hoje" value="R$ 3.820" trend="neutral" />

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "neutral";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  /** Variação percentual — ex: 8.3 para +8,3% */
  delta?: number;
  trend?: Trend;
  icon?: LucideIcon;
}

const TREND_CONFIG: Record<Trend, { color: string; Icon: LucideIcon }> = {
  up:      { color: "text-success", Icon: TrendingUp },
  down:    { color: "text-destructive", Icon: TrendingDown },
  neutral: { color: "text-muted-foreground", Icon: Minus },
};

export function StatCard({
  label,
  value,
  delta,
  trend = "neutral",
  icon: Icon,
  className,
  ...props
}: StatCardProps) {
  const { color, Icon: TrendIcon } = TREND_CONFIG[trend];

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-5 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        {Icon && (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="size-4" aria-hidden />
          </div>
        )}
      </div>

      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>

      {delta !== undefined && (
        <div className={cn("mt-1 flex items-center gap-1 text-xs font-medium", color)}>
          <TrendIcon className="size-3.5" aria-hidden />
          <span>
            {trend === "up" ? "+" : ""}
            {delta.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%
          </span>
        </div>
      )}
    </div>
  );
}
