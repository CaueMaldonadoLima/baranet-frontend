"use client";

import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Package,
  Wallet,
  BadgePercent,
  Download,
} from "lucide-react";

const reportCards = [
  {
    icon: TrendingUp,
    title: "Vendas por Período",
    description: "Analise o desempenho de vendas por dia, semana ou mês.",
  },
  {
    icon: Package,
    title: "Estoque",
    description: "Visualize posição atual, entradas e saídas de produtos.",
  },
  {
    icon: Wallet,
    title: "Caixa / Financeiro",
    description: "Resumo de movimentações financeiras e fechamentos de caixa.",
  },
  {
    icon: BadgePercent,
    title: "Comissões de Funcionários",
    description: "Apuração de comissões por vendedor no período selecionado.",
  },
];

const recentExports = [
  { name: "Vendas — Maio 2026", author: "Vanessa Rodrigues", date: "22/05/2026" },
  { name: "Estoque — Semana 20", author: "Admin", date: "19/05/2026" },
  { name: "Comissões — Abril 2026", author: "Vanessa Rodrigues", date: "02/05/2026" },
  { name: "Caixa — Abril 2026", author: "Admin", date: "01/05/2026" },
];

export default function RelatoriosPage() {
  return (
    <div className="px-[4.2vw] py-8 space-y-8">
      <Breadcrumb items={[{ label: "ERP" }, { label: "Relatórios" }]} />

      <h1 className="text-2xl font-semibold text-foreground">Relatórios</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reportCards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <card.icon className="size-5" aria-hidden />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-foreground">{card.title}</p>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Gerar relatório
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">
          Exportações recentes
        </h2>

        <div className="overflow-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Relatório
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Gerado por
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Data
                </th>
                <th className="w-28 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentExports.map((row) => (
                <tr
                  key={row.name}
                  className="bg-card transition-colors hover:bg-muted/40"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.author}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm">
                      <Download className="size-3.5" />
                      Baixar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
