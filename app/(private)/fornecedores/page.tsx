import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { mockSuppliers } from "@/mocks/erp";
import { Truck, Pencil } from "lucide-react";

type Supplier = (typeof mockSuppliers)[number];

const CATEGORY_VARIANTS: Record<string, "default" | "info" | "warning"> = {
  lentes: "info",
  armações: "default",
  acessórios: "warning",
};

const columns: Column<Supplier>[] = [
  { header: "Nome", accessor: "name" },
  { header: "CNPJ", accessor: "cnpj" },
  { header: "Contato", accessor: "contact" },
  { header: "Telefone", accessor: "phone" },
  { header: "Email", accessor: "email" },
  {
    header: "Categoria",
    cell: (row) => (
      <Badge variant={CATEGORY_VARIANTS[row.category] ?? "muted"}>
        {row.category}
      </Badge>
    ),
  },
  {
    header: "Último pedido",
    cell: (row) => new Date(row.lastOrder).toLocaleDateString("pt-BR"),
  },
  { header: "Total pedidos", accessor: "totalOrders", className: "text-center" },
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

export default function FornecedoresPage() {
  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb items={[{ label: "ERP" }, { label: "Fornecedores" }]} />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Fornecedores</h1>
        <Button>
          <Truck className="size-4" />
          Novo Fornecedor
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total de fornecedores" value={mockSuppliers.length} trend="neutral" />
        <StatCard
          label="Fornecedores de lentes"
          value={mockSuppliers.filter((s) => s.category === "lentes").length}
          trend="neutral"
        />
        <StatCard
          label="Pedidos realizados"
          value={mockSuppliers.reduce((acc, s) => acc + s.totalOrders, 0)}
          trend="neutral"
        />
      </div>

      <DataTable
        data={mockSuppliers}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyTitle="Nenhum fornecedor cadastrado"
        emptyDescription="Cadastre o primeiro fornecedor para começar."
      />
    </div>
  );
}
