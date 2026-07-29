"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { FormSection } from "@/components/shared/form-section";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shared/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/shared/badge";
import { Eye } from "lucide-react";

const stores = [
  {
    id: 1,
    name: "Loja Centro",
    address: "Rua das Flores, 123 — Centro",
    status: "ativo",
  },
  {
    id: 2,
    name: "Loja Shopping",
    address: "Av. Brasil, 5000 — Shopping Iguatemi, L42",
    status: "ativo",
  },
];

export default function ConfiguracoesPage() {
  const [showEstoque, setShowEstoque] = useState(true);
  const [obrigarCpf, setObrigarCpf] = useState(false);
  const [emitirNf, setEmitirNf] = useState(false);
  const [notificarEstoque, setNotificarEstoque] = useState(true);

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb items={[{ label: "ERP" }, { label: "Configurações" }]} />

      <h1 className="text-2xl font-semibold text-foreground">Configurações</h1>

      <Tabs defaultValue="dados">
        <TabsList>
          <TabsTrigger value="dados">Dados da Ótica</TabsTrigger>
          <TabsTrigger value="lojas">Lojas / Filiais</TabsTrigger>
          <TabsTrigger value="preferencias">Preferências</TabsTrigger>
        </TabsList>

        {/* Dados da Ótica */}
        <TabsContent value="dados">
          <div className="max-w-2xl space-y-6">
            <FormSection
              title="Dados da Empresa"
              description="Informações fiscais e de contato da ótica."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Razão Social
                  </label>
                  <Input defaultValue="Ótica Baranet Ltda." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">CNPJ</label>
                  <Input defaultValue="12.345.678/0001-90" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Telefone</label>
                  <Input defaultValue="(11) 3456-7890" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input type="email" defaultValue="contato@baranet.com.br" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Endereço</label>
                  <Input defaultValue="Rua das Flores, 123" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Cidade</label>
                  <Input defaultValue="São Paulo" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Estado</label>
                  <Input defaultValue="SP" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Logo da Empresa
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="flex w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground shadow-sm file:mr-3 file:rounded file:border-0 file:bg-primary/10 file:px-2 file:py-1 file:text-xs file:font-medium file:text-primary"
                  />
                </div>
              </div>
            </FormSection>

            <div className="flex justify-end">
              <Button>Salvar alterações</Button>
            </div>
          </div>
        </TabsContent>

        {/* Lojas / Filiais */}
        <TabsContent value="lojas">
          <div className="max-w-2xl space-y-6">
            <div className="overflow-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Endereço
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Status
                    </th>
                    <th className="w-28 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stores.map((store) => (
                    <tr
                      key={store.id}
                      className="bg-card transition-colors hover:bg-muted/40"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {store.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {store.address}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={store.status === "ativo" ? "success" : "muted"}>
                          {store.status === "ativo" ? "Ativa" : "Inativa"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm">
                          <Eye className="size-3.5" />
                          Ver loja
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <Button>Salvar alterações</Button>
            </div>
          </div>
        </TabsContent>

        {/* Preferências */}
        <TabsContent value="preferencias">
          <div className="max-w-2xl space-y-6">
            <FormSection
              title="Preferências do Sistema"
              description="Configure o comportamento padrão do sistema para sua ótica."
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Exibir estoque no PDV
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mostra a quantidade disponível em estoque durante o processo de venda.
                    </p>
                  </div>
                  <Switch
                    checked={showEstoque}
                    onCheckedChange={setShowEstoque}
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Obrigar CPF na venda
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Impede finalizar a venda sem informar o CPF do cliente.
                    </p>
                  </div>
                  <Switch
                    checked={obrigarCpf}
                    onCheckedChange={setObrigarCpf}
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Emitir NF automaticamente
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Emite a NF-e automaticamente ao finalizar cada venda.
                    </p>
                  </div>
                  <Switch
                    checked={emitirNf}
                    onCheckedChange={setEmitirNf}
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Notificar estoque baixo por email
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Envia alertas por email quando produtos atingirem o estoque mínimo.
                    </p>
                  </div>
                  <Switch
                    checked={notificarEstoque}
                    onCheckedChange={setNotificarEstoque}
                  />
                </div>
              </div>
            </FormSection>

            <div className="flex justify-end">
              <Button>Salvar alterações</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
