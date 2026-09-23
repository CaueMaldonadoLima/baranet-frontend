"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, Columns3, List, Plus, Save, Search } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/tabs";
import { useToast } from "@/components/shared/toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { customersService, suppliersService } from "@/services/erp";
import { ApiRequestError } from "@/services/types";

// Abas da ficha. Só Cliente e Fornecedor têm endpoint de busca hoje; as
// demais aparecem no protótipo XD (tela 03/18) mas a API ainda não as expõe.
// Cada aba busca no seu próprio recurso: a unificação por Pessoa (mesmo
// CPF/CNPJ em várias abas) não é simulada no cliente — ver ADR 0001.
const ABAS = [
  { value: "cliente", label: "Cliente", temBusca: true },
  { value: "fornecedor", label: "Fornecedor", temBusca: true },
  { value: "usuario", label: "Usuário", temBusca: false },
  { value: "financeiro", label: "Financeiro", temBusca: false },
  { value: "medico", label: "Médico / Optometrista", temBusca: false },
  { value: "convenio", label: "Convênio", temBusca: false },
] as const;

const SEM_ENDPOINT = "A API ainda não expõe um endpoint para esta aba.";

type Aba = (typeof ABAS)[number]["value"];

// Tipos de cadastro que a tela /cadastro já sabe abrir via ?tipo=.
const TIPO_CADASTRO_POR_ABA: Partial<Record<Aba, string>> = {
  cliente: "cliente",
  fornecedor: "fornecedor",
};

interface Resultado {
  id: number;
  nome: string;
  documento: string;
  whatsapp: string;
}

const CAMPOS_BUSCA = [
  { key: "nome", label: "Nome / Código", placeholder: "Nome ou código" },
  { key: "documento", label: "CPF / CNPJ", placeholder: "000.000.000-00" },
  { key: "whatsapp", label: "Whatsapp", placeholder: "(00) 00000-0000" },
] as const;

type CampoBusca = (typeof CAMPOS_BUSCA)[number]["key"];

// Colunas da tabela de OS do cliente, na ordem do protótipo XD.
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

type ColunaOs = (typeof COLUNAS_OS)[number]["key"];
type OrdemServico = Record<ColunaOs, string>;

const COLUNAS_OS_STORAGE_KEY = "baranet:ficha:colunas-os";
const TODAS_COLUNAS_OS: ColunaOs[] = COLUNAS_OS.map((c) => c.key);

const ANO_ATUAL = new Date().getFullYear();
const ANOS = Array.from({ length: 5 }, (_, i) => String(ANO_ATUAL - i));

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

async function buscarCadastros(
  aba: Aba,
  search: string,
  page: number
): Promise<{ resultados: Resultado[]; totalPages: number }> {
  if (aba === "cliente") {
    const res = await customersService.list({ search, page });
    return {
      resultados: res.data.map((c) => ({
        id: c.id,
        nome: c.name,
        documento: c.cpf,
        whatsapp: c.phone,
      })),
      totalPages: res.meta?.last_page ?? 1,
    };
  }
  const res = await suppliersService.list({ search, page });
  return {
    resultados: res.data.map((s) => ({
      id: s.id,
      nome: s.name,
      documento: s.cnpj,
      whatsapp: s.phone,
    })),
    totalPages: res.meta?.last_page ?? 1,
  };
}

