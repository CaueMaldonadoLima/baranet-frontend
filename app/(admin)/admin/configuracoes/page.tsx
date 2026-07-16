"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { FormSection } from "@/components/shared/form-section";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shared/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function ConfiguracoesPage() {
  const [loadingGeral, setLoadingGeral] = useState(false);
  const [loadingNotif, setLoadingNotif] = useState(false);

  const [emailCadastro, setEmailCadastro] = useState(true);
  const [emailInadimplencia, setEmailInadimplencia] = useState(true);
  const [emailTrial, setEmailTrial] = useState(true);
  const [relatorioSemanal, setRelatorioSemanal] = useState(false);

  function saveGeral() {
    setLoadingGeral(true);
    setTimeout(() => setLoadingGeral(false), 1200);
  }

  function saveNotif() {
    setLoadingNotif(true);
    setTimeout(() => setLoadingNotif(false), 1200);
  }

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Configurações" },
        ]}
      />

      <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>

      <Tabs defaultValue="geral">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <div className="max-w-xl space-y-8">
            <FormSection
              title="Configurações da plataforma"
              description="Parâmetros globais do sistema Baranet."
            >
              <div className="grid gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Nome da plataforma</label>
                  <Input defaultValue="Baranet" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">E-mail de suporte</label>
                  <Input type="email" defaultValue="suporte@baranet.com.br" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">URL base</label>
                  <Input defaultValue="https://app.baranet.com.br" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Período de trial padrão (dias)</label>
                  <Input type="number" defaultValue="14" className="max-w-32" />
                </div>
              </div>
            </FormSection>

            <div className="flex justify-end">
              <Button onClick={saveGeral} disabled={loadingGeral}>
                {loadingGeral ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notificacoes">
          <div className="max-w-xl space-y-8">
            <FormSection
              title="Notificações por e-mail"
              description="Configure quais eventos disparam e-mails automáticos."
            >
              <div className="grid gap-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Nova ótica cadastrada</p>
                    <p className="text-xs text-muted-foreground">
                      Envia e-mail ao cadastrar uma nova ótica no sistema.
                    </p>
                  </div>
                  <Switch
                    checked={emailCadastro}
                    onCheckedChange={setEmailCadastro}
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Inadimplência detectada</p>
                    <p className="text-xs text-muted-foreground">
                      Envia e-mail quando uma fatura ultrapassa o prazo de vencimento.
                    </p>
                  </div>
                  <Switch
                    checked={emailInadimplencia}
                    onCheckedChange={setEmailInadimplencia}
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Trial expirando em breve</p>
                    <p className="text-xs text-muted-foreground">
                      Alerta 3 dias antes do trial de uma ótica expirar.
                    </p>
                  </div>
                  <Switch
                    checked={emailTrial}
                    onCheckedChange={setEmailTrial}
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Relatório semanal</p>
                    <p className="text-xs text-muted-foreground">
                      Resumo semanal de MRR, novas óticas e inadimplência.
                    </p>
                  </div>
                  <Switch
                    checked={relatorioSemanal}
                    onCheckedChange={setRelatorioSemanal}
                  />
                </div>
              </div>
            </FormSection>

            <div className="flex justify-end">
              <Button onClick={saveNotif} disabled={loadingNotif}>
                {loadingNotif ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
