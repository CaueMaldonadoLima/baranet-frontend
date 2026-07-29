import { mockAdminKpis, mockOticas, mockBillingEvents } from "@/mocks/admin";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import { Building2, DollarSign, TrendingDown, Users } from "lucide-react";

const OTICA_STATUS: Record<string, { label: string; variant: "success" | "warning" | "error" | "muted" }> = {
  ativo:    { label: "Ativo", variant: "success" },
  suspenso: { label: "Suspenso", variant: "error" },
  trial:    { label: "Trial", variant: "warning" },
};

const BILLING_STATUS: Record<string, { label: string; variant: "success" | "warning" | "error" | "muted" }> = {
  pago:      { label: "Pago", variant: "success" },
  pendente:  { label: "Pendente", variant: "warning" },
  atrasado:  { label: "Atrasado", variant: "error" },
  cancelado: { label: "Cancelado", variant: "muted" },
};

export default function AdminDashboard() {
  const recentOticas = mockOticas.slice(0, 5);
  const recentBilling = mockBillingEvents.slice(0, 5);

  return (
    <div className="px-[4.2vw] py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Admin</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral da plataforma — maio de 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de óticas"
          value={mockAdminKpis.totalOticas}
          trend="neutral"
          icon={Building2}
        />
        <StatCard
          label="MRR"
          value={`R$ ${mockAdminKpis.mrr.toLocaleString("pt-BR")}`}
          delta={mockAdminKpis.mrrGrowth}
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          label="Churn rate"
          value={`${mockAdminKpis.churnRate}%`}
          trend="neutral"
          icon={TrendingDown}
        />
        <StatCard
          label="Novas este mês"
          value={mockAdminKpis.newThisMonth}
          trend="up"
          icon={Users}
        />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Óticas recentes</h2>
            <a href="/admin/oticas" className="text-xs text-primary hover:underline">Ver todas</a>
          </div>
          <DataTable
            data={recentOticas}
            keyExtractor={(r) => r.id}
            columns={[
              { header: "Ótica", accessor: "name" },
              { header: "Plano", accessor: "plan" },
              {
                header: "MRR",
                cell: (r) => (
                  <span className="tabular-nums text-sm">
                    {r.mrr > 0 ? `R$ ${r.mrr.toLocaleString("pt-BR")}` : "—"}
                  </span>
                ),
              },
              {
                header: "Status",
                cell: (r) => {
                  const s = OTICA_STATUS[r.status];
                  return <Badge variant={s?.variant ?? "muted"}>{s?.label ?? r.status}</Badge>;
                },
              },
            ]}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Faturamento recente</h2>
            <a href="/admin/financeiro" className="text-xs text-primary hover:underline">Ver todos</a>
          </div>
          <DataTable
            data={recentBilling}
            keyExtractor={(r) => r.id}
            columns={[
              { header: "Ótica", accessor: "otica" },
              {
                header: "Valor",
                cell: (r) => (
                  <span className="tabular-nums text-sm font-medium">
                    R$ {r.value.toLocaleString("pt-BR")}
                  </span>
                ),
              },
              {
                header: "Vencimento",
                cell: (r) => (
                  <span className="text-muted-foreground text-xs">
                    {new Date(r.dueDate).toLocaleDateString("pt-BR")}
                  </span>
                ),
              },
              {
                header: "Status",
                cell: (r) => {
                  const s = BILLING_STATUS[r.status];
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
