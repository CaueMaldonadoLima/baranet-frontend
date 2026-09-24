"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { Camera, QrCode, Search, Trash2 } from "lucide-react";
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
import type { ClienteForm } from "../_lib/cliente-form";
import { Campo } from "./campo";

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

type Atualizar = (patch: Partial<ClienteForm>) => void;

// Cadastro rápido do cliente (tela 02). Foto e QR Code são só pré-visualização
// local: a API recebe photoUrl e ainda não há envio de arquivo.
export function ClienteRapido({
  form,
  atualizar,
  codigo,
  seletorTipo,
}: {
  form: ClienteForm;
  atualizar: Atualizar;
  codigo: number | null;
  /** O "Cadastrar como", compartilhado com os outros tipos */
  seletorTipo: React.ReactNode;
}) {
  const toast = useToast();
  const [foto, setFoto] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const qrCodeInputRef = useRef<HTMLInputElement>(null);

  // Libera os object URLs das imagens quando são trocadas ou removidas.
  useEffect(() => () => { if (foto) URL.revokeObjectURL(foto); }, [foto]);
  useEffect(() => () => { if (qrCode) URL.revokeObjectURL(qrCode); }, [qrCode]);

  function handleImagem(e: ChangeEvent<HTMLInputElement>, setter: (url: string | null) => void) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.warning("Selecione um arquivo de imagem.");
      return;
    }
    setter(URL.createObjectURL(file));
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="flex w-full shrink-0 flex-col gap-2 md:w-44">
        <p className="text-sm font-medium">Dados cadastrais</p>
        <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-input bg-muted/30">
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element -- preview local via object URL
            <img src={foto} alt="Foto do cliente" className="size-full object-cover" />
          ) : (
            <span className="text-xs text-muted-foreground">Sem dados</span>
          )}
        </div>
        <input
          ref={fotoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImagem(e, setFoto)}
        />
        <input
          ref={qrCodeInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImagem(e, setQrCode)}
        />
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" onClick={() => fotoInputRef.current?.click()}>
            <Camera className="size-3.5" />
            Foto
          </Button>
          <Button size="sm" asChild>
            <Link href="/cadastro/ficha?aba=cliente">
              <Search className="size-3.5" />
              Busca
            </Link>
          </Button>
        </div>
        <Button size="sm" onClick={() => qrCodeInputRef.current?.click()}>
          <QrCode className="size-3.5" />
          Imagem QR Code
        </Button>
        {qrCode && (
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- preview local via object URL */}
            <img src={qrCode} alt="QR Code do cliente" className="size-14 rounded border border-input object-contain" />
            <Button size="sm" variant="ghost" onClick={() => setQrCode(null)} aria-label="Remover QR Code">
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        )}
        <Button size="sm" variant="secondary" disabled={!foto} onClick={() => setFoto(null)}>
          Excluir foto do cliente
        </Button>
      </div>

      <div className="grid flex-1 content-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Campo id="cliente-codigo" label="Código" className="lg:col-span-2">
          <Input id="cliente-codigo" placeholder="Gerado automaticamente" value={codigo ?? ""} disabled />
        </Campo>
        <Campo id="cliente-documento" label="CPF / CNPJ">
          <Input
            id="cliente-documento"
            placeholder={form.menorSemCpf ? "Cliente menor sem CPF" : "000.000.000-00"}
            value={form.menorSemCpf ? "" : form.documento}
            onChange={(e) => atualizar({ documento: e.target.value })}
            disabled={form.menorSemCpf}
          />
        </Campo>
        <Campo id="cliente-whatsapp" label="Whatsapp">
          <Input
            id="cliente-whatsapp"
            placeholder="(00) 00000-0000"
            value={form.whatsapp}
            onChange={(e) => atualizar({ whatsapp: e.target.value })}
          />
        </Campo>
        <Campo id="cliente-nome" label="Nome fantasia / Razão social" className="sm:col-span-2 lg:col-span-4">
          <Input
            id="cliente-nome"
            placeholder="Nome completo ou razão social do cliente"
            value={form.nome}
            onChange={(e) => atualizar({ nome: e.target.value })}
          />
        </Campo>
        <Campo id="cliente-tipo" label="Tipo de cliente">
          <Select value={form.tipoCliente} onValueChange={(v) => atualizar({ tipoCliente: v })}>
            <SelectTrigger id="cliente-tipo" className="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="otimo">Ótimo</SelectItem>
              <SelectItem value="bom">Bom</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="ruim">Ruim</SelectItem>
            </SelectContent>
          </Select>
        </Campo>
        <Campo id="cliente-status" label="Status">
          <Select value={form.status} onValueChange={(v) => atualizar({ status: v as ClienteForm["status"] })}>
            <SelectTrigger id="cliente-status" className="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </Campo>
        {seletorTipo}
        <label className="flex cursor-pointer items-center gap-2.5 self-end pb-2">
          <Checkbox
            checked={form.menorSemCpf}
            onCheckedChange={(checked) => atualizar({ menorSemCpf: checked === true })}
          />
          <span className="text-sm text-foreground">Cliente menor sem CPF</span>
        </label>
      </div>
    </div>
  );
}

