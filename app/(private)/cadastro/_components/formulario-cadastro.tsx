"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Copy } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { FormSection } from "@/components/shared/form-section";
import { Modal, ModalFooter } from "@/components/shared/modal";
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
import { customersService, employeesService, suppliersService } from "@/services/erp";
import { ApiRequestError, mensagemDeErro } from "@/services/types";
import { Campo } from "./campo";
import { ClienteCompleto, ClienteRapido, ClienteRedesSociais } from "./cliente-campos";
import { ClienteDadosComerciais, ClienteVinculos } from "./cliente-extras";
import { EnderecoCampos } from "./endereco-campos";
import { FornecedorCompleto } from "./fornecedor-completo";
import { FuncionarioRapido } from "./funcionario-rapido";
import { FuncionarioSecoes } from "./funcionario-secoes";
import { PessoaRapido } from "./pessoa-rapido";
import {
  clienteParaForm,
  clienteVazio,
  formParaClienteWrite,
  validarCliente,
  type ClienteForm,
} from "../_lib/cliente-form";
import {
  fornecedorParaForm,
  fornecedorVazio,
  formParaFornecedorWrite,
  validarFornecedor,
  type FornecedorForm,
} from "../_lib/fornecedor-form";
import {
  formParaFuncionarioWrite,
  funcionarioParaForm,
  funcionarioVazio,
  validarFuncionario,
  type FuncionarioForm,
} from "../_lib/funcionario-form";

// Cadastro especial (Loja / Usuário / Usuário Pagador / Banco) ainda não é
// gravado: fica oculto até a regra ser definida (ver CONTEXT.md).
const MOSTRAR_CADASTRO_ESPECIAL = false;

export const TIPOS_CADASTRO = [
  { value: "cliente", label: "Cliente" },
  { value: "fornecedor", label: "Fornecedor" },
  { value: "funcionario", label: "Funcionário" },
  { value: "representante", label: "Representante" },
] as const;

export type TipoCadastro = (typeof TIPOS_CADASTRO)[number]["value"];

/** Aba da ficha que lista cada tipo (o "Alterar" abre a busca nela) */
const ABA_DA_FICHA: Record<TipoCadastro, string> = {
  cliente: "cliente",
  fornecedor: "fornecedor",
  funcionario: "usuario",
  representante: "representante",
};

/** Pessoa física ou jurídica com que um cadastro novo começa */
const PESSOA_PADRAO: Record<TipoCadastro, FornecedorForm["pessoa"]> = {
  cliente: "fisica",
  fornecedor: "juridica",
  funcionario: "fisica",
  representante: "juridica",
};

export function ehTipo(valor: string | undefined): valor is TipoCadastro {
  return TIPOS_CADASTRO.some((t) => t.value === valor);
}

type Carregamento = { status: "ok" } | { status: "carregando" } | { status: "erro"; mensagem: string };

