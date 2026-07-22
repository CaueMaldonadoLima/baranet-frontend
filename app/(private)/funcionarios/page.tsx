import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { mockEmployees } from "@/mocks/erp";
import { Users, Pencil } from "lucide-react";

type Employee = (typeof mockEmployees)[number];

const ROLE_VARIANTS: Record<
  string,
  "default" | "info" | "warning" | "success" | "muted"
> = {
  gerente: "default",
  vendedor: "info",
  optometrista: "success",
  caixa: "warning",
};

const columns: Column<Employee>[] = [
  { header: "Nome", accessor: "name" },
  {
    header: "Cargo",
    cell: (row) => (
      <Badge variant={ROLE_VARIANTS[row.role] ?? "muted"}>
        {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
      </Badge>
    ),
  },
  { header: "Email", accessor: "email" },
  { header: "Telefone", accessor: "phone" },
  { header: "Loja", accessor: "store" },
  {
    header: "Status",
    cell: (row) => (
      <Badge variant={row.status === "ativo" ? "success" : "muted"}>
        {row.status === "ativo" ? "Ativo" : "Inativo"}
      </Badge>
    ),
  },
  {
    header: "Comissão",
    cell: (row) => `${row.commission}%`,
    className: "text-center",
  },
  {
    header: "Vendas no mês",
    cell: (row) => row.sales,
    className: "text-center",
  },
  {
    header: "Ações",
    className: "w-24",
    cell: () => (
      <Button variant="ghost" size="sm">
        <Pencil className="size-3.5" />
        Editar
      </Button>
    ),
  },
];

export default function FuncionariosPage() {
  const active = mockEmployees.filter((e) => e.status === "ativo").length;
  const totalSales = mockEmployees.reduce((acc, e) => acc + e.sales, 0);

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb items={[{ label: "ERP" }, { label: "Funcionários" }]} />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Funcionários</h1>
        <Button asChild>
          <Link href="/cadastro">
            <Users className="size-4" />
            Novo Funcionário
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total de funcionários" value={mockEmployees.length} trend="neutral" />
        <StatCard label="Ativos" value={active} trend="neutral" />
        <StatCard label="Vendas no mês (total)" value={totalSales} trend="up" />
      </div>

      <DataTable
        data={mockEmployees}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyTitle="Nenhum funcionário cadastrado"
        emptyDescription="Cadastre o primeiro funcionário para começar."
      />
    </div>
  );
}
