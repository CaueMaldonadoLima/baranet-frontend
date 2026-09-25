import { describe, expect, it } from "vitest";
import type { Supplier } from "@/services/types";
import {
  fornecedorParaForm,
  fornecedorVazio,
  formParaFornecedorWrite,
  validarFornecedor,
} from "./fornecedor-form";

const supplierCompleto: Supplier = {
  id: 42,
  personId: 7,
  personType: "juridica",
  name: "Lentes Sul",
  legalName: "Lentes Sul Comércio Ltda",
  tradeName: "Lentes Sul",
  document: "12345678000190",
  cnpj: "12345678000190",
  ddd: "11",
  phone: "99999-0000",
  status: "inativo",
  siteUrl: "https://lentessul.com.br",
  stateRegistration: "123.456",
  supplierOf: "Lentes",
  accountingGroup: "Fornecedores",
  defaultCfop: "1102",
  taxRegime: "presumido",
  purchaseCode: "LS-01",
  isDeliverySupplier: true,
  isUtilitiesSupplier: false,
  isCardSupplier: true,
  deliveryFinance: { generatesPayablePerOrder: true, batchOrderClosing: false, enableCustomerBilling: true },
  card: { dueDay: 10, closingDay: 3, limit: 5000 },
  fiscalRules: {
    financialClosingEnabled: true,
    financialClosingDays: 15,
    autoFinanceOnXml: true,
    isRealProfitExpense: false,
    keepSalePriceOnXml: true,
    divergenceCreatesCreditTask: false,
  },
  consumptionProducts: { enabled: true, types: ["Lentes"], brands: ["Zeiss"] },
  resaleProducts: { enabled: false, types: [], brands: [] },
  address: { zip: "01001000", state: "SP", city: "São Paulo", street: "Praça da Sé", number: "1", neighborhood: "Sé", complement: null, country: "Brasil", streetType: null },
  emails: [{ id: 1, description: "Financeiro", sector: "financeiro", email: "fin@lentessul.com.br" }],
  allowedStores: [{ id: 2, name: "Loja Centro" }],
  allowedUsers: [{ id: 5, name: "Ana" }],
  lastOrder: null,
  totalOrders: 0,
};

describe("fornecedorParaForm", () => {
  it("carrega todos os campos do fornecedor no formulário", () => {
    const form = fornecedorParaForm(supplierCompleto);
    expect(form.pessoa).toBe("juridica");
    expect(form.nomeFantasia).toBe("Lentes Sul");
    expect(form.razaoSocial).toBe("Lentes Sul Comércio Ltda");
    expect(form.documento).toBe("12345678000190");
    expect(form.status).toBe("inativo");
    expect(form.cfop).toBe("1102");
    expect(form.endereco.cidade).toBe("São Paulo");
    expect(form.endereco.cep).toBe("01001000");
    expect(form.entregas).toBe(true);
    expect(form.financeiroEntregas).toEqual({ contasPorPedido: true, fechamentoPedidos: false, cobrancaCliente: true });
    expect(form.cartao).toEqual({ ativo: true, vencimento: "10", fechamento: "3", limite: "5000" });
    expect(form.regras.fechamentoDias).toBe("15");
    expect(form.consumo).toEqual({ ativo: true, tipos: ["Lentes"], marcas: ["Zeiss"] });
    expect(form.emails).toEqual([{ descricao: "Financeiro", setor: "financeiro", email: "fin@lentessul.com.br" }]);
    expect(form.lojasPermitidas).toEqual([{ id: 2, name: "Loja Centro" }]);
    expect(form.usuariosPermitidos).toEqual([{ id: 5, name: "Ana" }]);
  });

  it("usa valores padrão quando a API omite os blocos opcionais", () => {
    const form = fornecedorParaForm({ id: 1, personId: 1, name: "X", cnpj: null, phone: null, lastOrder: null, totalOrders: 0 });
    expect(form).toEqual({ ...fornecedorVazio(), nomeFantasia: "X" });
  });

  it("cai para o cnpj legado quando document não vem", () => {
    const form = fornecedorParaForm({ ...supplierCompleto, document: null, cnpj: "11222333000144" });
    expect(form.documento).toBe("11222333000144");
  });
});