// Formulário de cadastro, aberto a partir da lista (/cadastro): um cadastro
// novo em /cadastro/novo?tipo=<tipo>, ou um existente (cliente, fornecedor ou
// funcionário) em /cadastro/<tipo>/<id>.
export function Cadastro({ tipoInicial, id }: { tipoInicial: TipoCadastro; id: number | null }) {
  // "Incluir" num cadastro novo não muda a URL: este contador remonta o formulário.
  const [novo, setNovo] = useState(0);

  return (
    <FormularioCadastro
      key={`${tipoInicial}:${id ?? "novo"}:${novo}`}
      tipoInicial={tipoInicial}
      id={id}
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
  const [funcionario, setFuncionario] = useState<FuncionarioForm>(funcionarioVazio);
  // Fornecedor e representante compartilham o cadastro rápido.
  const [pessoa, setPessoa] = useState<FornecedorForm>(() => ({
    ...fornecedorVazio(),
    pessoa: PESSOA_PADRAO[tipoInicial],
  }));
  const [carregamento, setCarregamento] = useState<Carregamento>(
    editando ? { status: "carregando" } : { status: "ok" }
  );
  const [tentativa, setTentativa] = useState(0);
  const [salvando, setSalvando] = useState(false);
  // Código exibido = id da Pessoa, o mesmo da lista. O id da URL é o do papel
  // (cliente/fornecedor/funcionário), que tem numeração própria.
  const [codigoPessoa, setCodigoPessoa] = useState<number | null>(null);
  // Funcionário criado sem senha: a API devolve o código de primeiro acesso uma
  // única vez. A tela só passa a editar o registro depois de fechar o aviso.
  const [primeiroAcesso, setPrimeiroAcesso] = useState<{ token: string; id: number } | null>(null);

  useEffect(() => {
    if (id === null) return;
    let ativo = true;
    const carregar =
      tipoInicial === "fornecedor"
        ? suppliersService.get(id).then((s) => {
            if (!ativo) return;
            setPessoa(fornecedorParaForm(s));
            setCodigoPessoa(s.personId);
          })
        : tipoInicial === "funcionario"
          ? employeesService.get(id).then((e) => {
              if (!ativo) return;
              setFuncionario(funcionarioParaForm(e));
              setCodigoPessoa(e.personId ?? null);
            })
          : customersService.get(id).then((c) => {
              if (!ativo) return;
              setCliente(clienteParaForm(c));
              setCodigoPessoa(c.personId);
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
  // Num cadastro novo, trocar o tipo também troca física/jurídica para o padrão do tipo.
  function trocarTipo(tipo: TipoCadastro) {
    if (editando) return;
    setTipoCadastro(tipo);
    setPessoa((prev) => ({ ...prev, pessoa: PESSOA_PADRAO[tipo] }));
  }

  const atualizarPessoa = (patch: Partial<FornecedorForm>) => setPessoa((prev) => ({ ...prev, ...patch }));
  const atualizarFuncionario = (patch: Partial<FuncionarioForm>) =>
    setFuncionario((prev) => ({ ...prev, ...patch }));

  const rotuloTipo = TIPOS_CADASTRO.find((t) => t.value === tipoCadastro)!.label;

  function handleIncluir() {
    toast.info(`Novo cadastro de ${rotuloTipo.toLowerCase()} iniciado.`);
    if (editando) router.push(`/cadastro/novo?tipo=${tipoCadastro}`);
    else onNovo();
  }

  async function handleSave() {
    if (tipoCadastro === "representante") {
      toast.info("Cadastro de representante ainda não disponível", "Este tipo de cadastro ainda não é gravado na API.");
      return;
    }

    const erro =
      tipoCadastro === "fornecedor"
        ? validarFornecedor(pessoa)
        : tipoCadastro === "funcionario"
          ? validarFuncionario(funcionario)
          : validarCliente(cliente);
    if (erro) {
      toast.warning(erro);
      return;
    }

    setSalvando(true);
    try {
      let salvoId: number;
      let tokenPrimeiroAcesso: string | undefined;
      if (tipoCadastro === "fornecedor") {
        const payload = formParaFornecedorWrite(pessoa, editando ? "editar" : "criar");
        salvoId = (editando ? await suppliersService.update(id, payload) : await suppliersService.create(payload)).id;
      } else if (tipoCadastro === "funcionario") {
        const payload = formParaFuncionarioWrite(funcionario, editando ? "editar" : "criar");
        if (editando) {
          const salvo = await employeesService.update(id, payload);
          salvoId = salvo.id;
          // Senha gravada: limpa os campos e passa a mostrar "já tem senha".
          setFuncionario((prev) => ({
            ...prev,
            senhaManual: false,
            senha: "",
            confirmacaoSenha: "",
            temSenha: salvo.hasPassword ?? prev.temSenha,
          }));
        } else {
          const criado = await employeesService.create(payload);
          salvoId = criado.id;
          tokenPrimeiroAcesso = criado.firstAccessToken;
        }
      } else {
        const payload = formParaClienteWrite(cliente, editando ? "editar" : "criar");
        salvoId = (editando ? await customersService.update(id, payload) : await customersService.create(payload)).id;
      }
      toast.success(editando ? `${rotuloTipo} atualizado.` : `${rotuloTipo} cadastrado com sucesso.`);
      if (tokenPrimeiroAcesso) {
        setPrimeiroAcesso({ token: tokenPrimeiroAcesso, id: salvoId });
        return;
      }
      // Depois de criar, a tela passa a editar o registro: um novo Gravar atualiza, não duplica.
      if (!editando) router.replace(`/cadastro/${tipoCadastro}/${salvoId}`);
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

  const lista = `/cadastro?aba=${ABA_DA_FICHA[tipoCadastro]}`;

  function fecharPrimeiroAcesso() {
    if (!primeiroAcesso) return;
    const criadoId = primeiroAcesso.id;
    setPrimeiroAcesso(null);
    router.replace(`/cadastro/funcionario/${criadoId}`);
  }

  async function copiarToken() {
    if (!primeiroAcesso) return;
    try {
      await navigator.clipboard.writeText(primeiroAcesso.token);
      toast.success("Código copiado.");
    } catch {
      toast.warning("Não foi possível copiar", "Selecione o código e copie manualmente.");
    }
  }

  const seletorTipo = (
    <Campo id="cadastrar-como" label="Cadastrar como">
      <Select value={tipoCadastro} onValueChange={(v) => trocarTipo(v as TipoCadastro)} disabled={editando}>
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
      <Button size="sm" asChild>
        <Link href={lista}>Alterar</Link>
      </Button>
      <Button size="sm" onClick={handleSave} disabled={salvando || carregamento.status !== "ok"}>
        {salvando ? "Gravando..." : "Gravar"}
      </Button>
      <Button size="sm" variant="outline" asChild>
        <Link href={lista}>Cancelar</Link>
      </Button>
    </div>
  );

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Cadastro</h1>
        {editando && (
          <Badge variant="muted">
            Alterando {rotuloTipo.toLowerCase()}
            {codigoPessoa !== null && ` nº ${codigoPessoa}`}
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
            <FormSection title="Tipo de cadastro">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Cadastro:</p>
                  <RadioGroup
                    name="tipoCadastro"
                    value={tipoCadastro}
                    onValueChange={(v) => trocarTipo(v as TipoCadastro)}
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
                {MOSTRAR_CADASTRO_ESPECIAL && (
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
                )}
              </div>
            </FormSection>
          </Card>

          <Card className="px-6">
            <FormSection title="Cadastro rápido">
              {tipoCadastro === "cliente" ? (
                <ClienteRapido form={cliente} atualizar={atualizarCliente} codigo={codigoPessoa} seletorTipo={seletorTipo} />
              ) : tipoCadastro === "funcionario" ? (
                <FuncionarioRapido
                  form={funcionario}
                  atualizar={atualizarFuncionario}
                  codigo={codigoPessoa}
                  seletorTipo={seletorTipo}
                />
              ) : (
                <PessoaRapido
                  form={pessoa}
                  atualizar={atualizarPessoa}
                  codigo={codigoPessoa}
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
            />
          )}
          {tipoCadastro === "cliente" && <ClienteDadosComerciais form={cliente} atualizar={atualizarCliente} />}
          {tipoCadastro === "cliente" && <ClienteVinculos form={cliente} atualizar={atualizarCliente} />}
          {tipoCadastro === "cliente" && <ClienteRedesSociais form={cliente} atualizar={atualizarCliente} />}
          {tipoCadastro === "fornecedor" && (
            <EnderecoCampos
              endereco={pessoa.endereco}
              onChange={(endereco) => atualizarPessoa({ endereco })}
            />
          )}

          {tipoCadastro === "fornecedor" && (
            <FornecedorCompleto form={pessoa} atualizar={atualizarPessoa} editando={editando} />
          )}

          {tipoCadastro === "funcionario" && (
            <EnderecoCampos
              endereco={funcionario.endereco}
              onChange={(endereco) => atualizarFuncionario({ endereco })}
            />
          )}
          {tipoCadastro === "funcionario" && (
            <FuncionarioSecoes form={funcionario} atualizar={atualizarFuncionario} editando={editando} />
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" asChild>
              <Link href={lista}>Cancelar</Link>
            </Button>
            <Button onClick={handleSave} disabled={salvando}>
              {salvando ? "Gravando..." : "Gravar"}
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={primeiroAcesso !== null}
        onOpenChange={(aberto) => {
          if (!aberto) fecharPrimeiroAcesso();
        }}
        title="Código de primeiro acesso"
        description="O funcionário foi cadastrado sem senha. Passe este código a ele para o primeiro acesso: ele não será mostrado de novo."
        size="md"
        persistent
      >
        <div className="flex items-center gap-2">
          <code className="flex-1 break-all rounded-md border border-input bg-muted px-3 py-2 font-mono text-sm select-all">
            {primeiroAcesso?.token}
          </code>
          <Button type="button" size="sm" variant="outline" onClick={copiarToken}>
            <Copy className="size-3.5" />
            Copiar
          </Button>
        </div>
        <ModalFooter>
          <Button onClick={fecharPrimeiroAcesso}>Já anotei</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
