"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { storesService } from "@/services/erp";
import type { IdNome } from "@/services/types";
import { FUNCOES, type FuncionarioForm } from "../_lib/funcionario-form";
import { Campo } from "./campo";

type Lojas = { status: "carregando" } | { status: "erro" } | { status: "ok"; lista: IdNome[] };

// Cadastro rápido do funcionário: pessoa, documento e contato, mais os campos
// obrigatórios da API (nome, e-mail e função), loja e comissão.
export function FuncionarioRapido({
  form,
  atualizar,
  codigo,
  seletorTipo,
}: {
  form: FuncionarioForm;
  atualizar: (patch: Partial<FuncionarioForm>) => void;
  codigo: number | null;
  seletorTipo: React.ReactNode;
}) {
  const [lojas, setLojas] = useState<Lojas>({ status: "carregando" });
  useEffect(() => {
    let ativo = true;
    storesService
      .list({ per_page: 100 })
      .then((res) => {
        if (ativo) setLojas({ status: "ok", lista: res.data });
      })
      .catch(() => {
        if (ativo) setLojas({ status: "erro" });
      });
    return () => {
      ativo = false;
    };
  }, []);

  const placeholderLoja =
    lojas.status === "carregando"
      ? "Carregando…"
      : lojas.status === "erro"
        ? "Não foi possível carregar"
        : lojas.lista.length === 0
          ? "Nenhuma loja cadastrada"
          : "Selecione";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Campo id="funcionario-codigo" label="Código">
        <Input id="funcionario-codigo" placeholder="Gerado automaticamente" value={codigo ?? ""} disabled />
      </Campo>
      <Campo id="funcionario-pessoa" label="Pessoa">
        <Select value={form.pessoa} onValueChange={(v) => atualizar({ pessoa: v as FuncionarioForm["pessoa"] })}>
          <SelectTrigger id="funcionario-pessoa" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fisica">Física</SelectItem>
            <SelectItem value="juridica">Jurídica</SelectItem>
          </SelectContent>
        </Select>
      </Campo>
      <Campo id="funcionario-documento" label={form.pessoa === "fisica" ? "CPF" : "CNPJ"}>
        <Input
          id="funcionario-documento"
          placeholder={form.pessoa === "fisica" ? "000.000.000-00" : "00.000.000/0001-00"}
          value={form.documento}
          onChange={(e) => atualizar({ documento: e.target.value })}
        />
      </Campo>
      <Campo id="funcionario-ddd" label="DDD">
        <Input
          id="funcionario-ddd"
          placeholder="11"
          maxLength={2}
          value={form.ddd}
          onChange={(e) => atualizar({ ddd: e.target.value })}
        />
      </Campo>
      <Campo id="funcionario-telefone" label="Telefone">
        <Input
          id="funcionario-telefone"
          placeholder="(00) 00000-0000"
          value={form.telefone}
          onChange={(e) => atualizar({ telefone: e.target.value })}
        />
      </Campo>
      <Campo id="funcionario-status" label="Status">
        <Select value={form.status} onValueChange={(v) => atualizar({ status: v as FuncionarioForm["status"] })}>
          <SelectTrigger id="funcionario-status" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </Campo>
      <Campo id="funcionario-nome" label="Nome" className="sm:col-span-2 lg:col-span-3 xl:col-span-3">
        <Input
          id="funcionario-nome"
          placeholder="Nome completo"
          value={form.nome}
          onChange={(e) => atualizar({ nome: e.target.value })}
        />
      </Campo>
      <Campo id="funcionario-email" label="E-mail" className="sm:col-span-2 lg:col-span-3 xl:col-span-3">
        <Input
          id="funcionario-email"
          type="email"
          placeholder="nome@otica.com.br"
          value={form.email}
          onChange={(e) => atualizar({ email: e.target.value })}
        />
      </Campo>
      <Campo id="funcionario-funcao" label="Função">
        <Select value={form.funcao} onValueChange={(v) => atualizar({ funcao: v as FuncionarioForm["funcao"] })}>
          <SelectTrigger id="funcionario-funcao" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {FUNCOES.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Campo>
      <Campo id="funcionario-loja" label="Loja" className="xl:col-span-2">
        <Select
          value={form.lojaId}
          onValueChange={(lojaId) => atualizar({ lojaId })}
          disabled={lojas.status !== "ok" || lojas.lista.length === 0}
        >
          <SelectTrigger id="funcionario-loja" className="w-full">
            <SelectValue placeholder={placeholderLoja} />
          </SelectTrigger>
          <SelectContent>
            {lojas.status === "ok" &&
              lojas.lista.map((l) => (
                <SelectItem key={l.id} value={String(l.id)}>
                  {l.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </Campo>
      <Campo id="funcionario-comissao" label="Comissão (%)">
        <Input
          id="funcionario-comissao"
          inputMode="decimal"
          placeholder="0"
          value={form.comissao}
          onChange={(e) => atualizar({ comissao: e.target.value })}
        />
      </Campo>
      <div className="xl:col-span-2">{seletorTipo}</div>
    </div>
  );
}
