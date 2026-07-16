import Link from "next/link";
import { ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, Column } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockSales, mockErpKpis } from "@/mocks/erp";

const STATUS_VARIANT: Record<string, "success" | "warning" | "error" | "muted"> = {
  pago: "success",
  pendente: "warning",
  cancelado: "error",
};

const PAYMENT_LABEL: Record<string, string> = {
  cartão: "Cartão",
  pix: "PIX",
  dinheiro: "Dinheiro",
  crediário: "Crediário",
};

type Sale = (typeof mockSales)[number];

const columns: Column<Sale>[] = [
  {
    header: "Nº",
    cell: (row) => <span className="font-medium text-muted-foreground">#{row.id}</span>,
    className: "w-20",
  },
  { header: "Cliente", accessor: "customer" },
  {
    header: "Data",
    cell: (row) =>
      new Date(row.date + "T00:00:00").toLocaleDateString("pt-BR"),
  },
  {
    header: "Valor",
    cell: (row) =>
      row.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
  },
  {
    header: "Desconto",
    cell: (row) =>
      row.discount > 0
        ? row.discount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        : "—",
  },
  {
    header: "Total",
    cell: (row) => (
      <span className="font-semibold">
        {row.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </span>
    ),
  },
  {
    header: "Pagamento",
    cell: (row) => PAYMENT_LABEL[row.paymentMethod] ?? row.paymentMethod,
  },
  {
    header: "Status",
    cell: (row) => (
      <Badge variant={STATUS_VARIANT[row.status] ?? "muted"}>
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </Badge>
    ),
  },
  {
    header: "Ações",
    className: "w-24",
    cell: (row) => (
      <Button variant="outline" size="xs" asChild>
        <Link href={`/vendas/${row.id}`}>Ver</Link>
      </Button>
    ),
  },
];

export default function VendasPage() {
  const todaySales = mockSales.filter((s) => s.date === "2026-05-22");
  const todayTotal = todaySales.reduce((acc, s) => acc + s.total, 0);

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "ERP", href: "/" },
          { label: "Vendas" },
        ]}
      />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Vendas</h1>
        <Button asChild>
          <Link href="/vendas/nova">Nova Venda</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Vendas hoje"
          value={todayTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          delta={mockErpKpis.salesGrowth}
          trend="up"
          icon={ShoppingCart}
        />
        <StatCard
          label="Faturamento do mês"
          value={mockErpKpis.monthlyRevenue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          delta={mockErpKpis.revenueGrowth}
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          label="Ticket médio"
          value={mockErpKpis.avgTicket.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          trend="neutral"
          icon={TrendingUp}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Input placeholder="Buscar por cliente..." className="max-w-64" />
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">Todos os status</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <DataTable
        data={mockSales}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyTitle="Nenhuma venda encontrada"
        emptyDescription="Registre a primeira venda para começar."
      />
    </div>
  );
}
