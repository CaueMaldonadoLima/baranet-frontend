import { cookies } from "next/headers";
import { mockErpKpis, mockSales, mockLabOrders } from "@/mocks/erp";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import { baranetFetch, readJson, resolveOpticaId, OPTICA_COOKIE } from "@/lib/server/baranet";
import type { Customer, Supplier, PaginatedResponse } from "@/services/types";
import {
  ShoppingCart,
  Wallet,
  FlaskConical,
  Users,
} from "lucide-react";

interface RecentRegistration {
  id: string;
  numericId: number;
  tipo: "cliente" | "fornecedor";
  name: string;
  document: string | null;
  phone: string | null;
}

// Últimos clientes/fornecedores cadastrados de verdade na API — prova
// visual de que a tela de Cadastro está gravando (não é mock).
async function getRecentRegistrations(): Promise<RecentRegistration[]> {
  try {
    const cookieStore = await cookies();
    const opticaId = resolveOpticaId(cookieStore.get(OPTICA_COOKIE)?.value);

    const [customersRes, suppliersRes] = await Promise.all([
      baranetFetch(`/v1/oticas/${opticaId}/customers?per_page=5`),
      baranetFetch(`/v1/oticas/${opticaId}/suppliers?per_page=5`),
    ]);

    const [customers, suppliers] = await Promise.all([
      readJson<PaginatedResponse<Customer>>(customersRes),
      readJson<PaginatedResponse<Supplier>>(suppliersRes),
    ]);

    const combined: RecentRegistration[] = [
      ...(customers?.data ?? []).map((c) => ({
        id: `cliente-${c.id}`,
        numericId: c.id,
        tipo: "cliente" as const,
        name: c.name,
        document: c.cpf,
        phone: c.phone,
      })),
      ...(suppliers?.data ?? []).map((s) => ({
        id: `fornecedor-${s.id}`,
        numericId: s.id,
        tipo: "fornecedor" as const,
        name: s.name,
        document: s.cnpj,
        phone: s.phone,
      })),
    ].sort((a, b) => b.numericId - a.numericId);

    return combined.slice(0, 8);
  } catch {
    // Se a API estiver fora do ar, o resto do dashboard (mock) continua de pé.
    return [];
  }
}

const SALE_STATUS: Record<string, { label: string; variant: "success" | "warning" | "error" | "muted" }> = {
  pago:      { label: "Pago", variant: "success" },
  pendente:  { label: "Pendente", variant: "warning" },
  cancelado: { label: "Cancelado", variant: "error" },
};

const LAB_STATUS: Record<string, { label: string; variant: "info" | "warning" | "success" | "muted" }> = {
  aguardando:   { label: "Aguardando", variant: "warning" },
  em_producao:  { label: "Em produção", variant: "info" },
  pronto:       { label: "Pronto", variant: "success" },
  entregue:     { label: "Entregue", variant: "muted" },
};

export default async function ErpDashboard() {
  const recentSales = mockSales.slice(0, 5);
  const pendingLab = mockLabOrders.filter((o) => o.status !== "entregue").slice(0, 4);
  const recentRegistrations = await getRecentRegistrations();

  return (
    <div className="px-[4.2vw] py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral da loja — hoje, 22 de maio de 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Vendas hoje"
          value={`R$ ${mockErpKpis.salesToday.toLocaleString("pt-BR")}`}
          delta={mockErpKpis.salesGrowth}
          trend="up"
          icon={ShoppingCart}
        />
        <StatCard
          label="Saldo em caixa"
          value={`R$ ${mockErpKpis.cashBalance.toLocaleString("pt-BR")}`}
          trend="neutral"
          icon={Wallet}
        />
        <StatCard
          label="Pedidos lab. pendentes"
          value={mockErpKpis.pendingOrders}
          trend={mockErpKpis.pendingOrders > 5 ? "down" : "neutral"}
          icon={FlaskConical}
        />
        <StatCard
          label="Faturamento do mês"
          value={`R$ ${mockErpKpis.monthlyRevenue.toLocaleString("pt-BR")}`}
          delta={mockErpKpis.revenueGrowth}
          trend="up"
          icon={Users}
        />
      </div>

      {/* Cadastros recentes — clientes/fornecedores salvos na API real */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-foreground">Cadastros recentes</h2>
        <DataTable
          data={recentRegistrations}
          keyExtractor={(r) => r.id}
          emptyTitle="Nenhum cadastro ainda"
          emptyDescription="Clientes e fornecedores criados em Cadastro aparecem aqui."
          columns={[
            { header: "Nome", accessor: "name" },
            {
              header: "Tipo",
              cell: (r) => (
                <Badge variant={r.tipo === "cliente" ? "info" : "default"}>
                  {r.tipo === "cliente" ? "Cliente" : "Fornecedor"}
                </Badge>
              ),
            },
            { header: "CPF/CNPJ", cell: (r) => r.document || "—" },
            { header: "Telefone", cell: (r) => r.phone || "—" },
          ]}
        />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Vendas recentes</h2>
            <a href="/vendas" className="text-xs text-primary hover:underline">Ver todas</a>
          </div>
          <DataTable
            data={recentSales}
            keyExtractor={(r) => r.id}
            columns={[
              { header: "Cliente", accessor: "customer" },
              {
                header: "Total",
                cell: (r) => (
                  <span className="font-medium tabular-nums">
                    R$ {r.total.toLocaleString("pt-BR")}
                  </span>
                ),
              },
              {
                header: "Status",
                cell: (r) => {
                  const s = SALE_STATUS[r.status];
                  return <Badge variant={s?.variant ?? "muted"}>{s?.label ?? r.status}</Badge>;
                },
              },
            ]}
          />
        </div>

        {/* Lab Orders */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Pedidos de laboratório</h2>
            <a href="/laboratorio" className="text-xs text-primary hover:underline">Ver todos</a>
          </div>
          <DataTable
            data={pendingLab}
            keyExtractor={(r) => r.id}
            emptyTitle="Nenhum pedido pendente"
            columns={[
              { header: "Cliente", accessor: "customer" },
              { header: "Laboratório", accessor: "lab" },
              {
                header: "Prazo",
                cell: (r) => (
                  <span className="text-muted-foreground text-xs">
                    {new Date(r.dueDate).toLocaleDateString("pt-BR")}
                  </span>
                ),
              },
              {
                header: "Status",
                cell: (r) => {
                  const s = LAB_STATUS[r.status];
                  return <Badge variant={s?.variant ?? "muted"}>{s?.label ?? r.status}</Badge>;
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
