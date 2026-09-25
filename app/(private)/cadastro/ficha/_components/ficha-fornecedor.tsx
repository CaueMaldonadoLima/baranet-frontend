"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Settings, Wallet } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/tabs";
import { useToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { suppliersService } from "@/services/erp";
import { mensagemDeErro, type Supplier } from "@/services/types";
import { AbaFiscal } from "./aba-fiscal";
import { MarcasFornecedor } from "./marcas-fornecedor";
import { TabelaRegistros } from "./tabela-registros";

// Pedidos do fornecedor (tela 10); Em/Fora de garantia usam a mesma tabela (tela 11).
const COLUNAS_PEDIDOS = [
  { key: "previstoEntrega", label: "Previsto de entrega" },
  { key: "dataEntrega", label: "Data de entrega" },
  { key: "loja", label: "Loja" },
  { key: "tipo", label: "Tipo" },
  { key: "numeroPedido", label: "Nº pedido" },
  { key: "data", label: "Data" },
  { key: "codigoFornecedor", label: "Código fornecedor" },
  { key: "fornecedor", label: "Fornecedor" },
  { key: "valorTotal", label: "Valor total" },
  { key: "valorRecebido", label: "Valor recebido" },
  { key: "saldo", label: "Saldo" },
  { key: "vendedor", label: "Vendedor" },
  { key: "comprador", label: "Comprador" },
] as const;

// Parcelas do fornecedor (telas 12 e 13).
const COLUNAS_FINANCEIRO = [
  { key: "loja", label: "Loja" },
  { key: "nf", label: "NF" },
  { key: "nome", label: "Nome" },
  { key: "emissao", label: "Emissão" },
  { key: "parcelas", label: "Parcelas" },
  { key: "vencimento", label: "Vencimento" },
  { key: "valorParcela", label: "Valor parcela" },
  { key: "formaPagamento", label: "Forma de pagamento" },
  { key: "vendedor", label: "Vendedor" },
  { key: "duplicata", label: "Duplicata" },
] as const;

const SITUACOES_PEDIDOS = [
  { value: "pendentes", label: "Pendentes" },
  { value: "finalizadas", label: "Finalizadas" },
] as const;

// A pagar/Pagos/Créditos para loja renegociam parcelas (tela 12); valores a
// receber do fornecedor viram crédito em novas compras (tela 13).
const SITUACOES_FINANCEIRO = [
  { value: "a-pagar", label: "A pagar", acao: "renegociar" },
  { value: "pagos", label: "Pagos", acao: "renegociar" },
  { value: "creditos-loja", label: "Créditos para loja", acao: "renegociar" },
  { value: "a-receber", label: "A receber", acao: "creditos" },
  { value: "recebidos", label: "Recebidos", acao: "creditos" },
] as const;

const GARANTIAS = [
  { value: "em-garantia", label: "Em garantia" },
  { value: "fora-garantia", label: "Fora de garantia" },
] as const;

type EstadoFornecedor =
  | { status: "carregando" }
  | { status: "erro"; mensagem: string }
  | { status: "ok"; fornecedor: Supplier };

function FinanceiroFornecedor({ nome }: { nome: string }) {
  const toast = useToast();

  return (
    <TabelaRegistros
      id="financeiro-fornecedor"
      colunas={COLUNAS_FINANCEIRO}
      situacoes={SITUACOES_FINANCEIRO}
      descricaoVazia={`A API ainda não expõe o financeiro de ${nome}.`}
      rodape={({ situacao }) => {
        const acao = SITUACOES_FINANCEIRO.find((s) => s.value === situacao?.value)?.acao;
        return acao === "renegociar" ? (
          <Button size="sm" onClick={() => toast.warning("Selecione ao menos uma parcela para renegociar.")}>
            <RefreshCw className="size-3.5" />
            Renegociar parcelas selecionadas
          </Button>
        ) : (
          <Button size="sm" onClick={() => toast.warning("Selecione ao menos um crédito para utilizar.")}>
            <Wallet className="size-3.5" />
            Utilizar créditos selecionados
          </Button>
        );
      }}
    />
  );
}

// Ficha do fornecedor (tela 09): a tabela base (código do papel e status) é o
// ponto de entrada; as sub-abas (telas 10 a 16) aparecem com o fornecedor
// carregado. Montado com key={supplierId}: trocar de pessoa remonta e recarrega.
export function FichaFornecedor({ supplierId }: { supplierId: number }) {
  const [estado, setEstado] = useState<EstadoFornecedor>({ status: "carregando" });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    suppliersService
      .get(supplierId)
      .then((fornecedor) => {
        if (ativo) setEstado({ status: "ok", fornecedor });
      })
      .catch((err) => {
        if (ativo) setEstado({ status: "erro", mensagem: mensagemDeErro(err) });
      });
    return () => {
      ativo = false;
    };
  }, [supplierId, tentativa]);

  const columns: Column<Supplier>[] = [
    {
      header: "",
      className: "w-12",
      cell: (row) => (
        <Button size="xs" variant="ghost" asChild>
          <Link href={`/cadastro?tipo=fornecedor&id=${row.id}`} aria-label="Editar cadastro do fornecedor" title="Editar cadastro">
            <Settings className="size-3.5" />
          </Link>
        </Button>
      ),
    },
    { header: "Código fornecedor", accessor: "id", className: "w-40" },
    {
      header: "Status",
      cell: (row) =>
        row.status ? (
          <Badge variant={row.status === "ativo" ? "success" : "muted"}>
            {row.status === "ativo" ? "Ativo" : "Inativo"}
          </Badge>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {estado.status === "erro" ? (
        <EmptyState
          icon={AlertCircle}
          title="Não foi possível carregar o fornecedor"
          description={estado.mensagem}
          action={{
            label: "Tentar novamente",
            onClick: () => {
              setEstado({ status: "carregando" });
              setTentativa((t) => t + 1);
            },
          }}
          className="rounded-lg border border-border py-12"
        />
      ) : (
        <DataTable
          data={estado.status === "ok" ? [estado.fornecedor] : []}
          columns={columns}
          keyExtractor={(row) => row.id}
          isLoading={estado.status === "carregando"}
        />
      )}

      {estado.status === "ok" && (
        <Tabs defaultValue="pedidos">
          <TabsList className="w-fit flex-wrap">
            <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
            {GARANTIAS.map((g) => (
              <TabsTrigger key={g.value} value={g.value}>
                {g.label}
              </TabsTrigger>
            ))}
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
            <TabsTrigger value="marcas">Marcas</TabsTrigger>
          </TabsList>
          <TabsContent value="pedidos">
            <TabelaRegistros
              id="pedidos-fornecedor"
              colunas={COLUNAS_PEDIDOS}
              comAno
              situacoes={SITUACOES_PEDIDOS}
              tituloVazio={({ ano, situacao }) =>
                `Nenhum pedido ${situacao?.value === "pendentes" ? "pendente" : "finalizado"} em ${ano}`
              }
              descricaoVazia={`A API ainda não expõe os pedidos de ${estado.fornecedor.name}.`}
            />
          </TabsContent>
          {GARANTIAS.map((g) => (
            <TabsContent key={g.value} value={g.value}>
              <TabelaRegistros
                id={`${g.value}-fornecedor`}
                colunas={COLUNAS_PEDIDOS}
                comAno
                tituloVazio={({ ano }) => `Nenhum pedido ${g.label.toLowerCase()} em ${ano}`}
                descricaoVazia={`A API ainda não expõe os pedidos de ${estado.fornecedor.name} por garantia.`}
              />
            </TabsContent>
          ))}
          <TabsContent value="financeiro">
            <FinanceiroFornecedor nome={estado.fornecedor.name} />
          </TabsContent>
          <TabsContent value="fiscal">
            <AbaFiscal nome={estado.fornecedor.name} />
          </TabsContent>
          <TabsContent value="marcas">
            <MarcasFornecedor supplierId={supplierId} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
