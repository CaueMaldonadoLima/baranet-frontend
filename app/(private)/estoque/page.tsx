import Link from "next/link";
import { Package, AlertTriangle, DollarSign } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, Column } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shared/tabs";
import { Button } from "@/components/ui/button";
import { mockProducts, mockStockMovements } from "@/mocks/erp";

type Product = (typeof mockProducts)[number];
type StockMovement = (typeof mockStockMovements)[number];

const inStockCount = mockProducts.filter((p) => p.stock > 0).length;
const outOfStockCount = mockProducts.filter((p) => p.stock <= 0).length;
const stockValue = mockProducts.reduce((acc, p) => acc + p.price * p.stock, 0);

function StockStatusBadge({ stock, minStock }: { stock: number; minStock: number }) {
  if (stock <= 0) return <Badge variant="error">Zerado</Badge>;
  if (stock <= minStock) return <Badge variant="warning">Baixo</Badge>;
  return <Badge variant="success">OK</Badge>;
}

const MOVEMENT_VARIANT: Record<string, "success" | "warning" | "info"> = {
  entrada: "success",
  saída: "warning",
  ajuste: "info",
};

const positionColumns: Column<Product>[] = [
  { header: "Código", accessor: "code", className: "w-28 font-mono text-xs" },
  { header: "Nome", accessor: "name" },
  {
    header: "Categoria",
    cell: (row) => row.category.charAt(0).toUpperCase() + row.category.slice(1),
  },
  {
    header: "Estoque atual",
    cell: (row) => (
      <span className={row.stock <= 0 ? "text-destructive font-semibold" : "font-medium"}>
        {row.stock}
      </span>
    ),
    className: "text-center",
    headerClassName: "text-center",
  },
  {
    header: "Estoque mínimo",
    accessor: "minStock",
    className: "text-center",
    headerClassName: "text-center",
  },
  {
    header: "Status",
    cell: (row) => <StockStatusBadge stock={row.stock} minStock={row.minStock} />,
  },
];

const movementColumns: Column<StockMovement>[] = [
  { header: "Produto", accessor: "product" },
  {
    header: "Tipo",
    cell: (row) => (
      <Badge variant={MOVEMENT_VARIANT[row.type] ?? "muted"}>
        {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
      </Badge>
    ),
  },
  {
    header: "Qtd",
    cell: (row) => (
      <span className={row.qty < 0 ? "text-destructive" : ""}>
        {row.qty > 0 ? `+${row.qty}` : row.qty}
      </span>
    ),
    className: "w-20 text-center",
    headerClassName: "text-center",
  },
  { header: "Motivo", accessor: "reason" },
  {
    header: "Data",
    cell: (row) =>
      new Date(row.date + "T00:00:00").toLocaleDateString("pt-BR"),
  },
  { header: "Usuário", accessor: "user" },
];

export default function EstoquePage() {
  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "ERP", href: "/" },
          { label: "Estoque" },
        ]}
      />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Estoque</h1>
        <Button asChild>
          <Link href="/estoque/movimentacao">Registrar Movimentação</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Produtos em estoque"
          value={inStockCount}
          trend="neutral"
          icon={Package}
        />
        <StatCard
          label="Produtos sem estoque"
          value={outOfStockCount}
          trend={outOfStockCount > 0 ? "down" : "neutral"}
          icon={AlertTriangle}
        />
        <StatCard
          label="Valor em estoque"
          value={stockValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          trend="neutral"
          icon={DollarSign}
        />
      </div>

      <Tabs defaultValue="posicao">
        <TabsList>
          <TabsTrigger value="posicao">Posição atual</TabsTrigger>
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
        </TabsList>

        <TabsContent value="posicao">
          <DataTable
            data={mockProducts}
            columns={positionColumns}
            keyExtractor={(row) => row.id}
            emptyTitle="Nenhum produto cadastrado"
          />
        </TabsContent>

        <TabsContent value="movimentacoes">
          <DataTable
            data={mockStockMovements}
            columns={movementColumns}
            keyExtractor={(row) => row.id}
            emptyTitle="Nenhuma movimentação registrada"
            emptyDescription="Registre a primeira movimentação para começar."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
