"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { FormSection } from "@/components/shared/form-section";
import { Skeleton } from "@/components/shared/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/shared/toast";
import { customersService, suppliersService } from "@/services/erp";
import { ApiRequestError, mensagemDeErro } from "@/services/types";
import { Campo } from "./_components/campo";
import { ClienteCompleto, ClienteRapido } from "./_components/cliente-campos";
import { EnderecoCampos } from "./_components/endereco-campos";
import { FornecedorCompleto } from "./_components/fornecedor-completo";
import { FuncionarioSecoes } from "./_components/funcionario-secoes";
import { PessoaRapido } from "./_components/pessoa-rapido";
import {
  clienteParaForm,
  clienteVazio,
  formParaClienteWrite,
  validarCliente,
  type ClienteForm,
} from "./_lib/cliente-form";
import {
  fornecedorParaForm,
  fornecedorVazio,
  formParaFornecedorWrite,
  validarFornecedor,
  type FornecedorForm,
} from "./_lib/fornecedor-form";

const TIPOS_CADASTRO = [
  { value: "cliente", label: "Cliente" },
  { value: "fornecedor", label: "Fornecedor" },
  { value: "funcionario", label: "Funcionário" },
  { value: "representante", label: "Representante" },
] as const;

type TipoCadastro = (typeof TIPOS_CADASTRO)[number]["value"];

/** Aba da ficha que lista cada tipo (o "Alterar" abre a busca nela) */
const ABA_DA_FICHA: Record<TipoCadastro, string | null> = {
  cliente: "cliente",
  fornecedor: "fornecedor",
  funcionario: "usuario",
  representante: null,
};

function ehTipo(valor: string | undefined): valor is TipoCadastro {
  return TIPOS_CADASTRO.some((t) => t.value === valor);
}

type Carregamento = { status: "ok" } | { status: "carregando" } | { status: "erro"; mensagem: string };

// /cadastro?tipo=<tipo> abre um cadastro novo naquele tipo; com &id=<id>
// (cliente ou fornecedor) carrega o registro existente para alterar. A ficha
// (/cadastro/ficha) abre esta tela nos dois modos.
export default function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; id?: string }>;
}) {
  const { tipo, id } = use(searchParams);
  const tipoInicial: TipoCadastro = ehTipo(tipo) ? tipo : "cliente";
  const idNum =
    id && /^\d+$/.test(id) && (tipoInicial === "cliente" || tipoInicial === "fornecedor")
      ? Number(id)
      : null;
  // "Incluir" num cadastro novo não muda a URL: este contador remonta o formulário.
  const [novo, setNovo] = useState(0);

  return (
    <FormularioCadastro
      key={`${tipoInicial}:${idNum ?? "novo"}:${novo}`}
      tipoInicial={tipoInicial}
      id={idNum}
      onNovo={() => setNovo((n) => n + 1)}
    />
  );
}

