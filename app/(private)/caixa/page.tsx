"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import { StatCard } from "@/components/shared/stat-card";
import { Modal, ModalFooter } from "@/components/shared/modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shared/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockCashMovements } from "@/mocks/erp";
import { Wallet, Plus } from "lucide-react";

type CashMovement = (typeof mockCashMovements)[number];

const paymentSummary = [
  { method: "Dinheiro", total: 2500 },
  { method: "Cartão", total: 3200 },
  { method: "PIX", total: 1800 },
];

const columns: Column<CashMovement>[] = [
  {
    header: "Tipo",
    cell: (row) => (
      <Badge variant={row.type === "entrada" ? "success" : "warning"}>
        {row.type === "entrada" ? "Entrada" : "Saída"}
      </Badge>
    ),
    className: "w-28",
  },
  { header: "Descrição", accessor: "description" },
  {
    header: "Valor",
    cell: (row) => (
      <span className={row.type === "entrada" ? "text-success font-medium" : "text-warning font-medium"}>
        {row.type === "entrada" ? "+" : "-"} R${" "}
        {Math.abs(row.value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </span>
    ),
  },
  { header: "Forma", accessor: "method" },
  {
    header: "Hora",
    cell: (row) => row.date.split(" ")[1] ?? row.date,
  },
  { header: "Usuário", accessor: "user" },
];

export default function CaixaPage() {
  const [closeOpen, setCloseOpen] = useState(false);
  const [movOpen, setMovOpen] = useState(false);
  const [movType, setMovType] = useState("entrada");
  const [movDesc, setMovDesc] = useState("");
  const [movValue, setMovValue] = useState("");
  const [movMethod, setMovMethod] = useState("");

  const entradas = mockCashMovements
    .filter((m) => m.type === "entrada")
    .reduce((acc, m) => acc + m.value, 0);

  const saidas = mockCashMovements
    .filter((m) => m.type === "saída")
    .reduce((acc, m) => acc + Math.abs(m.value), 0);

  const balance = entradas - saidas;

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb items={[{ label: "ERP" }, { label: "Caixa" }]} />

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="flex-1 text-2xl font-semibold text-foreground">Caixa</h1>
        <Badge variant="success">Aberto</Badge>
        <Button variant="outline" onClick={() => setCloseOpen(true)}>
          Fechar Caixa
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Saldo atual" value={fmt(balance)} trend="neutral" icon={Wallet} />
        <StatCard label="Total entradas" value={fmt(entradas)} trend="up" />
        <StatCard label="Total saídas" value={fmt(saidas)} trend="down" />
      </div>

      <Tabs defaultValue="movimentacoes">
        <TabsList>
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
        </TabsList>

        <TabsContent value="movimentacoes">
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setMovOpen(true)}>
              <Plus className="size-4" />
              Registrar Movimentação
            </Button>
          </div>
          <DataTable
            data={mockCashMovements}
            columns={columns}
            keyExtractor={(row) => row.id}
            emptyTitle="Nenhuma movimentação"
          />
        </TabsContent>

        <TabsContent value="resumo">
          <div className="grid gap-4 sm:grid-cols-3">
            {paymentSummary.map((item) => (
              <div
                key={item.method}
                className="rounded-lg border border-border bg-card p-5 shadow-sm"
              >
                <p className="text-sm text-muted-foreground">{item.method}</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {fmt(item.total)}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal: Fechar Caixa */}
      <Modal
        open={closeOpen}
        onOpenChange={setCloseOpen}
        title="Fechar Caixa"
        description="Confirme o fechamento do caixa para hoje."
        size="sm"
      >
        <div className="space-y-3">
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm text-muted-foreground">Saldo final</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{fmt(balance)}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Esta ação irá encerrar as operações do caixa. Deseja continuar?
          </p>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setCloseOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => setCloseOpen(false)}>
            Fechar Caixa
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal: Registrar Movimentação */}
      <Modal
        open={movOpen}
        onOpenChange={setMovOpen}
        title="Registrar Movimentação"
        size="sm"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Tipo</label>
            <select
              value={movType}
              onChange={(e) => setMovType(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="entrada">Entrada</option>
              <option value="saída">Saída</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Descrição</label>
            <Input
              placeholder="Ex: Sangria, Venda avulsa..."
              value={movDesc}
              onChange={(e) => setMovDesc(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Valor (R$)</label>
            <Input
              type="number"
              placeholder="0,00"
              value={movValue}
              onChange={(e) => setMovValue(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Forma de pagamento</label>
            <select
              value={movMethod}
              onChange={(e) => setMovMethod(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Selecione...</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartão">Cartão</option>
              <option value="pix">PIX</option>
            </select>
          </div>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setMovOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setMovOpen(false)}>Registrar</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
