import type { Employee, EmployeeRole, EmployeeWrite } from "@/services/types";
import {
  apenasDigitos,
  emailValido,
  enderecoParaForm,
  enderecoVazio,
  formParaEndereco,
  limpos,
  numeroNoModo,
  textoDeNumero,
  type EnderecoForm,
  type Modo,
} from "./comum";

// Formulário do funcionário e a conversão de/para o schema da API (Employee /
// EmployeeWrite). Horários, direitos de acesso, RH e benefícios ainda não
// existem na API: ficam só na tela (FuncionarioSecoes).

export const FUNCOES: { value: EmployeeRole; label: string }[] = [
  { value: "gerente", label: "Gerente" },
  { value: "vendedor", label: "Vendedor" },
  { value: "optometrista", label: "Optometrista" },
  { value: "caixa", label: "Caixa" },
];

export interface FuncionarioForm {
  pessoa: "fisica" | "juridica";
  documento: string;
  ddd: string;
  telefone: string;
  status: "ativo" | "inativo";
  nome: string;
  email: string;
  funcao: EmployeeRole | "";
  /** Percentual, como digitado (aceita vírgula) */
  comissao: string;
  /** Id da loja, como string (o Select trabalha com string) */
  lojaId: string;
  /** Sem senha, a API gera um código de primeiro acesso */
  senhaManual: boolean;
  senha: string;
  confirmacaoSenha: string;
  /** Só exibição: o funcionário já tem senha cadastrada */
  temSenha: boolean;
  endereco: EnderecoForm;
}

export function funcionarioVazio(): FuncionarioForm {
  return {
    pessoa: "fisica",
    documento: "",
    ddd: "",
    telefone: "",
    status: "ativo",
    nome: "",
    email: "",
    funcao: "",
    comissao: "",
    lojaId: "",
    senhaManual: false,
    senha: "",
    confirmacaoSenha: "",
    temSenha: false,
    endereco: enderecoVazio(),
  };
}

export function funcionarioParaForm(e: Employee): FuncionarioForm {
  const vazio = funcionarioVazio();
  return {
    ...vazio,
    pessoa: e.personType ?? vazio.pessoa,
    documento: e.document ?? "",
    ddd: e.ddd ?? "",
    telefone: e.phone ?? "",
    status: e.status ?? vazio.status,
    nome: e.name,
    email: e.email ?? "",
    funcao: e.role ?? "",
    comissao: textoDeNumero(e.commission),
    lojaId: e.storeId ?? "",
    temSenha: e.hasPassword ?? false,
    endereco: enderecoParaForm(e.address),
  };
}

export function formParaFuncionarioWrite(f: FuncionarioForm, modo: Modo = "criar"): EmployeeWrite {
  const lojaId = f.lojaId ? Number(f.lojaId) : modo === "editar" ? null : undefined;
  const write: EmployeeWrite = {
    ...limpos(modo, {
      name: f.nome,
      document: apenasDigitos(f.documento),
      ddd: f.ddd,
      phone: f.telefone,
      email: f.email,
      commission: numeroNoModo(modo, f.comissao),
      storeId: lojaId,
    }),
    personType: f.pessoa,
    status: f.status,
    address: formParaEndereco(f.endereco, modo),
  };
  if (f.funcao) write.role = f.funcao;
  // Senha só vai quando digitada: ao editar, sem senha mantém a atual.
  if (f.senhaManual && f.senha) {
    write.password = f.senha;
    write.password_confirmation = f.confirmacaoSenha;
  }
  return write;
}

export function validarFuncionario(f: FuncionarioForm): string | null {
  if (!f.nome.trim()) return "Informe o nome do funcionário.";
  if (!f.email.trim()) return "Informe o e-mail do funcionário.";
  if (!emailValido(f.email)) return "Informe um e-mail válido.";
  if (!f.funcao) return "Selecione a função do funcionário.";
  if (f.senhaManual) {
    if (!f.senha) return "Informe a senha ou desmarque “Definir senha manualmente”.";
    if (f.senha !== f.confirmacaoSenha) return "As senhas não conferem.";
  }
  return null;
}
