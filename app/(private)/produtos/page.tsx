import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, Column } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockProducts } from "@/mocks/erp";

type Product = (typeof mockProducts)[number];

const CATEGORY_VARIANT: Record<string, "default" | "info" | "warning" | "success" | "muted"> = {
  armação: "default",
  lente: "info",
  solar: "warning",
  acessório: "muted",
};

const CATEGORY_LABEL: Record<string, string> = {
  armação: "Armação",
  lente: "Lente",
  solar: "Solar",
  acessório: "Acessório",
};

function StockBadge({ stock, minStock }: { stock: number; minStock: number }) {
  if (stock <= 0)
    return <Badge variant="error">Sem estoque</Badge>;
  if (stock <= minStock)
    return <Badge variant="warning">Baixo</Badge>;
  return <Badge variant="success">OK</Badge>;
}

const columns: Column<Product>[] = [
  { header: "Código", accessor: "code", className: "w-28 font-mono text-xs" },
  { header: "Nome", accessor: "name" },
  {
    header: "Categoria",
    cell: (row) => (
      <Badge variant={CATEGORY_VARIANT[row.category] ?? "muted"}>
        {CATEGORY_LABEL[row.category] ?? row.category}
      </Badge>
    ),
  },
  { header: "Marca", accessor: "brand" },
  {
    header: "Preço venda",
    cell: (row) =>
      row.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
  },
  {
    header: "Custo",
    cell: (row) =>
      row.cost.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
  },
  {
    header: "Estoque",
    cell: (row) => (
      <div className="flex items-center gap-2">
        <span className={row.stock <= 0 ? "text-destructive font-semibold" : ""}>{row.stock}</span>
        <StockBadge stock={row.stock} minStock={row.minStock} />
      </div>
    ),
  },
  {
    header: "Mínimo",
    accessor: "minStock",
    className: "text-center",
    headerClassName: "text-center",
  },
  {
    header: "Status",
    cell: (row) => (
      <Badge variant={row.active ? "success" : "muted"}>
        {row.active ? "Ativo" : "Inativo"}
      </Badge>
    ),
  },
  {
    header: "Ações",
    className: "w-24",
    cell: (row) => (
      <Button variant="outline" size="xs" asChild>
        <Link href={`/produtos/${row.id}/editar`}>Editar</Link>
      </Button>
    ),
  },
];

export default function ProdutosPage() {
  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "ERP", href: "/" },
          { label: "Produtos" },
        ]}
      />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
        <Button asChild>
          <Link href="/produtos/novo">Novo Produto</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input placeholder="Buscar por nome ou código..." className="max-w-64" />
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">Todas as categorias</option>
          <option value="armação">Armação</option>
          <option value="lente">Lente</option>
          <option value="solar">Solar</option>
          <option value="acessório">Acessório</option>
        </select>
      </div>

      <DataTable
        data={mockProducts}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyTitle="Nenhum produto encontrado"
        emptyDescription="Cadastre o primeiro produto para começar."
      />
    </div>
  );
}
