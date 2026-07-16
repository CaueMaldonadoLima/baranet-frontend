import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/shared/badge";
import { Button } from "@/components/ui/button";
import { mockPlans } from "@/mocks/admin";

export default function PlanosPage() {
  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Planos" },
        ]}
      />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Planos</h1>
        <Button asChild>
          <Link href="/admin/planos/criar">Novo Plano</Link>
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {mockPlans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-lg border border-border bg-card p-6 space-y-5 flex flex-col"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <Badge variant={plan.active ? "success" : "muted"}>
                {plan.active ? "Ativo" : "Inativo"}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight">
                {plan.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                <span className="text-sm font-normal text-muted-foreground">/mês</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {plan.annualPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}/ano
              </p>
            </div>

            <div className="flex-1 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Módulos incluídos
              </p>
              <ul className="space-y-1">
                {plan.modules.map((mod) => (
                  <li key={mod} className="text-sm capitalize flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    {mod.replace(/-/g, " ")}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {plan.oticas} {plan.oticas === 1 ? "ótica" : "óticas"}
              </span>
              <Link
                href={`/admin/planos/${plan.id}/editar`}
                className="text-primary text-xs underline-offset-2 hover:underline"
              >
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
