"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, List, Plus, Search } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/tabs";
import { useToast } from "@/components/shared/toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/shared/badge";
import { peopleService } from "@/services/erp";
import { mensagemDeErro, type Person, type PersonRole } from "@/services/types";
import { FichaCliente } from "./_components/ficha-cliente";
import { FichaFornecedor } from "./_components/ficha-fornecedor";
import { AbaFinanceiro } from "./_components/popup-financeiro";

// Abas da ficha. Cada uma é um papel sobre a mesma Pessoa (GET /people?role=)
// — ver ADR 0002. Financeiro não é papel: na API é visão operacional de
// saldos, então a aba busca em todas as pessoas.
const ABAS = [
  { value: "cliente", label: "Cliente", role: "customer", tipoCadastro: "cliente" },
  { value: "fornecedor", label: "Fornecedor", role: "supplier", tipoCadastro: "fornecedor" },
  { value: "usuario", label: "Usuário", role: "employee", tipoCadastro: null },
  { value: "financeiro", label: "Financeiro", role: null, tipoCadastro: null },
  { value: "medico", label: "Médico / Optometrista", role: "doctor", tipoCadastro: null },
  { value: "convenio", label: "Convênio", role: "agreement", tipoCadastro: null },
] as const satisfies readonly {
  value: string;
  label: string;
  role: PersonRole | null;
  /** Tipo que /cadastro já sabe abrir via ?tipo= */
  tipoCadastro: string | null;
}[];

type Aba = (typeof ABAS)[number]["value"];

const PAPEL_LABEL: Record<PersonRole, string> = {
  customer: "Cliente",
  supplier: "Fornecedor",
  employee: "Usuário",
  doctor: "Médico",
  agreement: "Convênio",
};

// Cada campo vira um filtro próprio de GET /people (a API ignora máscaras).
const CAMPOS_BUSCA = [
  { key: "name", label: "Nome / Código", placeholder: "Nome ou código" },
  { key: "document", label: "CPF / CNPJ", placeholder: "000.000.000-00" },
  { key: "whatsapp", label: "Whatsapp", placeholder: "(00) 00000-0000" },
] as const;

type CampoBusca = (typeof CAMPOS_BUSCA)[number]["key"];

interface Busca {
  campo: CampoBusca;
  termo: string;
}