function FormularioCadastro({
  tipoInicial,
  id,
  onNovo,
}: {
  tipoInicial: TipoCadastro;
  id: number | null;
  onNovo: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const editando = id !== null;

  const [tipoCadastro, setTipoCadastro] = useState<TipoCadastro>(tipoInicial);
  const [cadastroEspecial, setCadastroEspecial] = useState("usuario");
  const [cliente, setCliente] = useState<ClienteForm>(clienteVazio);
  // Fornecedor, funcionário e representante compartilham o cadastro rápido.
  const [pessoa, setPessoa] = useState<FornecedorForm>(fornecedorVazio);
  const [carregamento, setCarregamento] = useState<Carregamento>(
    editando ? { status: "carregando" } : { status: "ok" }
  );
  const [tentativa, setTentativa] = useState(0);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (id === null) return;
    let ativo = true;
    const carregar =
      tipoInicial === "fornecedor"
        ? suppliersService.get(id).then((s) => {
            if (ativo) setPessoa(fornecedorParaForm(s));
          })
        : customersService.get(id).then((c) => {
            if (ativo) setCliente(clienteParaForm(c));
          });
    carregar
      .then(() => {
        if (ativo) setCarregamento({ status: "ok" });
      })
      .catch((err) => {
        if (ativo) setCarregamento({ status: "erro", mensagem: mensagemDeErro(err) });
      });
    return () => {
      ativo = false;
    };
  }, [id, tipoInicial, tentativa]);

  const atualizarCliente = (patch: Partial<ClienteForm>) => setCliente((prev) => ({ ...prev, ...patch }));
  const atualizarPessoa = (patch: Partial<FornecedorForm>) => setPessoa((prev) => ({ ...prev, ...patch }));

  const rotuloTipo = TIPOS_CADASTRO.find((t) => t.value === tipoCadastro)!.label;

  function handleIncluir() {
    toast.info(`Novo cadastro de ${rotuloTipo.toLowerCase()} iniciado.`);
    if (editando) router.push(`/cadastro?tipo=${tipoCadastro}`);
    else onNovo();
  }

  async function handleSave() {
    if (tipoCadastro === "funcionario" || tipoCadastro === "representante") {
      toast.info(
        `Cadastro de ${tipoCadastro === "funcionario" ? "funcionário" : "representante"} ainda não disponível`,
        "Este tipo de cadastro ainda não é gravado na API."
      );
      return;
    }

    const erro = tipoCadastro === "fornecedor" ? validarFornecedor(pessoa) : validarCliente(cliente);
    if (erro) {
      toast.warning(erro);
      return;
    }

    setSalvando(true);
    try {
      let salvoId: number;
      if (tipoCadastro === "fornecedor") {
        const payload = formParaFornecedorWrite(pessoa, editando ? "editar" : "criar");
        salvoId = (editando ? await suppliersService.update(id, payload) : await suppliersService.create(payload)).id;
      } else {
        const payload = formParaClienteWrite(cliente, editando ? "editar" : "criar");
        salvoId = (editando ? await customersService.update(id, payload) : await customersService.create(payload)).id;
      }
      const rotulo = tipoCadastro === "fornecedor" ? "Fornecedor" : "Cliente";
      toast.success(editando ? `${rotulo} atualizado.` : `${rotulo} cadastrado com sucesso.`);
      // Depois de criar, a tela passa a editar o registro: um novo Gravar atualiza, não duplica.
      if (!editando) router.replace(`/cadastro?tipo=${tipoCadastro}&id=${salvoId}`);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        const primeiroErroDeCampo = err.errors && Object.values(err.errors)[0]?.[0];
        toast.error(err.message, primeiroErroDeCampo);
      } else {
        toast.error("Não foi possível salvar o cadastro.", "Verifique sua conexão e tente novamente.");
      }
    } finally {
      setSalvando(false);
    }
  }

  const abaDaFicha = ABA_DA_FICHA[tipoCadastro];

  const seletorTipo = (
    <Campo id="cadastrar-como" label="Cadastrar como">
      <Select value={tipoCadastro} onValueChange={(v) => setTipoCadastro(v as TipoCadastro)} disabled={editando}>
        <SelectTrigger id="cadastrar-como" className="w-full">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          {TIPOS_CADASTRO.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Campo>
  );

  const botoes = (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={handleIncluir}>
        Incluir
      </Button>
      {abaDaFicha ? (
        <Button size="sm" variant="secondary" asChild>
          <Link href={`/cadastro/ficha?aba=${abaDaFicha}`}>Alterar</Link>
        </Button>
      ) : (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => toast.info("Alteração de representante ainda não disponível", "A API ainda não tem este tipo de cadastro.")}
        >
          Alterar
        </Button>
      )}
      <Button size="sm" onClick={handleSave} disabled={salvando || carregamento.status !== "ok"}>
        {salvando ? "Gravando..." : "Gravar"}
      </Button>
      <Button size="sm" variant="outline" asChild>
        <Link href="/">Cancelar</Link>
      </Button>
    </div>
  );

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb items={[{ label: "ERP", href: "/" }, { label: "Cadastro" }]} />

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Cadastro</h1>
        {editando && (
          <Badge variant="muted">
            Alterando {rotuloTipo.toLowerCase()} nº {id}
          </Badge>
        )}
      </div>

      {carregamento.status === "erro" ? (
        <EmptyState
          icon={AlertCircle}
          title={`Não foi possível carregar o ${rotuloTipo.toLowerCase()}`}
          description={carregamento.mensagem}
          action={{
            label: "Tentar novamente",
            onClick: () => {
              setCarregamento({ status: "carregando" });
              setTentativa((t) => t + 1);
            },
          }}
          className="rounded-lg border border-border py-12"
        />
      ) : carregamento.status === "carregando" ? (
        <div className="space-y-4" aria-busy="true">
          <Skeleton className="h-9 w-80" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <div className="w-full space-y-8">
          {botoes}

          <Card className="px-6">
            <FormSection title="Cadastro rápido" description="Dados básicos de identificação.">
              {tipoCadastro === "cliente" ? (
                <ClienteRapido form={cliente} atualizar={atualizarCliente} codigo={id} seletorTipo={seletorTipo} />
              ) : (
                <PessoaRapido
                  form={pessoa}
                  atualizar={atualizarPessoa}
                  codigo={id}
                  camposFiscais={tipoCadastro === "fornecedor"}
                  seletorTipo={seletorTipo}
                />
              )}
            </FormSection>
          </Card>

          {tipoCadastro === "cliente" && <ClienteCompleto form={cliente} atualizar={atualizarCliente} />}

          {tipoCadastro === "cliente" && (
            <EnderecoCampos
              endereco={cliente.endereco}
              onChange={(endereco) => atualizarCliente({ endereco })}
              descricao="Endereço do cliente."
            />
          )}
          {tipoCadastro === "fornecedor" && (
            <EnderecoCampos
              endereco={pessoa.endereco}
              onChange={(endereco) => atualizarPessoa({ endereco })}
              descricao="Endereço comercial do fornecedor."
            />
          )}

          <Card className="px-6">
            <FormSection title="Tipo de cadastro" description="Classificação do cadastro no sistema.">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Cadastro:</p>
                  <RadioGroup
                    name="tipoCadastro"
                    value={tipoCadastro}
                    onValueChange={(v) => {
                      if (!editando) setTipoCadastro(v as TipoCadastro);
                    }}
                    className="flex-row flex-wrap gap-x-6 gap-y-2 rounded-lg border border-input p-3"
                  >
                    {TIPOS_CADASTRO.map((t) => (
                      <RadioGroupItem
                        key={t.value}
                        id={`tipo-${t.value}`}
                        value={t.value}
                        label={t.label}
                        disabled={editando && t.value !== tipoCadastro}
                      />
                    ))}
                  </RadioGroup>
                  {editando && (
                    <p className="text-xs text-muted-foreground">O tipo não muda ao alterar um cadastro existente.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Cadastro especial:</p>
                  <RadioGroup
                    name="cadastroEspecial"
                    value={cadastroEspecial}
                    onValueChange={setCadastroEspecial}
                    className="flex-row flex-wrap gap-x-6 gap-y-2 rounded-lg border border-input p-3"
                  >
                    <RadioGroupItem id="especial-loja" value="loja" label="Loja" />
                    <RadioGroupItem id="especial-usuario" value="usuario" label="Usuário" />
                    <RadioGroupItem id="especial-usuario-pagador" value="usuario-pagador" label="Usuário Pagador" />
                    <RadioGroupItem id="especial-banco" value="banco" label="Banco" />
                  </RadioGroup>
                </div>
              </div>
            </FormSection>
          </Card>

          {tipoCadastro === "fornecedor" && (
            <FornecedorCompleto form={pessoa} atualizar={atualizarPessoa} editando={editando} />
          )}

          {tipoCadastro === "funcionario" && <FuncionarioSecoes />}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" asChild>
              <Link href="/">Cancelar</Link>
            </Button>
            <Button onClick={handleSave} disabled={salvando}>
              {salvando ? "Gravando..." : "Gravar"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
