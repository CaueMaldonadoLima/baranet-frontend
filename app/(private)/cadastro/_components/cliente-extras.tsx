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
import { PARENTESCOS, type ClienteForm, type DadosComerciaisForm, type Vinculo } from "../_lib/cliente-form";
import { Campo } from "./campo";

// Dados comerciais e vínculos do cliente (tela 02, parte de baixo).

type Convenios = { status: "carregando" } | { status: "erro" } | { status: "ok"; lista: Person[] };

const nomeDoConvenio = (p: Person) => p.tradeName || p.name;

export function ClienteDadosComerciais({
  form,
  atualizar,
}: {
  form: ClienteForm;
  atualizar: (patch: Partial<ClienteForm>) => void;
}) {
  const dados = form.comercial;
  const set = (patch: Partial<DadosComerciaisForm>) => atualizar({ comercial: { ...dados, ...patch } });

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

  // A API guarda o nome do convênio, não o id: um nome gravado que não está na
  // lista (ex: convênio renomeado) continua aparecendo como opção.
  const opcoesConvenio = convenios.status === "ok" ? convenios.lista.map(nomeDoConvenio) : [];
  if (dados.convenio && !opcoesConvenio.includes(dados.convenio)) opcoesConvenio.unshift(dados.convenio);

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
              disabled={opcoesConvenio.length === 0}
            >
              <SelectTrigger id="comercial-convenio" className="w-full">
                <SelectValue placeholder={placeholderConvenio} />
              </SelectTrigger>
              <SelectContent>
                {opcoesConvenio.map((nome) => (
                  <SelectItem key={nome} value={nome}>
                    {nome}
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
      </FormSection>
    </Card>
  );
}

interface NovoVinculo {
  /** Código da grid de cadastro (id da Pessoa) */
  codigo: string;
  /** Vem da busca pelo código: só pessoa com papel cliente pode ser vinculada */
  customerId: number | null;
  nome: string;
  documento: string;
  parentesco: string;
}

const novoVazio: NovoVinculo = { codigo: "", customerId: null, nome: "", documento: "", parentesco: PARENTESCOS[0].value };

export function ClienteVinculos({
  form,
  atualizar,
}: {
  form: ClienteForm;
  atualizar: (patch: Partial<ClienteForm>) => void;
}) {
  const toast = useToast();
  const [novo, setNovo] = useState<NovoVinculo>(novoVazio);
  const [buscando, setBuscando] = useState(false);
  const vinculos = form.vinculos;
  const setVinculos = (lista: Vinculo[]) => atualizar({ vinculos: lista });

  // O código da grid é o id da Pessoa; a API recebe o id do papel cliente dela.
  async function buscarPorCodigo() {
    const codigo = novo.codigo.trim();
    if (!/^\d+$/.test(codigo)) return;
    setBuscando(true);
    try {
      const pessoa = await peopleService.get(Number(codigo));
      if (pessoa.customerId === null) {
        toast.warning("Este cadastro não é cliente", "Só é possível vincular pessoas com o papel cliente.");
        setNovo((prev) => ({ ...prev, customerId: null, nome: "", documento: "" }));
        return;
      }
      const customerId = pessoa.customerId;
      setNovo((prev) => ({ ...prev, customerId, nome: pessoa.name, documento: pessoa.document ?? "" }));
    } catch (err) {
      toast.warning("Cadastro não encontrado", mensagemDeErro(err));
    } finally {
      setBuscando(false);
    }
  }

  function vincular() {
    const { customerId } = novo;
    if (customerId === null) {
      toast.warning("Informe o código do cliente a vincular.");
      return;
    }
    if (vinculos.some((v) => v.customerId === customerId)) {
      toast.warning("Este cliente já está vinculado.");
      return;
    }
    setVinculos([...vinculos, { customerId, nome: novo.nome, documento: novo.documento, parentesco: novo.parentesco }]);
    setNovo(novoVazio);
  }

  const rotuloParentesco = (v: string) => (v ? (PARENTESCOS.find((p) => p.value === v)?.label ?? v) : "—");

  const columns: Column<Vinculo>[] = [
    { header: "Nome", cell: (row) => row.nome || "—" },
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
          onClick={() => setVinculos(vinculos.filter((_, i) => i !== index))}
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
              onChange={(e) => setNovo({ ...novo, codigo: e.target.value, customerId: null, nome: "", documento: "" })}
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
            <Input id="vinculo-nome" value={novo.nome} readOnly placeholder="Busque pelo código" />
          </Campo>
          <Campo id="vinculo-documento" label="CPF / CNPJ">
            <Input id="vinculo-documento" value={novo.documento} readOnly placeholder="—" />
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
          <Button type="button" onClick={vincular} disabled={buscando}>
            <Link2 className="size-3.5" />
            Vincular
          </Button>
        </div>
        {vinculos.length > 0 && (
          <DataTable data={vinculos} columns={columns} keyExtractor={(row) => row.customerId} />
        )}
      </FormSection>
    </Card>
  );
}
