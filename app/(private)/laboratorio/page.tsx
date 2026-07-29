import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { mockLabOrders } from "@/mocks/erp";
import { FlaskConical } from "lucide-react";

type LabOrder = (typeof mockLabOrders)[number];

const STATUS_MAP: Record<
  string,
  { label: string; variant: "warning" | "info" | "success" | "muted" }
> = {
  aguardando: { label: "Aguardando", variant: "warning" },
  em_producao: { label: "Em produção", variant: "info" },
  pronto: { label: "Pronto", variant: "success" },
  entregue: { label: "Entregue", variant: "muted" },
};

const columns: Column<LabOrder>[] = [
  { header: "Nº", accessor: "id", className: "w-20" },
  { header: "Cliente", accessor: "customer" },
  { header: "Produto", accessor: "product" },
  { header: "Laboratório", accessor: "lab" },
  {
    header: "Receita",
    cell: (row) => (
      <span className="block max-w-48 truncate text-muted-foreground" title={row.prescription}>
        {row.prescription}
      </span>
    ),
  },
  {
    header: "Enviado em",
    cell: (row) => new Date(row.sentDate).toLocaleDateString("pt-BR"),
  },
  {
    header: "Prazo",
    cell: (row) => new Date(row.dueDate).toLocaleDateString("pt-BR"),
  },
  {
    header: "Status",
    cell: (row) => {
      const s = STATUS_MAP[row.status] ?? { label: row.status, variant: "muted" as const };
      return <Badge variant={s.variant}>{s.label}</Badge>;
    },
  },
];

export default function LaboratorioPage() {
  const total = mockLabOrders.length;
  const pending = mockLabOrders.filter(
    (o) => o.status === "aguardando" || o.status === "em_producao"
  ).length;
  const ready = mockLabOrders.filter((o) => o.status === "pronto").length;

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[{ label: "ERP" }, { label: "Pedidos de Laboratório" }]}
      />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Pedidos de Laboratório
        </h1>
        <Button>
          <FlaskConical className="size-4" />
          Novo Pedido
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total de pedidos" value={total} trend="neutral" />
        <StatCard label="Pendentes" value={pending} trend="neutral" />
        <StatCard label="Prontos para retirada" value={ready} trend="up" />
      </div>

      <DataTable
        data={mockLabOrders}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyTitle="Nenhum pedido de laboratório"
        emptyDescription="Crie o primeiro pedido para começar."
      />
    </div>
  );
}
