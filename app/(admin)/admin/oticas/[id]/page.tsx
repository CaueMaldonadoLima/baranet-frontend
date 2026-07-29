"use client";

import { useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/shared/badge";
import { Modal, ModalFooter } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { mockOticas } from "@/mocks/admin";

const STATUS_VARIANT: Record<string, "success" | "error" | "warning" | "muted"> = {
  ativo: "success",
  suspenso: "error",
  trial: "warning",
};

const BILLING_HISTORY = [
  { date: "01/05/2026", description: "Pagamento de fatura — Plano Premium (R$ 599,00)" },
  { date: "01/04/2026", description: "Pagamento de fatura — Plano Premium (R$ 599,00)" },
  { date: "15/03/2026", description: "Upgrade de plano: Padrão → Premium" },
  { date: "01/03/2026", description: "Pagamento de fatura — Plano Padrão (R$ 399,00)" },
];

export default function OticaDetailPage({ params }: { params: { id: string } }) {
  const otica = mockOticas.find((o) => String(o.id) === params.id) ?? mockOticas[0];
  const [modalOpen, setModalOpen] = useState(false);
  const isSuspended = otica.status === "suspenso";

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Óticas", href: "/admin/oticas" },
          { label: otica.name },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{otica.name}</h1>
          <Badge variant={STATUS_VARIANT[otica.status] ?? "muted"}>
            {otica.status.charAt(0).toUpperCase() + otica.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/oticas/${otica.id}/editar`}>Editar</Link>
          </Button>
          <Button
            variant={isSuspended ? "default" : "destructive"}
            onClick={() => setModalOpen(true)}
          >
            {isSuspended ? "Ativar" : "Suspender"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-semibold">Dados cadastrais</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">CNPJ</dt>
              <dd className="font-medium">{otica.cnpj}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Cidade / Estado</dt>
              <dd className="font-medium">{otica.city} / {otica.state}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Cliente desde</dt>
              <dd className="font-medium">
                {new Date(otica.since).toLocaleDateString("pt-BR")}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-semibold">Billing</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Plano</dt>
              <dd className="font-medium">{otica.plan}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">MRR</dt>
              <dd className="font-medium">
                {otica.mrr > 0
                  ? otica.mrr.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Lojas</dt>
              <dd className="font-medium">{otica.stores}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-semibold">Histórico de eventos</h2>
        <div className="rounded-lg border border-border bg-card divide-y divide-border">
          {BILLING_HISTORY.map((event, i) => (
            <div key={i} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
              <span className="text-muted-foreground w-24 shrink-0">{event.date}</span>
              <span className="flex-1">{event.description}</span>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={isSuspended ? "Ativar ótica" : "Suspender ótica"}
        description={
          isSuspended
            ? `Tem certeza que deseja reativar "${otica.name}"?`
            : `Tem certeza que deseja suspender "${otica.name}"? O acesso será bloqueado imediatamente.`
        }
        size="sm"
      >
        <ModalFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant={isSuspended ? "default" : "destructive"}
            onClick={() => setModalOpen(false)}
          >
            {isSuspended ? "Sim, ativar" : "Sim, suspender"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
