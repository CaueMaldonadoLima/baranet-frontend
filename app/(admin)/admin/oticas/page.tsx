import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, Column } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockOticas } from "@/mocks/admin";

type Otica = (typeof mockOticas)[number];

const STATUS_VARIANT: Record<string, "success" | "error" | "warning" | "muted"> = {
  ativo: "success",
  suspenso: "error",
  trial: "warning",
};

const columns: Column<Otica>[] = [
  { header: "Nome", accessor: "name" },
  { header: "CNPJ", accessor: "cnpj" },
  {
    header: "Cidade / Estado",
    cell: (row) => `${row.city} / ${row.state}`,
  },
  { header: "Plano", accessor: "plan" },
  {
    header: "Lojas",
    cell: (row) => row.stores,
    className: "text-center",
    headerClassName: "text-center",
  },
  {
    header: "MRR",
    cell: (row) =>
      row.mrr > 0
        ? row.mrr.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        : "—",
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
    cell: (row) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/oticas/${row.id}`}
          className="text-xs text-primary underline-offset-2 hover:underline"
        >
          Ver
        </Link>
        <Link
          href={`/admin/oticas/${row.id}/editar`}
          className="text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Editar
        </Link>
      </div>
    ),
    className: "w-28",
  },
];

export default function OticasPage() {
  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Óticas" },
        ]}
      />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Óticas</h1>
        <Button asChild>
          <Link href="/admin/oticas/criar">Nova Ótica</Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar por nome ou CNPJ..."
          className="max-w-xs"
        />
        <Select defaultValue="todos">
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="suspenso">Suspenso</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={mockOticas}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyTitle="Nenhuma ótica encontrada"
        emptyDescription="Cadastre a primeira ótica para começar."
      />
    </div>
  );
}
