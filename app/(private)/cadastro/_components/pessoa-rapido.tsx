"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FornecedorForm } from "../_lib/fornecedor-form";
import { Campo } from "./campo";

// Cadastro rápido de fornecedor, funcionário e representante (telas 01 e
// "Usuários"): pessoa física/jurídica, documento, contato e nomes. Os campos
// fiscais (IE, CFOP, regime, código de compras, site) são só de fornecedor.
export function PessoaRapido({
  form,
  atualizar,
  codigo,
  camposFiscais,
  seletorTipo,
}: {
  form: FornecedorForm;
  atualizar: (patch: Partial<FornecedorForm>) => void;
  codigo: number | null;
  camposFiscais: boolean;
  seletorTipo: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Campo id="pessoa-codigo" label="Código">
        <Input id="pessoa-codigo" placeholder="Gerado automaticamente" value={codigo ?? ""} disabled />
      </Campo>
      <Campo id="pessoa-tipo" label="Pessoa">
        <Select value={form.pessoa} onValueChange={(v) => atualizar({ pessoa: v as FornecedorForm["pessoa"] })}>
          <SelectTrigger id="pessoa-tipo" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fisica">Física</SelectItem>
            <SelectItem value="juridica">Jurídica</SelectItem>
          </SelectContent>
        </Select>
      </Campo>
      <Campo id="pessoa-documento" label={form.pessoa === "fisica" ? "CPF" : "CNPJ"}>
        <Input
          id="pessoa-documento"
          placeholder={form.pessoa === "fisica" ? "000.000.000-00" : "00.000.000/0001-00"}
          value={form.documento}
          onChange={(e) => atualizar({ documento: e.target.value })}
        />
      </Campo>
      <Campo id="pessoa-ddd" label="DDD">
        <Input
          id="pessoa-ddd"
          placeholder="11"
          maxLength={2}
          value={form.ddd}
          onChange={(e) => atualizar({ ddd: e.target.value })}
        />
      </Campo>
      <Campo id="pessoa-telefone" label="Telefone / Whatsapp">
        <Input
          id="pessoa-telefone"
          placeholder="(00) 00000-0000"
          value={form.telefone}
          onChange={(e) => atualizar({ telefone: e.target.value })}
        />
      </Campo>
      <Campo id="pessoa-status" label="Status">
        <Select value={form.status} onValueChange={(v) => atualizar({ status: v as FornecedorForm["status"] })}>
          <SelectTrigger id="pessoa-status" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </Campo>
      <Campo id="pessoa-nome-fantasia" label="Nome fantasia" className="sm:col-span-2 lg:col-span-3 xl:col-span-6">
        <Input
          id="pessoa-nome-fantasia"
          placeholder="Nome de exibição"
          value={form.nomeFantasia}
          onChange={(e) => atualizar({ nomeFantasia: e.target.value })}
        />
      </Campo>
      <Campo id="pessoa-razao-social" label="Razão social" className="sm:col-span-2 lg:col-span-2 xl:col-span-5">
        <Input
          id="pessoa-razao-social"
          placeholder="Razão social completa"
          value={form.razaoSocial}
          onChange={(e) => atualizar({ razaoSocial: e.target.value })}
        />
      </Campo>
      {seletorTipo}

      {camposFiscais && (
        <>
          <Campo id="fornecedor-ie" label="Inscrição Estadual">
            <Input
              id="fornecedor-ie"
              placeholder="Inscrição Estadual"
              value={form.inscricaoEstadual}
              onChange={(e) => atualizar({ inscricaoEstadual: e.target.value })}
            />
          </Campo>
          <Campo id="fornecedor-cfop" label="CFOP Default na entrada de estoque">
            <Input
              id="fornecedor-cfop"
              placeholder="Ex: 1102"
              maxLength={4}
              value={form.cfop}
              onChange={(e) => atualizar({ cfop: e.target.value })}
            />
          </Campo>
          <Campo id="fornecedor-regime" label="Regime Tributário">
            <Select value={form.regimeTributario} onValueChange={(v) => atualizar({ regimeTributario: v })}>
              <SelectTrigger id="fornecedor-regime" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simples">Simples Nacional</SelectItem>
                <SelectItem value="presumido">Lucro Presumido</SelectItem>
                <SelectItem value="real">Lucro Real</SelectItem>
                <SelectItem value="mei">MEI</SelectItem>
              </SelectContent>
            </Select>
          </Campo>
          <Campo id="fornecedor-codigo-compras" label="Nosso código de compras">
            <Input
              id="fornecedor-codigo-compras"
              placeholder="Código utilizado junto a este fornecedor"
              value={form.codigoCompras}
              onChange={(e) => atualizar({ codigoCompras: e.target.value })}
            />
          </Campo>
          <Campo id="fornecedor-site" label="Site">
            <Input
              id="fornecedor-site"
              type="url"
              placeholder="https://"
              value={form.site}
              onChange={(e) => atualizar({ site: e.target.value })}
            />
          </Campo>
        </>
      )}
    </div>
  );
}
