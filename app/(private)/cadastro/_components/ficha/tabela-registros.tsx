"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Columns3, Save } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/shared/tabs";
import { useToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ColunaRegistro {
  key: string;
  label: string;
}

export interface OpcaoSituacao {
  value: string;
  label: string;
}

export interface FiltrosRegistros {
  ano: string | null;
  situacao: OpcaoSituacao | null;
}

const ANO_ATUAL = new Date().getFullYear();
const ANOS = Array.from({ length: 5 }, (_, i) => String(ANO_ATUAL - i));

function storageKey(id: string) {
  return `baranet:ficha:colunas-${id}`;
}

function lerColunasSalvas(id: string, todas: string[]): string[] | null {
  try {
    const raw = localStorage.getItem(storageKey(id));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return todas.filter((key) => parsed.includes(key));
  } catch {
    return null;
  }
}

interface TabelaRegistrosProps {
  /** Identifica a tabela: ids dos campos e a chave das colunas salvas */
  id: string;
  /** Colunas na ordem do protótipo XD */
  colunas: readonly ColunaRegistro[];
  /** Filtro por ano (ex: OS, pedidos) */
  comAno?: boolean;
  /** Recortes da tabela (ex: Pendentes/Finalizadas, A receber/Recebidos) */
  situacoes?: readonly OpcaoSituacao[];
  tituloVazio?: (filtros: FiltrosRegistros) => string;
  /** Por que não há registros — hoje, qual endpoint a API ainda não expõe */
  descricaoVazia: string;
  /** Rodapé (totais, ações sobre os registros), por recorte selecionado */
  rodape?: (filtros: FiltrosRegistros) => ReactNode;
}

// Tabela de registros de uma sub-aba da ficha: filtros de ano/recorte,
// "Selecionar colunas" (salvo no navegador) e rodapé de ações. Nenhum desses
// registros (OS, pedidos, parcelas, notas) existe na API ainda, então a
// tabela fica vazia até o endpoint existir.
// Só monta depois que o usuário seleciona um cadastro, nunca no SSR — ler o
// localStorage no inicializador não diverge do HTML do servidor.
export function TabelaRegistros({
  id,
  colunas,
  comAno = false,
  situacoes,
  tituloVazio,
  descricaoVazia,
  rodape,
}: TabelaRegistrosProps) {
  const toast = useToast();
  const todas = colunas.map((c) => c.key);
  const [ano, setAno] = useState(String(ANO_ATUAL));
  const [situacao, setSituacao] = useState(situacoes?.[0]?.value ?? "");
  const [colunasVisiveis, setColunasVisiveis] = useState<string[]>(
    () => lerColunasSalvas(id, todas) ?? todas
  );
  const [seletorAberto, setSeletorAberto] = useState(false);
  const seletorRef = useRef<HTMLDivElement>(null);

  // Fecha o seletor de colunas com Esc ou clique fora dele.
  useEffect(() => {
    if (!seletorAberto) return;
    function fecharFora(e: MouseEvent) {
      if (!seletorRef.current?.contains(e.target as Node)) setSeletorAberto(false);
    }
    function fecharEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setSeletorAberto(false);
    }
    document.addEventListener("mousedown", fecharFora);
    document.addEventListener("keydown", fecharEsc);
    return () => {
      document.removeEventListener("mousedown", fecharFora);
      document.removeEventListener("keydown", fecharEsc);
    };
  }, [seletorAberto]);

  const filtros: FiltrosRegistros = {
    ano: comAno ? ano : null,
    situacao: situacoes?.find((s) => s.value === situacao) ?? null,
  };

  function toggleColuna(key: string, visivel: boolean) {
    setColunasVisiveis((prev) =>
      visivel ? todas.filter((k) => k === key || prev.includes(k)) : prev.filter((k) => k !== key)
    );
  }

  function salvarColunas() {
    try {
      localStorage.setItem(storageKey(id), JSON.stringify(colunasVisiveis));
      toast.success("Colunas salvas.", "A seleção vale para este navegador.");
    } catch {
      toast.warning("Não foi possível salvar as colunas neste navegador.");
    }
  }

  const columns: Column<Record<string, string>>[] = colunas
    .filter((c) => colunasVisiveis.includes(c.key))
    .map((c) => ({ header: c.label, accessor: c.key }));

  const registros: Record<string, string>[] = [];

  const titulo =
    tituloVazio?.(filtros) ??
    [
      "Nenhum registro",
      filtros.situacao && `(${filtros.situacao.label.toLowerCase()})`,
      filtros.ano && `em ${filtros.ano}`,
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-4">
          {comAno && (
            <div className="space-y-1.5">
              <label htmlFor={`${id}-ano`} className="text-sm font-medium">Ano</label>
              <Select value={ano} onValueChange={setAno}>
                <SelectTrigger id={`${id}-ano`} className="w-28">
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
          )}
          {situacoes && situacoes.length > 0 && (
            <Tabs
              defaultValue={situacoes[0].value}
              value={situacao}
              onValueChange={setSituacao}
              className="w-auto"
            >
              <TabsList className="flex-wrap">
                {situacoes.map((s) => (
                  <TabsTrigger key={s.value} value={s.value}>
                    {s.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>

        <div ref={seletorRef} className="relative flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSeletorAberto((open) => !open)}
            aria-expanded={seletorAberto}
            aria-controls={`${id}-colunas`}
          >
            <Columns3 className="size-3.5" />
            Selecionar colunas
          </Button>
          <Button size="sm" variant="ghost" onClick={salvarColunas} aria-label="Salvar colunas">
            <Save className="size-3.5" />
          </Button>
          {seletorAberto && (
            <div
              id={`${id}-colunas`}
              className="absolute right-0 top-full z-10 mt-1 w-56 space-y-2 rounded-lg border border-border bg-card p-3 shadow-md"
            >
              {colunas.map((c) => (
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
          data={registros}
          columns={columns}
          keyExtractor={(_, index) => index}
          emptyTitle={titulo}
          emptyDescription={descricaoVazia}
        />
      ) : (
        <EmptyState
          title="Nenhuma coluna selecionada"
          description="Use “Selecionar colunas” para escolher o que exibir."
          className="rounded-lg border border-border py-12"
        />
      )}

      {rodape && (
        <div className="flex flex-wrap items-center justify-end gap-4 text-sm">{rodape(filtros)}</div>
      )}
    </div>
  );
}
