import type { Supplier, SupplierAllowed, SupplierWrite } from "@/services/types";
import {
  apenasDigitos,
  emailValido,
  enderecoParaForm,
  enderecoVazio,
  formParaEndereco,
  limpos,
  numeroNoModo,
  numeroOuUndefined,
  semVazios,
  textoDeNumero,
  type EnderecoForm,
  type Modo,
} from "./comum";

// Formulário do fornecedor (tela 01) e a conversão de/para o schema da API
// (Supplier / SupplierWrite). Os campos que a API ainda não tem ficam fora
// deste formulário, só na tela. Os que a API tem mas a tela não mostra vêm em
// `preservado` e voltam intactos ao gravar, para a edição não apagá-los.

export interface BlocoProdutosForm {
  ativo: boolean;
  tipos: string[];
  marcas: string[];
}

export interface EmailFornecedorForm {
  descricao: string;
  setor: string;
  email: string;
}

export interface FornecedorForm {
  pessoa: "fisica" | "juridica";
  documento: string;
  ddd: string;
  telefone: string;
  status: "ativo" | "inativo";
  nomeFantasia: string;
  razaoSocial: string;
  inscricaoEstadual: string;
  cfop: string;
  regimeTributario: string;
  codigoCompras: string;
  site: string;
  endereco: EnderecoForm;
  /** Fornecedor de entregas */
  entregas: boolean;
  financeiroEntregas: { contasPorPedido: boolean; fechamentoPedidos: boolean; cobrancaCliente: boolean };
  lojasPermitidas: SupplierAllowed[];
  usuariosPermitidos: SupplierAllowed[];
  /** Fornecedor de água/luz/internet */
  contasConsumo: boolean;
  cartao: { ativo: boolean; vencimento: string; fechamento: string; limite: string };
  regras: {
    fechamentoFinanceiro: boolean;
    fechamentoDias: string;
    financeiroNoXml: boolean;
    despesaLucroReal: boolean;
    mantemPrecoNoXml: boolean;
    divergenciaGeraCredito: boolean;
  };
  fornecedorDe: string;
  grupoContabil: string;
  consumo: BlocoProdutosForm;
  revenda: BlocoProdutosForm;
  emails: EmailFornecedorForm[];
  preservado: Pick<SupplierWrite, "email" | "contact" | "category" | "laboratories">;
}

function blocoVazio(): BlocoProdutosForm {
  return { ativo: false, tipos: [], marcas: [] };
}

export function fornecedorVazio(): FornecedorForm {
  return {
    pessoa: "juridica",
    documento: "",
    ddd: "",
    telefone: "",
    status: "ativo",
    nomeFantasia: "",
    razaoSocial: "",
    inscricaoEstadual: "",
    cfop: "",
    regimeTributario: "simples",
    codigoCompras: "",
    site: "",
    endereco: enderecoVazio(),
    entregas: false,
    financeiroEntregas: { contasPorPedido: false, fechamentoPedidos: false, cobrancaCliente: false },
    lojasPermitidas: [],
    usuariosPermitidos: [],
    contasConsumo: false,
    cartao: { ativo: false, vencimento: "", fechamento: "", limite: "" },
    regras: {
      fechamentoFinanceiro: false,
      fechamentoDias: "",
      financeiroNoXml: false,
      despesaLucroReal: false,
      mantemPrecoNoXml: false,
      divergenciaGeraCredito: false,
    },
    fornecedorDe: "",
    grupoContabil: "",
    consumo: blocoVazio(),
    revenda: blocoVazio(),
    emails: [],
    preservado: {},
  };
}

function blocoParaForm(bloco: Supplier["consumptionProducts"]): BlocoProdutosForm {
  return {
    ativo: bloco?.enabled ?? false,
    tipos: bloco?.types ?? [],
    marcas: bloco?.brands ?? [],
  };
}

export function fornecedorParaForm(s: Supplier): FornecedorForm {
  const vazio = fornecedorVazio();
  return {
    ...vazio,
    pessoa: s.personType ?? vazio.pessoa,
    documento: s.document ?? s.cnpj ?? "",
    ddd: s.ddd ?? "",
    telefone: s.phone ?? "",
    status: s.status ?? vazio.status,
    nomeFantasia: s.tradeName ?? (s.legalName ? "" : s.name),
    razaoSocial: s.legalName ?? "",
    inscricaoEstadual: s.stateRegistration ?? "",
    cfop: s.defaultCfop ?? "",
    regimeTributario: s.taxRegime ?? vazio.regimeTributario,
    codigoCompras: s.purchaseCode ?? "",
    site: s.siteUrl ?? "",
    endereco: enderecoParaForm(s.address),
    entregas: s.isDeliverySupplier ?? false,
    financeiroEntregas: {
      contasPorPedido: s.deliveryFinance?.generatesPayablePerOrder ?? false,
      fechamentoPedidos: s.deliveryFinance?.batchOrderClosing ?? false,
      cobrancaCliente: s.deliveryFinance?.enableCustomerBilling ?? false,
    },
    lojasPermitidas: (s.allowedStores ?? []).map(({ id, name }) => ({ id, name })),
    usuariosPermitidos: (s.allowedUsers ?? []).map(({ id, name }) => ({ id, name })),
    contasConsumo: s.isUtilitiesSupplier ?? false,
    cartao: {
      ativo: s.isCardSupplier ?? false,
      vencimento: textoDeNumero(s.card?.dueDay),
      fechamento: textoDeNumero(s.card?.closingDay),
      limite: textoDeNumero(s.card?.limit),
    },
    regras: {
      fechamentoFinanceiro: s.fiscalRules?.financialClosingEnabled ?? false,
      fechamentoDias: textoDeNumero(s.fiscalRules?.financialClosingDays),
      financeiroNoXml: s.fiscalRules?.autoFinanceOnXml ?? false,
      despesaLucroReal: s.fiscalRules?.isRealProfitExpense ?? false,
      mantemPrecoNoXml: s.fiscalRules?.keepSalePriceOnXml ?? false,
      divergenciaGeraCredito: s.fiscalRules?.divergenceCreatesCreditTask ?? false,
    },
    fornecedorDe: s.supplierOf ?? "",
    grupoContabil: s.accountingGroup ?? "",
    consumo: blocoParaForm(s.consumptionProducts),
    revenda: blocoParaForm(s.resaleProducts),
    emails: (s.emails ?? []).map((e) => ({
      descricao: e.description ?? "",
      setor: e.sector ?? "",
      email: e.email,
    })),
    preservado: semVazios({
      email: s.email ?? undefined,
      contact: s.contact ?? undefined,
      category: s.category ?? undefined,
      laboratories: s.laboratories?.map(({ slot, active, name }) => ({ slot, active, name })),
    }),
  };
}

