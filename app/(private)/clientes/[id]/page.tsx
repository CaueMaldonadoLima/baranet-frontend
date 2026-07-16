import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, Column } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import { Button } from "@/components/ui/button";
import { mockCustomers, mockSales } from "@/mocks/erp";

type Sale = (typeof mockSales)[number];

const STATUS_VARIANT: Record<string, "success" | "warning" | "error" | "muted"> = {
  pago: "success",
  pendente: "warning",
  cancelado: "error",
};

const historyColumns: Column<Sale>[] = [
  {
    header: "Nº Venda",
    cell: (row) => <span className="font-medium text-muted-foreground">#{row.id}</span>,
    className: "w-24",
  },
  {
    header: "Data",
    cell: (row) =>
      new Date(row.date + "T00:00:00").toLocaleDateString("pt-BR"),
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
    cell: (row) => row.paymentMethod.charAt(0).toUpperCase() + row.paymentMethod.slice(1),
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

interface Props {
  params: { id: string };
}

export default function ClienteDetalhePage({ params }: Props) {
  const customer = mockCustomers.find((c) => String(c.id) === params.id) ?? mockCustomers[0];

  const history = mockSales
    .filter((s) => s.customer === customer.name)
    .slice(0, 5);

  const fallbackHistory = history.length > 0 ? history : mockSales.slice(0, 3);

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "ERP", href: "/" },
          { label: "Clientes", href: "/clientes" },
          { label: customer.name },
        ]}
      />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
        <Button variant="outline" asChild>
          <Link href={`/clientes/${customer.id}/editar`}>Editar</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-3">
            Dados Pessoais
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Nome</dt>
              <dd className="font-medium text-right">{customer.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">CPF</dt>
              <dd className="font-medium">{customer.cpf}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Telefone</dt>
              <dd className="font-medium">{customer.phone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">E-mail</dt>
              <dd className="font-medium text-right">{customer.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Cidade</dt>
              <dd className="font-medium">{customer.city}/{customer.state}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-3">
            Resumo de Compras
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Total de compras</dt>
              <dd className="font-semibold text-lg">{customer.totalPurchases}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Valor total gasto</dt>
              <dd className="font-semibold text-lg">
                {customer.totalValue.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Ticket médio</dt>
              <dd className="font-medium">
                {(customer.totalValue / Math.max(customer.totalPurchases, 1)).toLocaleString(
                  "pt-BR",
                  { style: "currency", currency: "BRL" }
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Última compra</dt>
              <dd className="font-medium">
                {new Date(customer.lastPurchase + "T00:00:00").toLocaleDateString("pt-BR")}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-foreground">Histórico de Compras</h2>
        <DataTable
          data={fallbackHistory}
          columns={historyColumns}
          keyExtractor={(row) => row.id}
          emptyTitle="Nenhuma compra registrada"
        />
      </div>
    </div>
  );
}
