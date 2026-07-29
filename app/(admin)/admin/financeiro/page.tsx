import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, Column } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import { StatCard } from "@/components/shared/stat-card";
import { DollarSign, AlertTriangle, CheckCircle2 } from "lucide-react";
import { mockBillingEvents, mockAdminKpis } from "@/mocks/admin";

type BillingEvent = (typeof mockBillingEvents)[number];

const STATUS_VARIANT: Record<string, "success" | "error" | "warning" | "muted"> = {
  pago: "success",
  pendente: "warning",
  atrasado: "error",
  cancelado: "muted",
};

const columns: Column<BillingEvent>[] = [
  { header: "Ótica", accessor: "otica" },
  {
    header: "Tipo",
    cell: (row) => row.type === "payment" ? "Mensalidade" : row.type,
  },
  {
    header: "Valor",
    cell: (row) =>
      row.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
  },
  {
    header: "Vencimento",
    cell: (row) => new Date(row.dueDate).toLocaleDateString("pt-BR"),
  },
  {
    header: "Pago em",
    cell: (row) =>
      row.date ? new Date(row.date).toLocaleDateString("pt-BR") : "—",
  },
  {
    header: "Status",
    cell: (row) => (
      <Badge variant={STATUS_VARIANT[row.status] ?? "muted"}>
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </Badge>
    ),
  },
];

const inadimplencia = mockBillingEvents
  .filter((e) => e.status === "atrasado")
  .reduce((acc, e) => acc + e.value, 0);

const pagosMes = mockBillingEvents.filter((e) => e.status === "pago").length;

export default function FinanceiroPage() {
  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Financeiro" },
        ]}
      />

      <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="MRR Total"
          value={mockAdminKpis.mrr.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          delta={mockAdminKpis.mrrGrowth}
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          label="Inadimplência"
          value={inadimplencia.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          trend="down"
          icon={AlertTriangle}
        />
        <StatCard
          label="Faturas pagas este mês"
          value={pagosMes}
          trend="neutral"
          icon={CheckCircle2}
        />
      </div>

      <DataTable
        data={mockBillingEvents}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyTitle="Nenhum evento de cobrança"
      />
    </div>
  );
}
