"use client";

import { useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { FormSection } from "@/components/shared/form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockPlans } from "@/mocks/admin";

const UF_LIST = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
  "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
];

export default function CriarOticaPage() {
  const [loading, setLoading] = useState(false);

  function handleSave() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Óticas", href: "/admin/oticas" },
          { label: "Nova Ótica" },
        ]}
      />

      <h1 className="text-2xl font-bold tracking-tight">Nova Ótica</h1>

      <div className="max-w-2xl space-y-8">
        <FormSection title="Dados da empresa" description="Informações fiscais e cadastrais da ótica.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nome fantasia</label>
              <Input placeholder="Ex: Ótica Visão Clara" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">CNPJ</label>
              <Input placeholder="00.000.000/0001-00" />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-sm font-medium">Razão social</label>
              <Input placeholder="Razão social completa" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">E-mail</label>
              <Input type="email" placeholder="contato@otica.com.br" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Telefone</label>
              <Input placeholder="(00) 00000-0000" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Cidade</label>
              <Input placeholder="Cidade" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Estado (UF)</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {UF_LIST.map((uf) => (
                    <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </FormSection>

        <FormSection title="Plano" description="Plano contratado pela ótica.">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Plano</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                {mockPlans.map((plan) => (
                  <SelectItem key={plan.id} value={String(plan.id)}>
                    {plan.name} — R$ {plan.price}/mês
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FormSection>

        <FormSection title="Responsável" description="Contato responsável pela conta.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nome do responsável</label>
              <Input placeholder="Nome completo" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">E-mail do responsável</label>
              <Input type="email" placeholder="responsavel@otica.com.br" />
            </div>
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" asChild>
            <Link href="/admin/oticas">Cancelar</Link>
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
