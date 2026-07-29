import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { mockFiscalNotes } from "@/mocks/erp";
import { FileText, Download, X } from "lucide-react";

type FiscalNote = (typeof mockFiscalNotes)[number];

const columns: Column<FiscalNote>[] = [
  { header: "Número", accessor: "number" },
  { header: "Cliente", accessor: "customer" },
  {
    header: "Valor",
    cell: (row) =>
      row.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
  },
  {
    header: "Data emissão",
    cell: (row) => new Date(row.issued).toLocaleDateString("pt-BR"),
  },
  {
    header: "Tipo",
    cell: (row) => <Badge variant="outline">{row.type}</Badge>,
  },
  {
    header: "Status",
    cell: (row) => (
      <Badge variant={row.status === "autorizada" ? "success" : "error"}>
        {row.status === "autorizada" ? "Autorizada" : "Cancelada"}
      </Badge>
    ),
  },
  {
    header: "Ações",
    className: "w-40",
    cell: (row) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" title="Download XML">
          <Download className="size-3.5" />
          XML
        </Button>
        {row.status !== "cancelada" && (
          <Button variant="ghost" size="sm" title="Cancelar NF">
            <X className="size-3.5" />
          </Button>
        )}
      </div>
    ),
  },
];

export default function FiscalPage() {
  const currentMonth = new Date().getMonth();
  const emitted = mockFiscalNotes.filter(
    (n) => n.status === "autorizada" && new Date(n.issued).getMonth() === currentMonth
  );
  const cancelled = mockFiscalNotes.filter((n) => n.status === "cancelada").length;
  const totalValue = emitted.reduce((acc, n) => acc + n.value, 0);

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb items={[{ label: "ERP" }, { label: "Fiscal / NF-e" }]} />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Notas Fiscais</h1>
        <Button>
          <FileText className="size-4" />
          Emitir NF-e
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="NFs emitidas no mês" value={emitted.length} trend="neutral" />
        <StatCard label="Canceladas" value={cancelled} trend="neutral" />
        <StatCard
          label="Valor total emitido"
          value={totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          trend="up"
        />
      </div>

      <DataTable
        data={mockFiscalNotes}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyTitle="Nenhuma nota fiscal emitida"
        emptyDescription="Emita a primeira NF-e para começar."
      />
    </div>
  );
}
