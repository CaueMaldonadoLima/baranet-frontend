import { mockErpKpis, mockSales, mockLabOrders } from "@/mocks/erp";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import {
  ShoppingCart,
  Wallet,
  FlaskConical,
  Users,
} from "lucide-react";

const SALE_STATUS: Record<string, { label: string; variant: "success" | "warning" | "error" | "muted" }> = {
  pago:      { label: "Pago", variant: "success" },
  pendente:  { label: "Pendente", variant: "warning" },
  cancelado: { label: "Cancelado", variant: "error" },
};

const LAB_STATUS: Record<string, { label: string; variant: "info" | "warning" | "success" | "muted" }> = {
  aguardando:   { label: "Aguardando", variant: "warning" },
  em_producao:  { label: "Em produção", variant: "info" },
  pronto:       { label: "Pronto", variant: "success" },
  entregue:     { label: "Entregue", variant: "muted" },
};

export default function ErpDashboard() {
  const recentSales = mockSales.slice(0, 5);
  const pendingLab = mockLabOrders.filter((o) => o.status !== "entregue").slice(0, 4);

  return (
    <div className="px-[4.2vw] py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral da loja — hoje, 22 de maio de 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Vendas hoje"
          value={`R$ ${mockErpKpis.salesToday.toLocaleString("pt-BR")}`}
          delta={mockErpKpis.salesGrowth}
          trend="up"
          icon={ShoppingCart}
        />
        <StatCard
          label="Saldo em caixa"
          value={`R$ ${mockErpKpis.cashBalance.toLocaleString("pt-BR")}`}
          trend="neutral"
          icon={Wallet}
        />
        <StatCard
          label="Pedidos lab. pendentes"
          value={mockErpKpis.pendingOrders}
          trend={mockErpKpis.pendingOrders > 5 ? "down" : "neutral"}
          icon={FlaskConical}
        />
        <StatCard
          label="Faturamento do mês"
          value={`R$ ${mockErpKpis.monthlyRevenue.toLocaleString("pt-BR")}`}
          delta={mockErpKpis.revenueGrowth}
          trend="up"
          icon={Users}
        />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Vendas recentes</h2>
            <a href="/vendas" className="text-xs text-primary hover:underline">Ver todas</a>
          </div>
          <DataTable
            data={recentSales}
            keyExtractor={(r) => r.id}
            columns={[
              { header: "Cliente", accessor: "customer" },
              {
                header: "Total",
                cell: (r) => (
                  <span className="font-medium tabular-nums">
                    R$ {r.total.toLocaleString("pt-BR")}
                  </span>
                ),
              },
              {
                header: "Status",
                cell: (r) => {
                  const s = SALE_STATUS[r.status];
                  return <Badge variant={s?.variant ?? "muted"}>{s?.label ?? r.status}</Badge>;
                },
              },
            ]}
          />
        </div>

        {/* Lab Orders */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Pedidos de laboratório</h2>
            <a href="/laboratorio" className="text-xs text-primary hover:underline">Ver todos</a>
          </div>
          <DataTable
            data={pendingLab}
            keyExtractor={(r) => r.id}
            emptyTitle="Nenhum pedido pendente"
            columns={[
              { header: "Cliente", accessor: "customer" },
              { header: "Laboratório", accessor: "lab" },
              {
                header: "Prazo",
                cell: (r) => (
                  <span className="text-muted-foreground text-xs">
                    {new Date(r.dueDate).toLocaleDateString("pt-BR")}
                  </span>
                ),
              },
              {
                header: "Status",
                cell: (r) => {
                  const s = LAB_STATUS[r.status];
                  return <Badge variant={s?.variant ?? "muted"}>{s?.label ?? r.status}</Badge>;
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
