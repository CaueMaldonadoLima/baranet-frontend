"use client";

import { useState } from "react";
import { FileText, ListChecks, Plus, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/tabs";
import { useToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import type { Person } from "@/services/types";
import { AbaFiscal } from "./aba-fiscal";
import { PopupFinanceiro } from "./popup-financeiro";
import { PopupNfe } from "./popup-nfe";
import { TabelaRegistros } from "./tabela-registros";

// Colunas da tabela de OS do cliente (tela 05), na ordem do protótipo XD.
const COLUNAS_OS = [
  { key: "previsaoEntrega", label: "Previsão de entrega" },
  { key: "dataEntrega", label: "Data de entrega" },
  { key: "loja", label: "Loja" },
  { key: "tipo", label: "Tipo" },
  { key: "os", label: "OS" },
  { key: "data", label: "Data" },
  { key: "codigoCliente", label: "Código cliente" },
  { key: "cliente", label: "Cliente" },
  { key: "valorBruto", label: "Valor bruto" },
  { key: "valorPago", label: "Valor pago" },
  { key: "saldo", label: "Saldo da OS" },
  { key: "vendedor", label: "Vendedor" },
] as const;

// Parcelas do cliente (telas 06 e 07).
const COLUNAS_FINANCEIRO = [
  { key: "loja", label: "Loja" },
  { key: "os", label: "OS" },
  { key: "numero", label: "Nº" },
  { key: "nome", label: "Nome" },
  { key: "emissao", label: "Emissão" },
  { key: "parcelas", label: "Parcelas" },
  { key: "vencimento", label: "Vencimento" },
  { key: "valorParcela", label: "Valor parcela" },
  { key: "formaPagamento", label: "Forma de pagamento" },
  { key: "vendedor", label: "Vendedor" },
  { key: "duplicata", label: "Duplicata" },
] as const;

const SITUACOES_OS = [
  { value: "pendentes", label: "Pendentes" },
  { value: "finalizadas", label: "Finalizadas" },
] as const;

const SITUACOES_FINANCEIRO = [
  { value: "a-receber", label: "A receber" },
  { value: "recebidos", label: "Recebidos" },
  { value: "creditos", label: "Créditos" },
] as const;

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function OrdensServicoCliente({ cliente }: { cliente: Person }) {
  const toast = useToast();

  return (
    <TabelaRegistros
      id="os"
      colunas={COLUNAS_OS}
      comAno
      situacoes={SITUACOES_OS}
      tituloVazio={({ ano, situacao }) =>
        `Nenhuma OS ${situacao?.value === "pendentes" ? "pendente" : "finalizada"} em ${ano}`
      }
      descricaoVazia={`A API ainda não expõe as ordens de serviço de ${cliente.name}.`}
      rodape={() => (
        <>
          <span className="font-medium">Total</span>
          <span>Bruto {formatBRL(0)}</span>
          <span>Pago {formatBRL(0)}</span>
          <span>Saldo {formatBRL(0)}</span>
          <Button
            size="sm"
            onClick={() =>
              toast.info(
                "Inclusão de OS ainda não disponível",
                "A API ainda não expõe um endpoint de ordens de serviço."
              )
            }
          >
            <Plus className="size-3.5" />
            Incluir OS
          </Button>
        </>
      )}
    />
  );
}

function FinanceiroCliente({ cliente }: { cliente: Person }) {
  const toast = useToast();
  const [detalhesAberto, setDetalhesAberto] = useState(false);
  const [nfeAberto, setNfeAberto] = useState(false);

  return (
    <>
      <TabelaRegistros
        id="financeiro-cliente"
        colunas={COLUNAS_FINANCEIRO}
        situacoes={SITUACOES_FINANCEIRO}
        descricaoVazia={`A API ainda não expõe as parcelas de ${cliente.name}.`}
        rodape={({ situacao }) => (
          <>
            <Button size="sm" variant="outline" onClick={() => setDetalhesAberto(true)}>
              <ListChecks className="size-3.5" />
              Ver registros
            </Button>
            <Button size="sm" variant="outline" onClick={() => setNfeAberto(true)}>
              <FileText className="size-3.5" />
              Emissão de NF-e
            </Button>
            {situacao?.value === "a-receber" && (
              <Button
                size="sm"
                onClick={() => toast.warning("Selecione ao menos uma parcela para renegociar.")}
              >
                <RefreshCw className="size-3.5" />
                Renegociar parcelas selecionadas
              </Button>
            )}
          </>
        )}
      />
      {detalhesAberto && <PopupFinanceiro open onOpenChange={setDetalhesAberto} nome={cliente.name} />}
      {nfeAberto && <PopupNfe open onOpenChange={setNfeAberto} origem="financeiro" />}
    </>
  );
}

export function FichaCliente({ cliente }: { cliente: Person }) {
  return (
    <Tabs defaultValue="os">
      <TabsList className="w-fit flex-wrap">
        <TabsTrigger value="os">OS</TabsTrigger>
        <TabsTrigger value="produtos">Produtos adquiridos</TabsTrigger>
        <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
      </TabsList>
      <TabsContent value="os">
        <OrdensServicoCliente cliente={cliente} />
      </TabsContent>
      <TabsContent value="produtos">
        <EmptyState
          title="Em construção"
          description="Esta parte da ficha do cliente ainda não foi implementada."
          className="rounded-lg border border-border py-12"
        />
      </TabsContent>
      <TabsContent value="financeiro">
        <FinanceiroCliente cliente={cliente} />
      </TabsContent>
      <TabsContent value="fiscal">
        <AbaFiscal nome={cliente.name} />
      </TabsContent>
    </Tabs>
  );
}
