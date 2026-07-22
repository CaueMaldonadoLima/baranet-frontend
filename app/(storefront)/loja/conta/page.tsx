"use client";

import * as React from "react";
import { MapPin, Pencil, Plus } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockOrders } from "@/mocks/storefront";

type Tab = "pedidos" | "dados" | "enderecos";

const STATUS_VARIANT: Record<string, "success" | "error" | "warning"> = {
  entregue: "success",
  cancelado: "error",
  pendente: "warning",
};

const STATUS_LABEL: Record<string, string> = {
  entregue: "Entregue",
  cancelado: "Cancelado",
  pendente: "Pendente",
};

export default function ContaPage() {
  const [tab, setTab] = React.useState<Tab>("pedidos");

  const [nome, setNome] = React.useState("João Silva");
  const [email, setEmail] = React.useState("joao.silva@email.com");
  const [cpf, setCpf] = React.useState("123.456.789-00");
  const [telefone, setTelefone] = React.useState("(11) 98765-4321");
  const [nascimento, setNascimento] = React.useState("1990-05-15");
  const [savingDados, setSavingDados] = React.useState(false);

  function handleSaveDados(e: React.FormEvent) {
    e.preventDefault();
    setSavingDados(true);
    setTimeout(() => setSavingDados(false), 1500);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "pedidos", label: "Pedidos" },
    { id: "dados", label: "Dados pessoais" },
    { id: "enderecos", label: "Endereços" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Minha Conta</h1>
          <p className="text-gray-500 mt-0.5">Olá, {nome}!</p>
        </div>

        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className="shrink-0 py-3 px-4 text-sm font-medium transition-colors cursor-pointer"
              style={
                tab === id
                  ? { color: "var(--store-primary)", borderBottom: "2px solid var(--store-primary)" }
                  : { color: "#6b7280", borderBottom: "2px solid transparent" }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "pedidos" && (
          <div>
            {mockOrders.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p className="text-lg font-medium">Nenhum pedido encontrado</p>
                <p className="text-sm mt-1">Seus pedidos aparecerão aqui.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">{order.id}</span>
                        <Badge variant={STATUS_VARIANT[order.status] ?? "muted"}>
                          {STATUS_LABEL[order.status] ?? order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} —{" "}
                        {order.items} {order.items === 1 ? "item" : "itens"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0">
                      Ver detalhes
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "dados" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-5">Dados pessoais</h2>
            <form onSubmit={handleSaveDados} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <Input value={cpf} onChange={(e) => setCpf(e.target.value)} maxLength={14} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} maxLength={15} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de nascimento</label>
                <Input type="date" value={nascimento} onChange={(e) => setNascimento(e.target.value)} />
              </div>
              <Button
                type="submit"
                disabled={savingDados}
                className="text-white mt-2"
                style={{ backgroundColor: "var(--store-primary)" }}
              >
                {savingDados ? "Salvando…" : "Salvar alterações"}
              </Button>
            </form>
          </div>
        )}

        {tab === "enderecos" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Meus endereços</h2>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                style={{ color: "var(--store-primary)", borderColor: "var(--store-primary)" }}
              >
                <Plus className="size-4" />
                Novo endereço
              </Button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <MapPin className="size-5 mt-0.5 shrink-0 text-gray-400" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">Rua das Flores, 123</span>
                      <Badge variant="success" size="sm">Principal</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Centro</p>
                    <p className="text-sm text-gray-600">São Paulo / SP</p>
                    <p className="text-sm text-gray-500">CEP: 01001-000</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
                  <Pencil className="size-3.5" />
                  Editar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