export function ClienteCompleto({ form, atualizar }: { form: ClienteForm; atualizar: Atualizar }) {
  return (
    <Card className="px-6">
      <FormSection title="Cadastro completo" description="Documentos e dados pessoais do cliente.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Campo id="cliente-rg" label="RG">
            <Input id="cliente-rg" placeholder="RG" value={form.rg} onChange={(e) => atualizar({ rg: e.target.value })} />
          </Campo>
          <Campo id="cliente-nascimento" label="Nascimento">
            <Input
              id="cliente-nascimento"
              type="date"
              value={form.nascimento}
              onChange={(e) => atualizar({ nascimento: e.target.value })}
            />
          </Campo>
          <Campo id="cliente-sexo" label="Sexo">
            <Select value={form.sexo} onValueChange={(v) => atualizar({ sexo: v })}>
              <SelectTrigger id="cliente-sexo" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feminino">Feminino</SelectItem>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="nao_informado">Prefere não informar</SelectItem>
              </SelectContent>
            </Select>
          </Campo>
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <p className="text-sm font-medium">Dados adicionais</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Campo id="cliente-estado-civil" label="Estado civil">
              <Select value={form.estadoCivil} onValueChange={(v) => atualizar({ estadoCivil: v })}>
                <SelectTrigger id="cliente-estado-civil" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                  <SelectItem value="casado">Casado(a)</SelectItem>
                  <SelectItem value="uniao_estavel">União estável</SelectItem>
                  <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                  <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                </SelectContent>
              </Select>
            </Campo>
            <Campo id="cliente-natural" label="Natural">
              <Input
                id="cliente-natural"
                placeholder="Cidade de nascimento"
                value={form.natural}
                onChange={(e) => atualizar({ natural: e.target.value })}
              />
            </Campo>
            <Campo id="cliente-ddd-comercial" label="DDD">
              <Input
                id="cliente-ddd-comercial"
                placeholder="11"
                maxLength={2}
                value={form.dddComercial}
                onChange={(e) => atualizar({ dddComercial: e.target.value })}
              />
            </Campo>
            <Campo id="cliente-telefone-comercial" label="Telefone comercial">
              <Input
                id="cliente-telefone-comercial"
                placeholder="0000-0000"
                value={form.telefoneComercial}
                onChange={(e) => atualizar({ telefoneComercial: e.target.value })}
              />
            </Campo>
            <Campo id="cliente-ramal" label="Ramal">
              <Input
                id="cliente-ramal"
                placeholder="Ramal"
                value={form.ramal}
                onChange={(e) => atualizar({ ramal: e.target.value })}
              />
            </Campo>

            <label className="flex cursor-pointer items-center gap-2.5 sm:col-span-2 lg:col-span-5">
              <Checkbox
                checked={form.estrangeiro}
                onCheckedChange={(checked) => atualizar({ estrangeiro: checked === true })}
              />
              <span className="text-sm text-foreground">Cliente estrangeiro</span>
            </label>

            <Campo id="cliente-estrangeiro" label="Estrangeiro">
              <Input
                id="cliente-estrangeiro"
                placeholder="Passaporte / RNE"
                value={form.documentoEstrangeiro}
                onChange={(e) => atualizar({ documentoEstrangeiro: e.target.value })}
                disabled={!form.estrangeiro}
              />
            </Campo>
            <Campo id="cliente-emissao-rg" label="Emissão RG">
              <Input
                id="cliente-emissao-rg"
                type="date"
                value={form.emissaoRg}
                onChange={(e) => atualizar({ emissaoRg: e.target.value })}
              />
            </Campo>
            <Campo id="cliente-orgao-rg" label="Órgão emissor RG">
              <Input
                id="cliente-orgao-rg"
                placeholder="SSP"
                value={form.orgaoEmissorRg}
                onChange={(e) => atualizar({ orgaoEmissorRg: e.target.value })}
              />
            </Campo>
            <Campo id="cliente-uf-rg" label="UF">
              <Select value={form.ufRg} onValueChange={(v) => atualizar({ ufRg: v })}>
                <SelectTrigger id="cliente-uf-rg" className="w-full">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {UFS.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Campo>
            <Campo id="cliente-ultima-compra" label="Última compra">
              <Input
                id="cliente-ultima-compra"
                type="date"
                value={form.ultimaCompra}
                disabled
                title="Preenchido automaticamente pelo sistema"
              />
            </Campo>
            <Campo id="cliente-data-cadastro" label="Data de cadastro">
              <Input
                id="cliente-data-cadastro"
                type="date"
                value={form.dataCadastro}
                disabled
                title="Preenchido automaticamente pelo sistema"
              />
            </Campo>
            <Campo id="cliente-atualizacao" label="Atualização">
              <Input
                id="cliente-atualizacao"
                type="date"
                value={form.atualizacao}
                disabled
                title="Preenchido automaticamente pelo sistema"
              />
            </Campo>
            <Campo id="cliente-apelido" label="Apelido">
              <Input
                id="cliente-apelido"
                placeholder="Como o cliente prefere ser chamado"
                value={form.apelido}
                onChange={(e) => atualizar({ apelido: e.target.value })}
              />
            </Campo>
            <Campo id="cliente-pais" label="País">
              <Input
                id="cliente-pais"
                placeholder="Brasil"
                value={form.pais}
                onChange={(e) => atualizar({ pais: e.target.value })}
              />
            </Campo>
          </div>
        </div>
      </FormSection>
    </Card>
  );
}