export default function FichaCadastroPage() {
  const toast = useToast();

  const [aba, setAba] = useState<Aba>("cliente");
  const [campos, setCampos] = useState<Record<CampoBusca, string>>({
    name: "",
    document: "",
    whatsapp: "",
  });
  const [os, setOs] = useState("");
  const [nf, setNf] = useState("");

  const [busca, setBusca] = useState<Busca | null>(null);
  const [resultados, setResultados] = useState<Person[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erroBusca, setErroBusca] = useState<string | null>(null);
  const [mostrarResultados, setMostrarResultados] = useState(true);
  const [selecionado, setSelecionado] = useState<Person | null>(null);
  // Trocar de aba refaz a busca: só a resposta da última requisição vale.
  const ultimaBuscaId = useRef(0);

  const abaAtual = ABAS.find((a) => a.value === aba)!;

  async function executarBusca(novaBusca: Busca, pagina: number, abaBusca: Aba = aba) {
    const role = ABAS.find((a) => a.value === abaBusca)!.role ?? undefined;
    const buscaId = ++ultimaBuscaId.current;
    setLoading(true);
    setErroBusca(null);
    setBusca(novaBusca);
    setMostrarResultados(true);
    try {
      const res = await peopleService.list({
        [novaBusca.campo]: novaBusca.termo,
        role,
        page: pagina,
      });
      if (buscaId !== ultimaBuscaId.current) return;
      setResultados(res.data);
      setTotalPages(res.meta?.last_page ?? 1);
      setPage(pagina);
    } catch (err) {
      if (buscaId !== ultimaBuscaId.current) return;
      setResultados([]);
      setTotalPages(1);
      setErroBusca(mensagemDeErro(err));
    } finally {
      if (buscaId === ultimaBuscaId.current) setLoading(false);
    }
  }

  function handleBuscar(campo: CampoBusca) {
    const termo = campos[campo].trim();
    if (!termo) {
      toast.warning("Digite algo para buscar.");
      return;
    }
    executarBusca({ campo, termo }, 1);
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

  // A seleção é uma Pessoa, então vale para todas as abas; só a lista de
  // resultados é refeita com o papel da nova aba.
  function handleTrocarAba(value: string) {
    const novaAba = value as Aba;
    setAba(novaAba);
    if (busca) executarBusca(busca, 1, novaAba);
  }

  function handleSelecionar(row: Person) {
    setSelecionado(row);
    setMostrarResultados(false);
  }

  const colunasResultado: Column<Person>[] = [
    { header: "Código", accessor: "code", className: "w-24" },
    {
      header: "Nome",
      cell: (row) => (
        <div>
          <p>{row.name}</p>
          {row.tradeName && <p className="text-xs text-muted-foreground">{row.tradeName}</p>}
        </div>
      ),
    },
    { header: "CPF / CNPJ", cell: (row) => row.document || "—" },
    { header: "Whatsapp", cell: (row) => row.whatsapp || "—" },
    {
      header: "Papéis",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.roles.map((role) => (
            <Badge key={role} variant="muted">
              {PAPEL_LABEL[role]}
            </Badge>
          ))}
        </div>
      ),
    },
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

  const campoBuscado = busca && CAMPOS_BUSCA.find((c) => c.key === busca.campo)!;

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

          {abaAtual.tipoCadastro ? (
            <Button size="sm" asChild>
              <Link href={`/cadastro?tipo=${abaAtual.tipoCadastro}`}>
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
                  "O formulário deste papel ainda não foi implementado."
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
            disabled={busca === null}
            onClick={() => setMostrarResultados((v) => !v)}
          >
            <List className="size-4" />
          </Button>
          <div className="w-28 space-y-1.5">
            <label htmlFor="selecionado-codigo" className="text-sm font-medium">Código</label>
            <Input id="selecionado-codigo" value={selecionado ? String(selecionado.code) : ""} readOnly placeholder="—" />
          </div>
          <div className="min-w-48 flex-1 space-y-1.5">
            <label htmlFor="selecionado-nome" className="text-sm font-medium">Nome</label>
            <Input id="selecionado-nome" value={selecionado?.name ?? ""} readOnly placeholder="Nenhum cadastro selecionado" />
          </div>
          <div className="w-52 space-y-1.5">
            <label htmlFor="selecionado-documento" className="text-sm font-medium">CPF / CNPJ</label>
            <Input id="selecionado-documento" value={selecionado?.document ?? ""} readOnly placeholder="—" />
          </div>
        </div>

        {busca !== null && campoBuscado && mostrarResultados && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {abaAtual.role
                ? `Pessoas com papel ${abaAtual.label.toLowerCase()}`
                : "Todas as pessoas"}{" "}
              — {campoBuscado.label}: “{busca.termo}”
            </p>
            {erroBusca ? (
              <EmptyState
                icon={AlertCircle}
                title="Não foi possível buscar"
                description={erroBusca}
                action={{ label: "Tentar novamente", onClick: () => executarBusca(busca, page) }}
                className="rounded-lg border border-border py-12"
              />
            ) : (
              <DataTable
                data={resultados}
                columns={colunasResultado}
                keyExtractor={(row) => row.id}
                isLoading={loading}
                emptyTitle="Nenhum cadastro encontrado"
                emptyDescription="Tente outro termo, outra aba ou use “Incluir novo”."
              />
            )}
            {!erroBusca && totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => executarBusca(busca, p)}
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
              {!selecionado ? (
                <EmptyState
                  icon={Search}
                  title="Nenhum cadastro selecionado"
                  description="Busque pelo nome, código, CPF/CNPJ ou Whatsapp e selecione um resultado."
                />
              ) : a.role && !selecionado.roleFlags[a.role] ? (
                <EmptyState
                  title={`${selecionado.name} não tem cadastro de ${a.label.toLowerCase()}`}
                  description="Esta pessoa não possui este papel no cadastro."
                />
              ) : a.value === "cliente" ? (
                <FichaCliente cliente={selecionado} />
              ) : a.value === "fornecedor" ? (
                selecionado.supplierId !== null ? (
                  <FichaFornecedor key={selecionado.supplierId} supplierId={selecionado.supplierId} />
                ) : (
                  <EmptyState
                    icon={AlertCircle}
                    title="Cadastro de fornecedor não encontrado"
                    description="A pessoa tem o papel fornecedor, mas a API não informou o código do fornecedor."
                  />
                )
              ) : a.value === "financeiro" ? (
                <AbaFinanceiro nome={selecionado.name} />
              ) : (
                <EmptyState
                  title="Em construção"
                  description={`Os detalhes da aba ${a.label.toLowerCase()} ainda não foram implementados.`}
                />
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