describe("formParaFornecedorWrite", () => {
  it("volta ao mesmo payload que a API mandou (ida e volta)", () => {
    const write = formParaFornecedorWrite(fornecedorParaForm(supplierCompleto));
    expect(write).toMatchObject({
      personType: "juridica",
      name: "Lentes Sul",
      tradeName: "Lentes Sul",
      legalName: "Lentes Sul Comércio Ltda",
      document: "12345678000190",
      ddd: "11",
      phone: "99999-0000",
      status: "inativo",
      defaultCfop: "1102",
      isCardSupplier: true,
      card: { dueDay: 10, closingDay: 3, limit: 5000 },
      fiscalRules: { financialClosingEnabled: true, financialClosingDays: 15 },
      deliveryFinance: { generatesPayablePerOrder: true, batchOrderClosing: false, enableCustomerBilling: true },
      emails: [{ description: "Financeiro", sector: "financeiro", email: "fin@lentessul.com.br" }],
      allowedStoreIds: [2],
      allowedUserIds: [5],
      address: { zip: "01001000", state: "SP", city: "São Paulo", street: "Praça da Sé", number: "1", neighborhood: "Sé", country: "Brasil" },
    });
  });

  it("tira a máscara do documento e omite campos vazios", () => {
    const write = formParaFornecedorWrite({
      ...fornecedorVazio(),
      nomeFantasia: "  Ótica Fornece  ",
      documento: "12.345.678/0001-90",
    });
    expect(write.name).toBe("Ótica Fornece");
    expect(write.document).toBe("12345678000190");
    expect(write).not.toHaveProperty("siteUrl");
    expect(write).not.toHaveProperty("defaultCfop");
    expect(write).not.toHaveProperty("legalName");
  });

  it("usa a razão social como nome quando não há nome fantasia", () => {
    const write = formParaFornecedorWrite({ ...fornecedorVazio(), razaoSocial: "Razão Ltda" });
    expect(write.name).toBe("Razão Ltda");
    expect(write.legalName).toBe("Razão Ltda");
  });

  it("não manda os dados do cartão quando não é fornecedor de cartão", () => {
    const write = formParaFornecedorWrite({
      ...fornecedorVazio(),
      nomeFantasia: "X",
      cartao: { ativo: false, vencimento: "10", fechamento: "5", limite: "100" },
    });
    expect(write.isCardSupplier).toBe(false);
    expect(write).not.toHaveProperty("card");
  });

  it("aceita limite com vírgula decimal", () => {
    const write = formParaFornecedorWrite({
      ...fornecedorVazio(),
      nomeFantasia: "X",
      cartao: { ativo: true, vencimento: "", fechamento: "", limite: "1.500,50" },
    });
    expect(write.card).toEqual({ limit: 1500.5 });
  });

  it("só manda os dias de fechamento com a regra ligada", () => {
    const base = fornecedorVazio();
    const desligado = formParaFornecedorWrite({
      ...base,
      nomeFantasia: "X",
      regras: { ...base.regras, fechamentoFinanceiro: false, fechamentoDias: "30" },
    });
    expect(desligado.fiscalRules).not.toHaveProperty("financialClosingDays");
  });
});

describe("validarFornecedor", () => {
  it("exige nome fantasia ou razão social", () => {
    expect(validarFornecedor(fornecedorVazio())).toBe("Informe ao menos o nome fantasia ou a razão social.");
    expect(validarFornecedor({ ...fornecedorVazio(), razaoSocial: "R" })).toBeNull();
  });

  it("recusa CFOP que não tenha 4 dígitos", () => {
    expect(validarFornecedor({ ...fornecedorVazio(), nomeFantasia: "X", cfop: "110" })).toBe(
      "O CFOP precisa ter 4 dígitos."
    );
  });

  it("recusa dia do cartão fora de 1 a 31", () => {
    const f = { ...fornecedorVazio(), nomeFantasia: "X", cartao: { ativo: true, vencimento: "32", fechamento: "", limite: "" } };
    expect(validarFornecedor(f)).toBe("Os dias de vencimento e fechamento do cartão vão de 1 a 31.");
  });

  it("recusa e-mail inválido na lista", () => {
    const f = { ...fornecedorVazio(), nomeFantasia: "X", emails: [{ descricao: "", setor: "", email: "sem-arroba" }] };
    expect(validarFornecedor(f)).toBe("E-mail inválido: sem-arroba");
  });
});

describe("formParaFornecedorWrite ao editar", () => {
  it("manda null nos campos que o usuário apagou, para a API limpar", () => {
    const form = { ...fornecedorParaForm(supplierCompleto), site: "", cfop: "", fornecedorDe: "" };
    const write = formParaFornecedorWrite(form, "editar");
    expect(write.siteUrl).toBeNull();
    expect(write.defaultCfop).toBeNull();
    expect(write.supplierOf).toBeNull();
  });

  it("limpa os dias de fechamento e os dados do cartão apagados", () => {
    const base = fornecedorParaForm(supplierCompleto);
    const write = formParaFornecedorWrite(
      { ...base, regras: { ...base.regras, fechamentoDias: "" }, cartao: { ...base.cartao, limite: "" } },
      "editar"
    );
    expect(write.fiscalRules?.financialClosingDays).toBeNull();
    expect(write.card).toEqual({ dueDay: 10, closingDay: 3, limit: null });
  });

  it("limpa o endereço apagado", () => {
    const base = fornecedorParaForm(supplierCompleto);
    const write = formParaFornecedorWrite({ ...base, endereco: { ...base.endereco, complemento: "", numero: "" } }, "editar");
    expect(write.address?.number).toBeNull();
    expect(write.address?.complement).toBeNull();
  });

  it("devolve os campos que o formulário não mostra (e-mail, contato, categoria, laboratórios)", () => {
    const write = formParaFornecedorWrite(
      fornecedorParaForm({
        ...supplierCompleto,
        email: "contato@ls.com.br",
        contact: "João",
        category: "Lentes",
        laboratories: [{ id: 9, slot: 1, active: true, name: "Lab A" }],
      }),
      "editar"
    );
    expect(write).toMatchObject({
      email: "contato@ls.com.br",
      contact: "João",
      category: "Lentes",
      laboratories: [{ slot: 1, active: true, name: "Lab A" }],
    });
  });

  it("ao criar, continua omitindo o que está vazio", () => {
    const write = formParaFornecedorWrite({ ...fornecedorVazio(), nomeFantasia: "X" }, "criar");
    expect(write).not.toHaveProperty("siteUrl");
    expect(write).not.toHaveProperty("email");
  });
});
