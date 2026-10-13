"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Pencil, Plus, Search } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brandsService } from "@/services/erp";
import { mensagemDeErro, type Brand } from "@/services/types";

const POR_PAGINA = 15;

type Resultado =
  | { status: "carregando" }
  | { status: "erro"; mensagem: string }
  | { status: "ok"; marcas: Brand[]; totalPaginas: number };

// Lista de marcas (GET /brands). Não existe no XD: dá acesso às marcas fora
// da ficha do fornecedor. Incluir abre a tela 17; cada marca abre o mesmo
// formulário para alterar.
export default function MarcasPage() {
  const [termo, setTermo] = useState("");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [resultado, setResultado] = useState<Resultado>({ status: "carregando" });
  const [tentativa, setTentativa] = useState(0);
  const ultimaBuscaId = useRef(0);

  useEffect(() => {
    const controle = ultimaBuscaId;
    const buscaId = ++controle.current;
    brandsService
      .list({ search: busca || undefined, page: pagina, per_page: POR_PAGINA })
      .then((res) => {
        if (buscaId === controle.current)
          setResultado({ status: "ok", marcas: res.data, totalPaginas: res.meta.last_page });
      })
      .catch((err) => {
        if (buscaId === controle.current) setResultado({ status: "erro", mensagem: mensagemDeErro(err) });
      });
    return () => {
      controle.current++;
    };
  }, [busca, pagina, tentativa]);

  function handleBuscar(e: FormEvent) {
    e.preventDefault();
    setResultado({ status: "carregando" });
    setPagina(1);
    setBusca(termo.trim());
  }

  function irPara(p: number) {
    setResultado({ status: "carregando" });
    setPagina(p);
  }

  const columns: Column<Brand>[] = [
    {
      header: "Marca",
      cell: (row) => (
        <Link href={`/cadastro/marcas/${row.id}`} className="font-medium hover:underline">
          {row.name}
        </Link>
      ),
    },
    { header: "Código", cell: (row) => row.code || "—" },
    { header: "Origem", cell: (row) => row.origin || "—" },
    {
      header: "Segmentos",
      cell: (row) => (row.segments?.length ? row.segments.map((s) => s.name).join(", ") : "—"),
    },
    {
      header: "Representantes",
      cell: (row) =>
        row.representatives?.length ? row.representatives.map((r) => r.name).join(", ") : "—",
    },
    {
      header: "Status",
      cell: (row) => (
        <Badge variant={row.active ? "success" : "muted"}>{row.active ? "Ativa" : "Inativa"}</Badge>
      ),
    },
    {
      header: "",
      className: "w-12 text-right",
      cell: (row) => (
        <Button size="xs" variant="ghost" asChild>
          <Link href={`/cadastro/marcas/${row.id}`} aria-label={`Alterar ${row.name}`}>
            <Pencil className="size-3.5" />
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Cadastro
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Marcas</h1>
        </div>
        <Button size="sm" asChild>
          <Link href="/cadastro/marcas/nova">
            <Plus className="size-3.5" />
            Incluir nova
          </Link>
        </Button>
      </div>

      <Card className="px-6 space-y-4">
        <form onSubmit={handleBuscar} className="flex max-w-md items-end gap-2">
          <div className="flex-1 space-y-1.5">
            <label htmlFor="marca-busca" className="text-sm font-medium">Buscar marca</label>
            <Input
              id="marca-busca"
              placeholder="Nome ou código"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" variant="outline">
            <Search className="size-3.5" />
            Buscar
          </Button>
        </form>

        {resultado.status === "erro" ? (
          <EmptyState
            icon={AlertCircle}
            title="Não foi possível carregar as marcas"
            description={resultado.mensagem}
            action={{
              label: "Tentar novamente",
              onClick: () => {
                setResultado({ status: "carregando" });
                setTentativa((t) => t + 1);
              },
            }}
            className="rounded-lg border border-border py-12"
          />
        ) : (
          <>
            <DataTable
              data={resultado.status === "ok" ? resultado.marcas : []}
              columns={columns}
              keyExtractor={(row) => row.id}
              isLoading={resultado.status === "carregando"}
              emptyTitle={busca ? "Nenhuma marca encontrada" : "Nenhuma marca cadastrada"}
              emptyDescription={busca ? "Tente outro termo de busca." : "Inclua a primeira marca."}
            />
            {resultado.status === "ok" && resultado.totalPaginas > 1 && (
              <Pagination currentPage={pagina} totalPages={resultado.totalPaginas} onPageChange={irPara} />
            )}
          </>
        )}
      </Card>
    </div>
  );
}
