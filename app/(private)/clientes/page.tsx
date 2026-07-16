import Link from "next/link";
import { Users, UserCheck, TrendingUp } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockCustomers, mockErpKpis } from "@/mocks/erp";

type Customer = (typeof mockCustomers)[number];

const NINETY_DAYS_AGO = new Date("2026-05-22");
NINETY_DAYS_AGO.setDate(NINETY_DAYS_AGO.getDate() - 90);

const activeCount = mockCustomers.filter(
  (c) => new Date(c.lastPurchase) >= NINETY_DAYS_AGO
).length;

const avgTicket =
  mockCustomers.length > 0
    ? mockCustomers.reduce((acc, c) => acc + c.totalValue, 0) /
      mockCustomers.reduce((acc, c) => acc + c.totalPurchases, 0)
    : 0;

const columns: Column<Customer>[] = [
  { header: "Nome", accessor: "name" },
  { header: "CPF", accessor: "cpf" },
  { header: "Telefone", accessor: "phone" },
  {
    header: "Cidade/UF",
    cell: (row) => `${row.city}/${row.state}`,
  },
  {
    header: "Última compra",
    cell: (row) =>
      new Date(row.lastPurchase + "T00:00:00").toLocaleDateString("pt-BR"),
  },
  {
    header: "Compras",
    cell: (row) => row.totalPurchases,
    className: "text-center",
    headerClassName: "text-center",
  },
  {
    header: "Valor total",
    cell: (row) =>
      row.totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
  },
  {
    header: "Ações",
    className: "w-24",
    cell: (row) => (
      <Button variant="outline" size="xs" asChild>
        <Link href={`/clientes/${row.id}`}>Ver</Link>
      </Button>
    ),
  },
];

export default function ClientesPage() {
  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "ERP", href: "/" },
          { label: "Clientes" },
        ]}
      />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
        <Button asChild>
          <Link href="/clientes/novo">Novo Cliente</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total de clientes"
          value={mockCustomers.length}
          trend="neutral"
          icon={Users}
        />
        <StatCard
          label="Clientes ativos (90 dias)"
          value={activeCount}
          trend="neutral"
          icon={UserCheck}
        />
        <StatCard
          label="Ticket médio"
          value={avgTicket.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          delta={mockErpKpis.salesGrowth}
          trend="up"
          icon={TrendingUp}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Input placeholder="Buscar por nome, CPF ou telefone..." className="max-w-80" />
      </div>

      <DataTable
        data={mockCustomers}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyTitle="Nenhum cliente encontrado"
        emptyDescription="Cadastre o primeiro cliente para começar."
      />
    </div>
  );
}