function lerColunasSalvas(): ColunaOs[] | null {
  try {
    const raw = localStorage.getItem(COLUNAS_OS_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return TODAS_COLUNAS_OS.filter((key) => parsed.includes(key));
  } catch {
    return null;
  }
}

function OrdensServicoCliente({ cliente }: { cliente: Resultado }) {
  const toast = useToast();
  const [ano, setAno] = useState(String(ANO_ATUAL));
  const [situacao, setSituacao] = useState<"pendentes" | "finalizadas">("pendentes");
  // Só monta depois que o usuário seleciona um cliente, nunca no SSR — então
  // ler o localStorage no inicializador não diverge do HTML do servidor.
  const [colunasVisiveis, setColunasVisiveis] = useState<ColunaOs[]>(
    () => lerColunasSalvas() ?? TODAS_COLUNAS_OS
  );
  const [seletorAberto, setSeletorAberto] = useState(false);

  function toggleColuna(key: ColunaOs, visivel: boolean) {
    setColunasVisiveis((prev) =>
      visivel
        ? TODAS_COLUNAS_OS.filter((k) => k === key || prev.includes(k))
        : prev.filter((k) => k !== key)
    );
  }

  function salvarColunas() {
    try {
      localStorage.setItem(COLUNAS_OS_STORAGE_KEY, JSON.stringify(colunasVisiveis));
      toast.success("Colunas salvas.", "A seleção vale para este navegador.");
    } catch {
      toast.warning("Não foi possível salvar as colunas neste navegador.");
    }
  }

  const columns: Column<OrdemServico>[] = COLUNAS_OS.filter((c) =>
    colunasVisiveis.includes(c.key)
  ).map((c) => ({ header: c.label, accessor: c.key }));

  // A API ainda não expõe ordens de serviço por cliente: a tabela fica vazia
  // até existir o endpoint (ano/situação já ficam prontos para virar filtro).
  const ordens: OrdemServico[] = [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <label htmlFor="os-ano" className="text-sm font-medium">Ano</label>
            <Select value={ano} onValueChange={setAno}>
              <SelectTrigger id="os-ano" className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ANOS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Tabs
            defaultValue="pendentes"
            value={situacao}
            onValueChange={(v) => setSituacao(v as typeof situacao)}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
              <TabsTrigger value="finalizadas">Finalizadas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="relative flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSeletorAberto((open) => !open)}
            aria-expanded={seletorAberto}
          >
            <Columns3 className="size-3.5" />
            Selecionar colunas
          </Button>
          <Button size="sm" variant="ghost" onClick={salvarColunas} aria-label="Salvar colunas">
            <Save className="size-3.5" />
          </Button>
          {seletorAberto && (
            <div className="absolute right-0 top-full z-10 mt-1 w-56 space-y-2 rounded-lg border border-border bg-card p-3 shadow-md">
              {COLUNAS_OS.map((c) => (
                <label key={c.key} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={colunasVisiveis.includes(c.key)}
                    onCheckedChange={(checked) => toggleColuna(c.key, checked === true)}
                  />
                  {c.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {columns.length > 0 ? (
        <DataTable
          data={ordens}
          columns={columns}
          keyExtractor={(row) => row.os}
          emptyTitle={`Nenhuma OS ${situacao === "pendentes" ? "pendente" : "finalizada"} em ${ano}`}
          emptyDescription={`A API ainda não expõe as ordens de serviço de ${cliente.nome}.`}
        />
      ) : (
        <EmptyState
          title="Nenhuma coluna selecionada"
          description="Use “Selecionar colunas” para escolher o que exibir."
          className="rounded-lg border border-border py-12"
        />
      )}

      <div className="flex flex-wrap items-center justify-end gap-4 text-sm">
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
      </div>
    </div>
  );
}

function FichaCliente({ cliente }: { cliente: Resultado }) {
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
      {(["produtos", "financeiro", "fiscal"] as const).map((value) => (
        <TabsContent key={value} value={value}>
          <EmptyState
            title="Em construção"
            description="Esta parte da ficha do cliente ainda não foi implementada."
            className="rounded-lg border border-border py-12"
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default function FichaCadastroPage() {
  const toast = useToast();

  const [aba, setAba] = useState<Aba>("cliente");
  const [campos, setCampos] = useState<Record<CampoBusca, string>>({
    nome: "",
    documento: "",
    whatsapp: "",
  });
  const [os, setOs] = useState("");
  const [nf, setNf] = useState("");

  const [termoBuscado, setTermoBuscado] = useState<string | null>(null);
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erroBusca, setErroBusca] = useState<string | null>(null);
  const [mostrarResultados, setMostrarResultados] = useState(true);
  const [selecionado, setSelecionado] = useState<Resultado | null>(null);

  const abaAtual = ABAS.find((a) => a.value === aba)!;
  const tipoCadastro = TIPO_CADASTRO_POR_ABA[aba];

  async function executarBusca(termo: string, pagina: number) {
    setLoading(true);
    setErroBusca(null);
    setTermoBuscado(termo);
    setMostrarResultados(true);
    try {
      const res = await buscarCadastros(aba, termo, pagina);
      setResultados(res.resultados);
      setTotalPages(res.totalPages);
      setPage(pagina);
    } catch (err) {
      setResultados([]);
      setTotalPages(1);
      setErroBusca(
        err instanceof ApiRequestError
          ? err.message
          : "Verifique sua conexão e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleBuscar(campo: CampoBusca) {
    const termo = campos[campo].trim();
    if (!termo) {
      toast.warning("Digite algo para buscar.");
      return;
    }
    if (!abaAtual.temBusca) {
      toast.info(
        `Busca de ${abaAtual.label.toLowerCase()} ainda não disponível`,
        SEM_ENDPOINT
      );
      return;
    }
    executarBusca(termo, 1);
  }

  function handleBuscarDocumentoFiscal(tipo: "OS" | "NF", valor: string) {
    if (!valor.trim()) {
      toast.warning("Digite algo para buscar.");
      return;
    }
    toast.info(
      `Busca por ${tipo} ainda não disponível`,
      `A API ainda não permite localizar um cadastro pelo número da ${tipo}.`
    );
  }

  // Trocar de aba troca o recurso buscado; como Cliente e Fornecedor não são
  // a mesma Pessoa no backend (ADR 0001), a seleção não é levada junto.
  function handleTrocarAba(value: string) {
    setAba(value as Aba);
    setResultados([]);
    setTermoBuscado(null);
    setErroBusca(null);
    setSelecionado(null);
    setPage(1);
    setTotalPages(1);
  }

  function handleSelecionar(row: Resultado) {
    setSelecionado(row);
    setMostrarResultados(false);
  }

  const colunasResultado: Column<Resultado>[] = [
    { header: "Código", accessor: "id", className: "w-24" },
    { header: "Nome", accessor: "nome" },
    { header: "CPF / CNPJ", cell: (row) => row.documento || "—" },
    { header: "Whatsapp", cell: (row) => row.whatsapp || "—" },
    {
      header: "",
      className: "w-28 text-right",
      cell: (row) => (
        <Button size="xs" variant="outline" onClick={() => handleSelecionar(row)}>
          Selecionar
        </Button>
      ),
    },
  ];

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "ERP", href: "/" },
          { label: "Cadastro", href: "/cadastro" },
          { label: "Ficha" },
        ]}
      />

      <h1 className="text-2xl font-bold tracking-tight">Cadastro (pessoa física e jurídica)</h1>

      <Card className="px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAMPOS_BUSCA.map((campo) => (
            <form
              key={campo.key}
              className="space-y-1.5"
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                handleBuscar(campo.key);
              }}
            >
              <label htmlFor={`busca-${campo.key}`} className="text-sm font-medium">
                {campo.label}
              </label>
              <div className="relative">
                <Input
                  id={`busca-${campo.key}`}
                  placeholder={campo.placeholder}
                  value={campos[campo.key]}
                  onChange={(e) => setCampos((prev) => ({ ...prev, [campo.key]: e.target.value }))}
                  className="pr-9"
                />
                <button
                  type="submit"
                  disabled={loading}
                  aria-label={`Buscar por ${campo.label}`}
                  className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  <Search className="size-4" />
                </button>
              </div>
            </form>
          ))}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            {(
              [
                { tipo: "OS", value: os, setValue: setOs },
                { tipo: "NF", value: nf, setValue: setNf },
              ] as const
            ).map(({ tipo, value, setValue }) => (
              <form
                key={tipo}
                className="w-40 space-y-1.5"
                onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                  handleBuscarDocumentoFiscal(tipo, value);
                }}
              >
                <label htmlFor={`busca-${tipo}`} className="text-sm font-medium">
                  {tipo}
                </label>
                <Input
                  id={`busca-${tipo}`}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </form>
            ))}
          </div>

          {tipoCadastro ? (
            <Button size="sm" asChild>
              <Link href={`/cadastro?tipo=${tipoCadastro}`}>
                <Plus className="size-3.5" />
                Incluir novo
              </Link>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() =>
                toast.info(
                  `Cadastro de ${abaAtual.label.toLowerCase()} ainda não disponível`,
                  SEM_ENDPOINT
                )
              }
            >
              <Plus className="size-3.5" />
              Incluir novo
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-end gap-4 border-t border-border pt-6">
          <Button
            size="sm"
            variant="ghost"
            aria-label="Mostrar resultados da busca"
            aria-pressed={mostrarResultados}
            disabled={termoBuscado === null}
            onClick={() => setMostrarResultados((v) => !v)}
          >
            <List className="size-4" />
          </Button>
          <div className="w-28 space-y-1.5">
            <label htmlFor="selecionado-codigo" className="text-sm font-medium">Código</label>
            <Input id="selecionado-codigo" value={selecionado ? String(selecionado.id) : ""} readOnly placeholder="—" />
          </div>
          <div className="min-w-48 flex-1 space-y-1.5">
            <label htmlFor="selecionado-nome" className="text-sm font-medium">Nome</label>
            <Input id="selecionado-nome" value={selecionado?.nome ?? ""} readOnly placeholder="Nenhum cadastro selecionado" />
          </div>
          <div className="w-52 space-y-1.5">
            <label htmlFor="selecionado-documento" className="text-sm font-medium">CPF / CNPJ</label>
            <Input id="selecionado-documento" value={selecionado?.documento ?? ""} readOnly placeholder="—" />
          </div>
        </div>

        {termoBuscado !== null && mostrarResultados && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Resultados em {abaAtual.label.toLowerCase()} para “{termoBuscado}”
            </p>
            {erroBusca ? (
              <EmptyState
                icon={AlertCircle}
                title="Não foi possível buscar"
                description={erroBusca}
                action={{ label: "Tentar novamente", onClick: () => executarBusca(termoBuscado, page) }}
                className="rounded-lg border border-border py-12"
              />
            ) : (
              <DataTable
                data={resultados}
                columns={colunasResultado}
                keyExtractor={(row) => row.id}
                isLoading={loading}
                emptyTitle="Nenhum cadastro encontrado"
                emptyDescription="Tente outro termo ou use “Incluir novo”."
              />
            )}
            {!erroBusca && totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => executarBusca(termoBuscado, p)}
              />
            )}
          </div>
        )}
      </Card>

      <Tabs defaultValue="cliente" value={aba} onValueChange={handleTrocarAba}>
        <TabsList className="w-full flex-wrap justify-start">
          {ABAS.map((a) => (
            <TabsTrigger key={a.value} value={a.value} className="uppercase">
              {a.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {ABAS.map((a) => (
          <TabsContent key={a.value} value={a.value}>
            <Card className="px-6">
              {!a.temBusca ? (
                <EmptyState
                  title={`${a.label} ainda não disponível`}
                  description={SEM_ENDPOINT}
                />
              ) : !selecionado ? (
                <EmptyState
                  icon={Search}
                  title={`Nenhum ${a.label.toLowerCase()} selecionado`}
                  description="Busque pelo nome, código, CPF/CNPJ ou Whatsapp e selecione um resultado."
                />
              ) : a.value === "cliente" ? (
                <FichaCliente cliente={selecionado} />
              ) : (
                <EmptyState
                  title="Em construção"
                  description="Os detalhes da ficha do fornecedor ainda não foram implementados."
                />
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
