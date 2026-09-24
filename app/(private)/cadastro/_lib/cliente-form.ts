import type { CustomerDetail, CustomerWrite } from "@/services/types";
import {
  apenasDigitos,
  enderecoParaForm,
  enderecoVazio,
  formParaEndereco,
  limpos,
  semVazios,
  type EnderecoForm,
  type Modo,
} from "./comum";

// Formulário do cliente (tela 02) e a conversão de/para o schema da API
// (Customer / CustomerWrite). Foto e QR Code ainda não vão para a API: ela
// recebe photoUrl, e não há envio de arquivo. Os campos que a API tem mas a
// tela não mostra vêm em `preservado` e voltam intactos ao gravar.

export interface ClienteForm {
  documento: string;
  whatsapp: string;
  nome: string;
  /** otimo | bom | regular | ruim — a API guarda em maiúsculas (ex: OTIMO) */
  tipoCliente: string;
  status: "ativo" | "inativo";
  menorSemCpf: boolean;
  rg: string;
  nascimento: string;
  sexo: string;
  estadoCivil: string;
  natural: string;
  dddComercial: string;
  telefoneComercial: string;
  ramal: string;
  estrangeiro: boolean;
  documentoEstrangeiro: string;
  emissaoRg: string;
  orgaoEmissorRg: string;
  ufRg: string;
  apelido: string;
  pais: string;
  endereco: EnderecoForm;
  /** Preenchidos pelo sistema: só exibição (YYYY-MM-DD) */
  ultimaCompra: string;
  dataCadastro: string;
  atualizacao: string;
  preservado: Pick<CustomerWrite, "personType" | "ddd" | "phone" | "email" | "photoUrl" | "socialNetworks">;
}

export function clienteVazio(): ClienteForm {
  return {
    documento: "",
    whatsapp: "",
    nome: "",
    tipoCliente: "otimo",
    status: "ativo",
    menorSemCpf: false,
    rg: "",
    nascimento: "",
    sexo: "",
    estadoCivil: "",
    natural: "",
    dddComercial: "",
    telefoneComercial: "",
    ramal: "",
    estrangeiro: false,
    documentoEstrangeiro: "",
    emissaoRg: "",
    orgaoEmissorRg: "",
    ufRg: "",
    apelido: "",
    pais: "Brasil",
    endereco: enderecoVazio(),
    ultimaCompra: "",
    dataCadastro: "",
    atualizacao: "",
    preservado: {},
  };
}

/** "2025-01-02T10:00:00Z" → "2025-01-02" */
function data(valor: string | null | undefined) {
  return valor ? valor.slice(0, 10) : "";
}

export function clienteParaForm(c: CustomerDetail): ClienteForm {
  const vazio = clienteVazio();
  const endereco = enderecoParaForm(c.address);
  return {
    ...vazio,
    documento: c.document ?? "",
    whatsapp: c.whatsapp ?? "",
    nome: c.name,
    tipoCliente: c.customerType ? c.customerType.toLowerCase() : vazio.tipoCliente,
    status: c.status ?? vazio.status,
    menorSemCpf: c.allowWithoutDocument ?? false,
    rg: c.rg ?? "",
    nascimento: data(c.birthDate),
    sexo: c.gender ?? "",
    estadoCivil: c.maritalStatus ?? "",
    natural: c.birthplace ?? "",
    dddComercial: c.commercialDdd ?? "",
    telefoneComercial: c.commercialPhone ?? "",
    ramal: c.extension ?? "",
    estrangeiro: c.isForeigner ?? false,
    documentoEstrangeiro: c.foreignerStatus ?? "",
    emissaoRg: data(c.rgIssueDate),
    orgaoEmissorRg: c.rgIssuer ?? "",
    ufRg: c.rgState ?? "",
    apelido: c.nickname ?? "",
    pais: endereco.pais,
    endereco,
    ultimaCompra: data(c.lastPurchase),
    dataCadastro: data(c.registeredAt),
    atualizacao: data(c.updatedAt),
    preservado: semVazios({
      personType: c.personType ?? undefined,
      ddd: c.ddd ?? undefined,
      phone: c.phone ?? undefined,
      email: c.email ?? undefined,
      photoUrl: c.photoUrl ?? undefined,
      socialNetworks: c.socialNetworks
        ? semVazios(Object.fromEntries(Object.entries(c.socialNetworks).map(([k, v]) => [k, v ?? undefined])))
        : undefined,
    }),
  };
}

export function formParaClienteWrite(f: ClienteForm, modo: Modo = "criar"): CustomerWrite {
  const endereco = formParaEndereco(f.endereco, modo);
  return {
    ...(modo === "editar" ? f.preservado : {}),
    ...limpos(modo, {
      name: f.nome,
      document: f.menorSemCpf ? "" : apenasDigitos(f.documento),
      whatsapp: f.whatsapp,
      customerType: f.tipoCliente.toUpperCase(),
      rg: f.rg,
      birthDate: f.nascimento,
      gender: f.sexo,
      maritalStatus: f.estadoCivil,
      birthplace: f.natural,
      commercialDdd: f.dddComercial,
      commercialPhone: f.telefoneComercial,
      extension: f.ramal,
      foreignerStatus: f.estrangeiro ? f.documentoEstrangeiro : "",
      rgIssueDate: f.emissaoRg,
      rgIssuer: f.orgaoEmissorRg,
      rgState: f.ufRg,
      nickname: f.apelido,
      country: f.pais,
      // Cidade/UF também no topo: é o que a listagem de clientes mostra.
      city: endereco.city,
      state: endereco.state,
    }),
    status: f.status,
    allowWithoutDocument: f.menorSemCpf,
    isForeigner: f.estrangeiro,
    address: endereco,
  };
}

export function validarCliente(f: ClienteForm): string | null {
  if (!f.nome.trim()) return "Informe o nome do cliente.";
  return null;
}