export function formParaFornecedorWrite(f: FornecedorForm, modo: Modo = "criar"): SupplierWrite {
  const nome = f.nomeFantasia.trim() || f.razaoSocial.trim();

  const card = f.cartao.ativo
    ? semVazios({
        dueDay: numeroNoModo(modo, f.cartao.vencimento),
        closingDay: numeroNoModo(modo, f.cartao.fechamento),
        limit: numeroNoModo(modo, f.cartao.limite),
      })
    : undefined;

  const fechamentoDias = f.regras.fechamentoFinanceiro
    ? numeroNoModo(modo, f.regras.fechamentoDias)
    : modo === "editar"
      ? null
      : undefined;

  const write: SupplierWrite = {
    ...(modo === "editar" ? f.preservado : {}),
    ...limpos(modo, {
      personType: f.pessoa,
      name: nome,
      tradeName: f.nomeFantasia,
      legalName: f.razaoSocial,
      document: apenasDigitos(f.documento),
      ddd: f.ddd,
      phone: f.telefone,
      siteUrl: f.site,
      stateRegistration: f.inscricaoEstadual,
      supplierOf: f.fornecedorDe,
      accountingGroup: f.grupoContabil,
      defaultCfop: apenasDigitos(f.cfop),
      taxRegime: f.regimeTributario,
      purchaseCode: f.codigoCompras,
    }),
    status: f.status,
    isDeliverySupplier: f.entregas,
    isUtilitiesSupplier: f.contasConsumo,
    isCardSupplier: f.cartao.ativo,
    deliveryFinance: {
      generatesPayablePerOrder: f.financeiroEntregas.contasPorPedido,
      batchOrderClosing: f.financeiroEntregas.fechamentoPedidos,
      enableCustomerBilling: f.financeiroEntregas.cobrancaCliente,
    },
    fiscalRules: {
      financialClosingEnabled: f.regras.fechamentoFinanceiro,
      ...(fechamentoDias !== undefined ? { financialClosingDays: fechamentoDias } : {}),
      autoFinanceOnXml: f.regras.financeiroNoXml,
      isRealProfitExpense: f.regras.despesaLucroReal,
      keepSalePriceOnXml: f.regras.mantemPrecoNoXml,
      divergenceCreatesCreditTask: f.regras.divergenciaGeraCredito,
    },
    consumptionProducts: { enabled: f.consumo.ativo, types: f.consumo.tipos, brands: f.consumo.marcas },
    resaleProducts: { enabled: f.revenda.ativo, types: f.revenda.tipos, brands: f.revenda.marcas },
    address: formParaEndereco(f.endereco, modo),
    emails: f.emails.map((e) => ({ ...limpos(modo, { description: e.descricao, sector: e.setor }), email: e.email.trim() })),
    allowedStoreIds: f.lojasPermitidas.map((l) => l.id),
    allowedUserIds: f.usuariosPermitidos.map((u) => u.id),
  };
  if (card) write.card = card;
  return write;
}

/** Mensagem do primeiro problema do formulário, ou null se pode gravar */
export function validarFornecedor(f: FornecedorForm): string | null {
  if (!f.nomeFantasia.trim() && !f.razaoSocial.trim()) {
    return "Informe ao menos o nome fantasia ou a razão social.";
  }
  const cfop = apenasDigitos(f.cfop);
  if (cfop && cfop.length !== 4) return "O CFOP precisa ter 4 dígitos.";
  if (f.cartao.ativo) {
    for (const dia of [f.cartao.vencimento, f.cartao.fechamento]) {
      const n = numeroOuUndefined(dia);
      if (n !== undefined && (!Number.isInteger(n) || n < 1 || n > 31)) {
        return "Os dias de vencimento e fechamento do cartão vão de 1 a 31.";
      }
    }
  }
  const invalido = f.emails.find((e) => !emailValido(e.email));
  if (invalido) return `E-mail inválido: ${invalido.email}`;
  return null;
}
