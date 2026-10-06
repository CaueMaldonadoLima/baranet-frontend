"use client";

import { useEffect, useState } from "react";
import { Link2, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { FormSection } from "@/components/shared/form-section";
import { useToast } from "@/components/shared/toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { peopleService } from "@/services/erp";
import { mensagemDeErro, type Person } from "@/services/types";
import { Campo } from "./campo";

// Dados comerciais e vínculos do cliente (tela 02, parte de baixo). A API de
// clientes ainda não tem esses campos: ficam só na tela, avisado.

function NaoGravado({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}

type Convenios = { status: "carregando" } | { status: "erro" } | { status: "ok"; lista: Person[] };

export function ClienteDadosComerciais() {
  const [dados, setDados] = useState({
    empresa: "",
    cargo: "",
    admissao: "",
    ddd: "",
    telefone: "",
    renda: "",
    departamento1: "",
    departamento2: "",
    funcionarioLoja: false,
    convenio: "",
    limiteConvenio: "",
  });
  const set = (patch: Partial<typeof dados>) => setDados((prev) => ({ ...prev, ...patch }));

  // Convênio é um papel de Pessoa (ver CONTEXT.md).
  const [convenios, setConvenios] = useState<Convenios>({ status: "carregando" });
  useEffect(() => {
    let ativo = true;
    peopleService
      .list({ role: "agreement", per_page: 100 })
      .then((res) => {
        if (ativo) setConvenios({ status: "ok", lista: res.data });
      })
      .catch(() => {
        if (ativo) setConvenios({ status: "erro" });
      });
    return () => {
      ativo = false;
    };
  }, []);

  const placeholderConvenio =
    convenios.status === "carregando"
      ? "Carregando…"
      : convenios.status === "erro"
        ? "Não foi possível carregar"
        : convenios.lista.length === 0
          ? "Nenhum convênio cadastrado"
          : "Selecione";

  return (
    <Card className="px-6">
      <FormSection title="Dados comerciais">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Campo id="comercial-empresa" label="Nome da empresa" className="sm:col-span-2">
            <Input id="comercial-empresa" value={dados.empresa} onChange={(e) => set({ empresa: e.target.value })} />
          </Campo>
          <Campo id="comercial-cargo" label="Cargo">
            <Input id="comercial-cargo" value={dados.cargo} onChange={(e) => set({ cargo: e.target.value })} />
          </Campo>
          <Campo id="comercial-admissao" label="Admissão">
            <Input
              id="comercial-admissao"
              type="date"
              value={dados.admissao}
              onChange={(e) => set({ admissao: e.target.value })}
            />
          </Campo>
          <Campo id="comercial-ddd" label="DDD">
            <Input
              id="comercial-ddd"
              placeholder="11"
              maxLength={2}
              value={dados.ddd}
              onChange={(e) => set({ ddd: e.target.value })}
            />
          </Campo>
          <Campo id="comercial-telefone" label="Telefone">
            <Input
              id="comercial-telefone"
              placeholder="0000-0000"
              value={dados.telefone}
              onChange={(e) => set({ telefone: e.target.value })}
            />
          </Campo>
          <Campo id="comercial-renda" label="Renda (R$)">
            <Input
              id="comercial-renda"
              inputMode="decimal"
              placeholder="0,00"
              value={dados.renda}
              onChange={(e) => set({ renda: e.target.value })}
            />
          </Campo>
          <Campo id="comercial-departamento-1" label="Departamento 1" className="lg:col-span-2">
            <Input
              id="comercial-departamento-1"
              value={dados.departamento1}
              onChange={(e) => set({ departamento1: e.target.value })}
            />
          </Campo>
          <Campo id="comercial-departamento-2" label="Departamento 2" className="lg:col-span-2">
            <Input
              id="comercial-departamento-2"
              value={dados.departamento2}
              onChange={(e) => set({ departamento2: e.target.value })}
            />
          </Campo>
          <label className="flex cursor-pointer items-center gap-2.5 self-end pb-2">
            <Checkbox
              checked={dados.funcionarioLoja}
              onCheckedChange={(c) => set({ funcionarioLoja: c === true })}
            />
            <span className="text-sm text-foreground">Funcionário de loja</span>
          </label>
          <Campo id="comercial-convenio" label="Convênios" className="sm:col-span-2 lg:col-span-3">
            <Select
              value={dados.convenio}
              onValueChange={(convenio) => set({ convenio })}
              disabled={convenios.status !== "ok" || convenios.lista.length === 0}
            >
              <SelectTrigger id="comercial-convenio" className="w-full">
                <SelectValue placeholder={placeholderConvenio} />
              </SelectTrigger>
              <SelectContent>
                {convenios.status === "ok" &&
                  convenios.lista.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.tradeName || c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </Campo>
          <Campo id="comercial-limite-convenio" label="Limite para convênios (R$)" className="sm:col-span-2 lg:col-span-3">
            <Input
              id="comercial-limite-convenio"
              inputMode="decimal"
              placeholder="0,00"
              value={dados.limiteConvenio}
              onChange={(e) => set({ limiteConvenio: e.target.value })}
            />
          </Campo>
        </div>
        <NaoGravado>Os dados comerciais ainda não são gravados: a API de clientes não tem esses campos.</NaoGravado>
      </FormSection>
    </Card>
  );
}

const PARENTESCOS = [
  { value: "irmao", label: "Irmão(ã)" },
  { value: "pai", label: "Pai" },
  { value: "mae", label: "Mãe" },
  { value: "filho", label: "Filho(a)" },
  { value: "conjuge", label: "Cônjuge" },
  { value: "responsavel", label: "Responsável" },
  { value: "outro", label: "Outro" },
];

interface Vinculo {
  codigo: string;
  nome: string;
  documento: string;
  parentesco: string;
}

export function ClienteVinculos() {
  const toast = useToast();
  const vazio: Vinculo = { codigo: "", nome: "", documento: "", parentesco: "irmao" };
  const [novo, setNovo] = useState<Vinculo>(vazio);
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [buscando, setBuscando] = useState(false);

  // O código da grid é o id da Pessoa: preenche nome e documento.
  async function buscarPorCodigo() {
    const codigo = novo.codigo.trim();
    if (!/^\d+$/.test(codigo)) return;
    setBuscando(true);
    try {
      const pessoa = await peopleService.get(Number(codigo));
      setNovo((prev) => ({ ...prev, nome: pessoa.name, documento: pessoa.document ?? "" }));
    } catch (err) {
      toast.warning("Cadastro não encontrado", mensagemDeErro(err));
    } finally {
      setBuscando(false);
    }
  }

  function vincular() {
    if (!novo.nome.trim()) {
      toast.warning("Informe o cliente a vincular.");
      return;
    }
    setVinculos((prev) => [...prev, { ...novo, nome: novo.nome.trim() }]);
    setNovo(vazio);
  }

  const rotuloParentesco = (v: string) => PARENTESCOS.find((p) => p.value === v)?.label ?? v;

  const columns: Column<Vinculo>[] = [
    { header: "Código", cell: (row) => row.codigo || "—", className: "w-24" },
    { header: "Nome", cell: (row) => row.nome },
    { header: "CPF / CNPJ", cell: (row) => row.documento || "—" },
    { header: "Parentesco", cell: (row) => rotuloParentesco(row.parentesco) },
    {
      header: "",
      className: "w-12 text-right",
      cell: (row, index) => (
        <Button
          type="button"
          size="xs"
          variant="ghost"
          aria-label={`Desvincular ${row.nome}`}
          onClick={() => setVinculos((prev) => prev.filter((_, i) => i !== index))}
        >
          <Trash2 className="size-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <Card className="px-6">
      <FormSection title="Vincular com outro cliente">
        <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[8rem_1fr_14rem_12rem_auto]">
          <Campo id="vinculo-codigo" label="Código">
            <Input
              id="vinculo-codigo"
              inputMode="numeric"
              value={novo.codigo}
              disabled={buscando}
              onChange={(e) => setNovo({ ...novo, codigo: e.target.value })}
              onBlur={buscarPorCodigo}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  buscarPorCodigo();
                }
              }}
            />
          </Campo>
          <Campo id="vinculo-nome" label="Nome">
            <Input id="vinculo-nome" value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} />
          </Campo>
          <Campo id="vinculo-documento" label="CPF / CNPJ">
            <Input
              id="vinculo-documento"
              value={novo.documento}
              onChange={(e) => setNovo({ ...novo, documento: e.target.value })}
            />
          </Campo>
          <Campo id="vinculo-parentesco" label="Parentesco">
            <Select value={novo.parentesco} onValueChange={(parentesco) => setNovo({ ...novo, parentesco })}>
              <SelectTrigger id="vinculo-parentesco" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {PARENTESCOS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>
          <Button type="button" onClick={vincular}>
            <Link2 className="size-3.5" />
            Vincular
          </Button>
        </div>
        {vinculos.length > 0 && (
          <DataTable data={vinculos} columns={columns} keyExtractor={(row, index) => `${index}-${row.nome}`} />
        )}
        <NaoGravado>Os vínculos ainda não são gravados: a API de clientes não tem esse campo.</NaoGravado>
      </FormSection>
    </Card>
  );
}
