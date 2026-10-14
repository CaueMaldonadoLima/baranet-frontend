import type { ClienteForm } from "./cliente-form";
import { apenasDigitos, type EnderecoForm } from "./comum";
import type { FornecedorForm } from "./fornecedor-form";
import type { FuncionarioForm } from "./funcionario-form";

// Ao trocar o tipo num cadastro novo, cada tipo tem o próprio formulário. Os
// dados que todos têm (nome, documento, contato, status e endereço) passam de
// um para o outro, para não se perder o que já foi digitado.

export interface DadosBasicos {
  documento: string;
  nome: string;
  ddd: string;
  telefone: string;
  email: string;
  status: "ativo" | "inativo";
  endereco: EnderecoForm;
}

/** CPF (11 dígitos) é física, CNPJ (14) é jurídica; senão, não dá para saber */
export function pessoaDoDocumento(documento: string): "fisica" | "juridica" | null {
  const digitos = apenasDigitos(documento);
  if (digitos.length === 11) return "fisica";
  if (digitos.length === 14) return "juridica";
  return null;
}

/** "(67) 98137-1568" → DDD "67" e telefone "981371568"; sem DDD, tudo no telefone */
function separarDdd(numero: string): { ddd: string; telefone: string } {
  const digitos = apenasDigitos(numero);
  if (digitos.length === 10 || digitos.length === 11) return { ddd: digitos.slice(0, 2), telefone: digitos.slice(2) };
  return { ddd: "", telefone: numero.trim() };
}

export function basicosDoCliente(c: ClienteForm): DadosBasicos {
  return {
    documento: c.documento,
    nome: c.nome,
    ...separarDdd(c.whatsapp),
    email: c.preservado.email ?? "",
    status: c.status,
    endereco: c.endereco,
  };
}

export function basicosDoFornecedor(f: FornecedorForm): DadosBasicos {
  return {
    documento: f.documento,
    nome: f.razaoSocial.trim() || f.nomeFantasia,
    ddd: f.ddd,
    telefone: f.telefone,
    email: "",
    status: f.status,
    endereco: f.endereco,
  };
}

export function basicosDoFuncionario(f: FuncionarioForm): DadosBasicos {
  return {
    documento: f.documento,
    nome: f.nome,
    ddd: f.ddd,
    telefone: f.telefone,
    email: f.email,
    status: f.status,
    endereco: f.endereco,
  };
}

/** Só o que foi preenchido substitui o valor do destino */
function ou(origem: string, destino: string) {
  return origem.trim() ? origem : destino;
}

/** Tipo e país já vêm preenchidos no endereço vazio: não contam */
function enderecoPreenchido(e: EnderecoForm) {
  return [e.cep, e.uf, e.bairro, e.cidade, e.logradouro, e.numero, e.complemento].some((v) => v.trim() !== "");
}

export function clienteComBasicos(c: ClienteForm, b: DadosBasicos): ClienteForm {
  const telefone = b.telefone.trim() ? `${b.ddd}${b.telefone}` : "";
  return {
    ...c,
    documento: ou(b.documento, c.documento),
    nome: ou(b.nome, c.nome),
    whatsapp: ou(telefone, c.whatsapp),
    status: b.status,
    endereco: enderecoPreenchido(b.endereco) ? b.endereco : c.endereco,
  };
}

export function fornecedorComBasicos(f: FornecedorForm, b: DadosBasicos): FornecedorForm {
  return {
    ...f,
    documento: ou(b.documento, f.documento),
    razaoSocial: ou(b.nome, f.razaoSocial),
    ddd: ou(b.ddd, f.ddd),
    telefone: ou(b.telefone, f.telefone),
    status: b.status,
    endereco: enderecoPreenchido(b.endereco) ? b.endereco : f.endereco,
  };
}

export function funcionarioComBasicos(f: FuncionarioForm, b: DadosBasicos): FuncionarioForm {
  return {
    ...f,
    documento: ou(b.documento, f.documento),
    nome: ou(b.nome, f.nome),
    ddd: ou(b.ddd, f.ddd),
    telefone: ou(b.telefone, f.telefone),
    email: ou(b.email, f.email),
    status: b.status,
    endereco: enderecoPreenchido(b.endereco) ? b.endereco : f.endereco,
  };
}
